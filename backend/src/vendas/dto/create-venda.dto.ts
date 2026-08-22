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
import { Type } from 'class-transformer';

export class CreateVendaDto {
  @Type(() => Date)
  @IsDate()
  data!: Date;

  @IsNumber()
  valorTotal!: number;

  @IsOptional()
  @IsNumber()
  clienteId?: number;
}
