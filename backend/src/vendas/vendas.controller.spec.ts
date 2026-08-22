import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, NotFoundException, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { VendaController } from './vendas.controller';
import { VendaService } from './vendas.service';

describe('VendaController', () => {
  let app: INestApplication;
  const mockVendaService = {
    findAll: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VendaController],
      providers: [{ provide: VendaService, useValue: mockVendaService }],
    }).compile();

    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await app.init();
  });

  afterEach(() => jest.clearAllMocks());
  afterAll(() => app.close());

  it('POST /vendas returns 201', async () => {
    mockVendaService.create.mockResolvedValue({ id: 1, data: new Date(), valorTotal: 1, clienteId: 1 });

    await request.default(app.getHttpServer())
      .post('/vendas')
      .send({ data: new Date(), valorTotal: 1, clienteId: 1 })
      .expect(201)
      .expect((res) => {
        expect(res.body.id).toBeDefined();
      });
  });

  it('GET /vendas/:id returns 404 when missing', async () => {
    mockVendaService.findById.mockRejectedValue(
      Object.assign(new NotFoundException('not found'), { status: 404 }),
    );

    await request.default(app.getHttpServer())
      .get('/vendas/1')
      .expect(404);
  });
});
