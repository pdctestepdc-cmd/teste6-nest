import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('API Integration', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    app.setGlobalPrefix('api');
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    const swaggerConfig = new DocumentBuilder()
      .setTitle('Integration Test API')
      .setVersion('1.0')
      .build();
    const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('api-docs', app, swaggerDocument);
    await app.init();
  });

  afterAll(() => app.close());

  it('context loads', () => {
    expect(app).toBeDefined();
  });

  it('Swagger API docs are served', async () => {
    await request(app.getHttpServer())
      .get('/api-docs-json')
      .expect(200)
      .expect((res) => {
        expect(res.body.openapi).toBeDefined();
      });
  });

  it('every collection route responds', async () => {
    await request(app.getHttpServer()).get('/api/produtos').expect(200);
    await request(app.getHttpServer()).get('/api/clientes').expect(200);
    await request(app.getHttpServer()).get('/api/vendas').expect(200);
    await request(app.getHttpServer()).get('/api/itemVendas').expect(200);
  });
});
