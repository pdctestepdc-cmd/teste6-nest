import {
  IsString,
  IsNumber,
  IsBoolean,
  IsDate,
  IsEmail,
  IsOptional,
  MinLength,
  MaxLength,
} from 'class-validator';

export class CreateItemVendaDto {
  @IsNumber()
  quantidade!: number;

  @IsNumber()
  precoUnitario!: number;

  @IsNumber()
  vendaId!: number;

  @IsNumber()
  produtoId!: number;
}
