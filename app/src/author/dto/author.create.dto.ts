import { ApiModelProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class AuthorCreateDTO {
  @ApiModelProperty()
  @IsNotEmpty()
  first_name: string;

  @ApiModelProperty()
  @IsNotEmpty()
  last_name: string;
}
