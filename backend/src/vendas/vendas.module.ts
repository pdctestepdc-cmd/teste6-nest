import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Venda } from './venda.entity';
import { VendaController } from './vendas.controller';
import { VendaService } from './vendas.service';

@Module({
  imports: [TypeOrmModule.forFeature([Venda])],
  controllers: [VendaController],
  providers: [VendaService],
  exports: [VendaService],
})
export class VendaModule {}
