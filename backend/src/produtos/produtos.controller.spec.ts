import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, NotFoundException, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { ProdutoController } from './produtos.controller';
import { ProdutoService } from './produtos.service';

describe('ProdutoController', () => {
  let app: INestApplication;
  const mockProdutoService = {
    findAll: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProdutoController],
      providers: [{ provide: ProdutoService, useValue: mockProdutoService }],
    }).compile();

    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await app.init();
  });

  afterEach(() => jest.clearAllMocks());
  afterAll(() => app.close());

  it('POST /produtos returns 201', async () => {
    mockProdutoService.create.mockResolvedValue({ id: 1, nome: "sample", descricao: "sample", preco: 1, quantidadeEstoque: 1 });

    await request.default(app.getHttpServer())
      .post('/produtos')
      .send({ nome: "sample", descricao: "sample", preco: 1, quantidadeEstoque: 1 })
      .expect(201)
      .expect((res) => {
        expect(res.body.id).toBeDefined();
      });
  });

  it('GET /produtos/:id returns 404 when missing', async () => {
    mockProdutoService.findById.mockRejectedValue(
      Object.assign(new NotFoundException('not found'), { status: 404 }),
    );

    await request.default(app.getHttpServer())
      .get('/produtos/1')
      .expect(404);
  });
});
