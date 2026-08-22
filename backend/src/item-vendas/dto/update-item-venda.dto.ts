import { PartialType } from '@nestjs/swagger';
import { CreateItemVendaDto } from './create-item-venda.dto';

export class UpdateItemVendaDto extends PartialType(CreateItemVendaDto) {}
