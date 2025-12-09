import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateOrUpdateRoomDto {
  @ApiProperty({ description: "O título da notícia" })
  @IsString({ message: "O título deve ser uma string" })
  @IsNotEmpty({ message: "O título deve ser preenchido" })
  titulo: string;

  @ApiProperty({ description: "A descrição da notícia" })
  @IsString({ message: "A descrição deve ser uma string" })
  @IsNotEmpty({ message: "A descrição deve ser preenchido" })
  descricao: string;
}