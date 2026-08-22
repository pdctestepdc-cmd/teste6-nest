import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { ProdutoService } from './produtos.service';
import { Produto } from './produto.entity';

describe('ProdutoService', () => {
  let service: ProdutoService;
  let repo: jest.Mocked<Repository<Produto>>;

  const mockRepo = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProdutoService,
        { provide: getRepositoryToken(Produto), useValue: mockRepo },
      ],
    }).compile();

    service = module.get<ProdutoService>(ProdutoService);
    repo = module.get(getRepositoryToken(Produto));
  });

  afterEach(() => jest.clearAllMocks());

  it('create persists and returns response', async () => {
    const dto = { nome: "sample", descricao: "sample", preco: 1, quantidadeEstoque: 1 };
    const entity = { id: 1, ...dto };
    mockRepo.create.mockReturnValue(entity);
    mockRepo.save.mockResolvedValue(entity);

    const result = await service.create(dto as any);

    expect(result.id).toBeDefined();
    expect(mockRepo.save).toHaveBeenCalled();
  });

  it('findById throws NotFoundException when missing', async () => {
    mockRepo.findOne.mockResolvedValue(null);

    await expect(service.findById(1)).rejects.toThrow(NotFoundException);
  });

  it('delete throws NotFoundException when missing', async () => {
    mockRepo.delete.mockResolvedValue({ affected: 0 });

    await expect(service.delete(1)).rejects.toThrow(NotFoundException);
  });
});
