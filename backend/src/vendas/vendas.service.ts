import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Venda } from './venda.entity';
import { CreateVendaDto } from './dto/create-venda.dto';
import { UpdateVendaDto } from './dto/update-venda.dto';
import { VendaResponseDto } from './dto/venda-response.dto';

@Injectable()
export class VendaService {
  constructor(
    @InjectRepository(Venda)
    private readonly vendaRepository: Repository<Venda>,
  ) {}

  async findAll(): Promise<VendaResponseDto[]> {
    const entities = await this.vendaRepository.find();
    return entities.map((entity) => this.toResponse(entity));
  }

  async findById(id: number): Promise<VendaResponseDto> {
    const entity = await this.vendaRepository.findOne({ where: { id } as any });
    if (!entity) {
      throw new NotFoundException(`Venda not found: ${id}`);
    }
    return this.toResponse(entity);
  }

  async create(dto: CreateVendaDto): Promise<VendaResponseDto> {
    const entity = this.vendaRepository.create({
      data: dto.data,
      valorTotal: dto.valorTotal,
      cliente: dto.clienteId != null ? { id: dto.clienteId } : undefined,
    });
    const saved = await this.vendaRepository.save(entity);
    return this.toResponse(saved);
  }

  async update(id: number, dto: UpdateVendaDto): Promise<VendaResponseDto> {
    const entity = await this.vendaRepository.findOne({ where: { id } as any });
    if (!entity) {
      throw new NotFoundException(`Venda not found: ${id}`);
    }
    if (dto.data !== undefined) entity.data = dto.data;
    if (dto.valorTotal !== undefined) entity.valorTotal = dto.valorTotal;
    if (dto.clienteId !== undefined) entity.cliente = { id: dto.clienteId } as any;
    const saved = await this.vendaRepository.save(entity);
    return this.toResponse(saved);
  }

  async delete(id: number): Promise<void> {
    const result = await this.vendaRepository.delete(id as any);
    if (result.affected === 0) {
      throw new NotFoundException(`Venda not found: ${id}`);
    }
  }

  private toResponse(entity: Venda): VendaResponseDto {
    return {
      id: entity.id,
      data: entity.data,
      valorTotal: entity.valorTotal,
      clienteId: entity.cliente?.id ?? undefined,
    };
  }
}
