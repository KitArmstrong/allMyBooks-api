import { ApiModelProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class AuthRegisterDTO {
  @ApiModelProperty()
  @IsNotEmpty()
  user_type_id: number;

  @ApiModelProperty()
  @IsNotEmpty()
  user_status_id: number;

  @ApiModelProperty()
  @IsNotEmpty()
  email: string;

  @ApiModelProperty()
  @IsNotEmpty()
  password: string;

  @ApiModelProperty()
  @IsNotEmpty()
  first_name: string;

  @ApiModelProperty()
  @IsNotEmpty()
  last_name: string;
}
