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

export class CreateProdutoDto {
  @IsString()
  @MaxLength(100)
  nome!: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  descricao?: string;

  @IsNumber()
  preco!: number;

  @IsNumber()
  quantidadeEstoque!: number;
}
