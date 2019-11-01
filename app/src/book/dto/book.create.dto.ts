import { ApiModelProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class BookCreateDTO {
  @ApiModelProperty()
  @IsNotEmpty()
  title: string;

  @ApiModelProperty()
  @IsNotEmpty()
  author_id: number;

  @ApiModelProperty()
  @IsNotEmpty()
  genre_id: number;
}
