import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cliente } from './cliente.entity';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
import { ClienteResponseDto } from './dto/cliente-response.dto';

@Injectable()
export class ClienteService {
  constructor(
    @InjectRepository(Cliente)
    private readonly clienteRepository: Repository<Cliente>,
  ) {}

  async findAll(): Promise<ClienteResponseDto[]> {
    const entities = await this.clienteRepository.find();
    return entities.map((entity) => this.toResponse(entity));
  }

  async findById(id: number): Promise<ClienteResponseDto> {
    const entity = await this.clienteRepository.findOne({ where: { id } as any });
    if (!entity) {
      throw new NotFoundException(`Cliente not found: ${id}`);
    }
    return this.toResponse(entity);
  }

  async create(dto: CreateClienteDto): Promise<ClienteResponseDto> {
    const entity = this.clienteRepository.create({
      nome: dto.nome,
      telefone: dto.telefone,
    });
    const saved = await this.clienteRepository.save(entity);
    return this.toResponse(saved);
  }

  async update(id: number, dto: UpdateClienteDto): Promise<ClienteResponseDto> {
    const entity = await this.clienteRepository.findOne({ where: { id } as any });
    if (!entity) {
      throw new NotFoundException(`Cliente not found: ${id}`);
    }
    if (dto.nome !== undefined) entity.nome = dto.nome;
    if (dto.telefone !== undefined) entity.telefone = dto.telefone;
    const saved = await this.clienteRepository.save(entity);
    return this.toResponse(saved);
  }

  async delete(id: number): Promise<void> {
    const result = await this.clienteRepository.delete(id as any);
    if (result.affected === 0) {
      throw new NotFoundException(`Cliente not found: ${id}`);
    }
  }

  private toResponse(entity: Cliente): ClienteResponseDto {
    return {
      id: entity.id,
      nome: entity.nome,
      telefone: entity.telefone,
    };
  }
}
