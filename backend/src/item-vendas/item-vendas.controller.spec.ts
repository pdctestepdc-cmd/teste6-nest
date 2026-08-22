import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, NotFoundException, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { ItemVendaController } from './item-vendas.controller';
import { ItemVendaService } from './item-vendas.service';

describe('ItemVendaController', () => {
  let app: INestApplication;
  const mockItemVendaService = {
    findAll: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ItemVendaController],
      providers: [{ provide: ItemVendaService, useValue: mockItemVendaService }],
    }).compile();

    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await app.init();
  });

  afterEach(() => jest.clearAllMocks());
  afterAll(() => app.close());

  it('POST /itemVendas returns 201', async () => {
    mockItemVendaService.create.mockResolvedValue({ id: 1, quantidade: 1, precoUnitario: 1, vendaId: 1, produtoId: 1 });

    await request.default(app.getHttpServer())
      .post('/itemVendas')
      .send({ quantidade: 1, precoUnitario: 1, vendaId: 1, produtoId: 1 })
      .expect(201)
      .expect((res) => {
        expect(res.body.id).toBeDefined();
      });
  });

  it('GET /itemVendas/:id returns 404 when missing', async () => {
    mockItemVendaService.findById.mockRejectedValue(
      Object.assign(new NotFoundException('not found'), { status: 404 }),
    );

    await request.default(app.getHttpServer())
      .get('/itemVendas/1')
      .expect(404);
  });
});
