import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { ClienteService } from './clientes.service';
import { Cliente } from './cliente.entity';

describe('ClienteService', () => {
  let service: ClienteService;
  let repo: jest.Mocked<Repository<Cliente>>;

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
        ClienteService,
        { provide: getRepositoryToken(Cliente), useValue: mockRepo },
      ],
    }).compile();

    service = module.get<ClienteService>(ClienteService);
    repo = module.get(getRepositoryToken(Cliente));
  });

  afterEach(() => jest.clearAllMocks());

  it('create persists and returns response', async () => {
    const dto = { nome: "sample", telefone: "sample" };
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
