import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ItemVenda } from './item-venda.entity';
import { ItemVendaController } from './item-vendas.controller';
import { ItemVendaService } from './item-vendas.service';

@Module({
  imports: [TypeOrmModule.forFeature([ItemVenda])],
  controllers: [ItemVendaController],
  providers: [ItemVendaService],
  exports: [ItemVendaService],
})
export class ItemVendaModule {}
