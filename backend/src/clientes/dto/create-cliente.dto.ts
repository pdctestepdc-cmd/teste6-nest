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

export class CreateClienteDto {
  @IsString()
  @MaxLength(100)
  nome!: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  telefone?: string;
}
