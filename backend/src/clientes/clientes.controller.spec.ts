import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, NotFoundException, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { ClienteController } from './clientes.controller';
import { ClienteService } from './clientes.service';

describe('ClienteController', () => {
  let app: INestApplication;
  const mockClienteService = {
    findAll: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClienteController],
      providers: [{ provide: ClienteService, useValue: mockClienteService }],
    }).compile();

    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await app.init();
  });

  afterEach(() => jest.clearAllMocks());
  afterAll(() => app.close());

  it('POST /clientes returns 201', async () => {
    mockClienteService.create.mockResolvedValue({ id: 1, nome: "sample", telefone: "sample" });

    await request.default(app.getHttpServer())
      .post('/clientes')
      .send({ nome: "sample", telefone: "sample" })
      .expect(201)
      .expect((res) => {
        expect(res.body.id).toBeDefined();
      });
  });

  it('GET /clientes/:id returns 404 when missing', async () => {
    mockClienteService.findById.mockRejectedValue(
      Object.assign(new NotFoundException('not found'), { status: 404 }),
    );

    await request.default(app.getHttpServer())
      .get('/clientes/1')
      .expect(404);
  });
});
