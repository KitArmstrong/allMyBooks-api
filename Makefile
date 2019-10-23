#!make

include .env
-include app/.env

export $(shell sed 's/=.*//' .env)
ifneq ("$(wildcard app/.env)","")
	export $(shell sed 's/=.*//' app/.env)
endif

export GIT_LOCAL_BRANCH?=$(shell git rev-parse --abbrev-ref HEAD)
export DEPLOY_DATE?=$(shell date '+%Y%m%d%H%M')

define deployTag
"${PROJECT}-${DEPLOY_DATE}"
endef

# local-development          - Build and run the development image locally
# local-production           - Build and run the production image locally
# pipeline-deploy-dev        - Rebuild development environment, push production image to ECR, generate Dockerrun.aws.json, then deploys to Elasticbeanstalk
# pipeline-deploy-staging    - Rebuild staging environment, push production image to ECR, generate Dockerrun.aws.json, then deploys to Elasticbeanstalk
# pipeline-deploy-production - Rebuild production environment, push production image to ECR, generate Dockerrun.aws.json, then deploys to Elasticbeanstalk
# pipeline-audit             - Installs node modules and runs the security scan

local-development:          | build-local-development run-local-development
local-production:           | build-local-production run-local-production
pipeline-deploy-dev:        | pipeline-build pipeline-push pipeline-deploy-prep pipeline-deploy-version
pipeline-deploy-staging:    | pipeline-build pipeline-push pipeline-deploy-prep pipeline-deploy-version
pipeline-deploy-production: | pipeline-build pipeline-push pipeline-deploy-prep pipeline-deploy-version
pipeline-audit:             | pipeline-build-audit pipeline-report-audit

#################
# Status Output #
#################

print-status:
	@echo " +---------------------------------------------------------+ "
	@echo " | Current Settings                                        | "
	@echo " +---------------------------------------------------------+ "
	@echo " | ACCOUNT ID: $(ACCOUNT_ID) "
	@echo " | S3 BUCKET: $(S3_BUCKET) "
	@echo " | PROJECT: $(PROJECT) "
	@echo " | REGION: $(REGION) "
	@echo " | PROFILE: $(PROFILE) "
	@echo " | DEPLOY ENV: $(DEPLOY_ENV) "
	@echo " | MERGE BRANCH: $(MERGE_BRANCH) "
	@echo " +---------------------------------------------------------+ "

####################
# Utility commands #
####################

setup-local-env:
	@echo "+\n++ Make: Preparing project for test environment...\n+"
	@cp .config/ app/.env

setup-test-env:
	@echo "+\n++ Make: Preparing project for test environment...\n+"
	@cp .config/.env.test app/.env

setup-development-env:
	@echo "+\n++ Make: Preparing project for dev environment...\n+"
	@cp .config/.env.dev app/.env

setup-staging-env:
	@echo "+\n++ Make: Preparing project for staging environment...\n+"
	@cp .config/.env.staging app/.env

setup-production-env:
	@echo "+\n++ Make: Preparing project for production environment...\n+"
	@cp .config/.env.production app/.env

# Set an AWS profile for pipeline
setup-aws-profile:
	@echo "+\n++ Make: Setting AWS Profile...\n+"
	@aws configure set aws_access_key_id $(AWS_ACCESS_KEY_ID) --profile $(PROFILE)
	@aws configure set aws_secret_access_key $(AWS_SECRET_ACCESS_KEY) --profile $(PROFILE)

# Generates ECR (Elastic Container Registry) repos, given the proper credentials
create-ecr-repos:
	@echo "+\n++ Creating EC2 Container repositories...\n+"
	@$(shell aws ecr get-login --no-include-email --profile $(PROFILE) --region $(REGION))
	@aws ecr create-repository --profile $(PROFILE) --region $(REGION) --repository-name $(PROJECT) || :
	@aws iam attach-role-policy --role-name aws-elasticbeanstalk-ec2-role --policy-arn arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryReadOnly --profile $(PROFILE) --region $(REGION)

