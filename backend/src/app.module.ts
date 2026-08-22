import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HealthController } from './health.controller';
import { APP_GUARD } from '@nestjs/core';
import { KeycloakAuthGuard } from './auth/keycloak-auth.guard';

import { ProdutoModule } from './produtos/produtos.module';
import { ClienteModule } from './clientes/clientes.module';
import { VendaModule } from './vendas/vendas.module';
import { ItemVendaModule } from './item-vendas/item-vendas.module';

const dataDir = process.env.DATA_DIR?.replace(/\/$/, '');
const databaseFile = dataDir ? dataDir + '/db.sqlite' : 'db.sqlite';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'better-sqlite3',
      database: databaseFile,
      synchronize: true,
      autoLoadEntities: true,
    }),
    ProdutoModule,
    ClienteModule,
    VendaModule,
    ItemVendaModule,
  ],
  controllers: [HealthController],
  providers: [
    { provide: APP_GUARD, useClass: KeycloakAuthGuard },
  ],
})
export class AppModule {}