##############################
# Local development commands #
##############################

build-local-development:
	@echo "+\n++ Building local development Docker image...\n+"
	@docker-compose build

build-local-production:
	@echo "+\n++ Building local production Docker image...\n+"
	@docker-compose -f docker-compose.production.yml build

run-local-development:
	@echo "+\n++ Running development container locally\n+"
	@docker-compose up -d

run-local-production:
	@echo "+\n++ Running production container locally\n+"
	@docker-compose -f docker-compose.production.yml up -d

close-local-development:
	@echo "+\n++ Closing local development container\n+"
	@docker-compose down

close-local-production:
	@echo "+\n++ Closing local production container\n+"
	@docker-compose -f docker-compose.production.yml down

development-workspace:
	@docker exec -it $(PROJECT) bash

development-database:
	@echo "Shelling into local database..."
	@export PGPASSWORD=$(POSTGRES_PASSWORD)
	@docker-compose exec postgres psql -U $(POSTGRES_USER) $(POSTGRES_DB)

##########################################
# Pipeline build and deployment commands #
##########################################

pipeline-build:
	@echo "+\n++ Performing build of Docker images...\n+"
	@echo "Tagging images with: $(GIT_LOCAL_BRANCH)"
	@docker-compose -f docker-compose.production.yml build

pipeline-push:
	@echo "+\n++ Pushing image to Dockerhub...\n+"
	@$(shell aws ecr get-login --no-include-email --region $(REGION) --profile $(PROFILE))
	@docker tag $(PROJECT):$(GIT_LOCAL_BRANCH) $(ACCOUNT_ID).dkr.ecr.$(REGION).amazonaws.com/$(PROJECT):$(MERGE_BRANCH)
	@docker push $(ACCOUNT_ID).dkr.ecr.$(REGION).amazonaws.com/$(PROJECT):$(MERGE_BRANCH)

pipeline-deploy-prep:
	@echo "+\n++ Creating Dockerrun.aws.json file...\n+"
	@.build/env_options.sh < app/.env > .ebextensions/options.config
	@.build/build_dockerrun.sh > Dockerrun.aws.json

pipeline-deploy-version:
	@echo "+\n++ Deploying to Elasticbeanstalk...\n+"
	@zip -r $(call deployTag).zip .ebextensions Dockerrun.aws.json
	@aws --profile $(PROFILE) configure set region $(REGION)
	@aws --profile $(PROFILE) s3 cp $(call deployTag).zip s3://$(S3_BUCKET)/$(PROJECT)/$(call deployTag).zip
	@aws --profile $(PROFILE) elasticbeanstalk create-application-version --application-name $(PROJECT) --version-label $(call deployTag) --source-bundle S3Bucket="$(S3_BUCKET)",S3Key="$(PROJECT)/$(call deployTag).zip"
	@aws --profile $(PROFILE) elasticbeanstalk update-environment --application-name $(PROJECT) --environment-name $(DEPLOY_ENV) --version-label $(call deployTag)

pipeline-healthcheck:
	@aws --profile $(PROFILE) elasticbeanstalk describe-environments --application-name $(PROJECT) --environment-name $(DEPLOY_ENV) --query 'Environments[*].{Status: Status, Health: Health}'

############################################
# Pipeline lint, test, and report commands #
############################################

pipeline-lint:
	@echo "+\n++ Linting project...\n+"
	@docker-compose -f docker-compose.production.yml run --entrypoint "npm run lint" --name $(PROJECT)-lint application

pipeline-tests:
	@echo "+\n++ Running tests...\n+"
	@docker-compose -f docker-compose.production.yml run --entrypoint "npm run test:ci" --name $(PROJECT) application

pipeline-report:
	@echo "+\n++ Reporting...\n+"
	@docker cp $(PROJECT):/usr/src/app/test-results .

##############################
# Pipeline clean up commands #
##############################

pipeline-clean-up:
	@echo "+\n++ Cleaning up...\n+"
	@docker-compose -f docker-compose.production.yml down
