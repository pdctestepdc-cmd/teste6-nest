import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ItemVenda } from './item-venda.entity';
import { CreateItemVendaDto } from './dto/create-item-venda.dto';
import { UpdateItemVendaDto } from './dto/update-item-venda.dto';
import { ItemVendaResponseDto } from './dto/item-venda-response.dto';

@Injectable()
export class ItemVendaService {
  constructor(
    @InjectRepository(ItemVenda)
    private readonly itemVendaRepository: Repository<ItemVenda>,
  ) {}

  async findAll(): Promise<ItemVendaResponseDto[]> {
    const entities = await this.itemVendaRepository.find();
    return entities.map((entity) => this.toResponse(entity));
  }

  async findById(id: number): Promise<ItemVendaResponseDto> {
    const entity = await this.itemVendaRepository.findOne({ where: { id } as any });
    if (!entity) {
      throw new NotFoundException(`ItemVenda not found: ${id}`);
    }
    return this.toResponse(entity);
  }

  async create(dto: CreateItemVendaDto): Promise<ItemVendaResponseDto> {
    const entity = this.itemVendaRepository.create({
      quantidade: dto.quantidade,
      precoUnitario: dto.precoUnitario,
      venda: dto.vendaId != null ? { id: dto.vendaId } : undefined,
      produto: dto.produtoId != null ? { id: dto.produtoId } : undefined,
    });
    const saved = await this.itemVendaRepository.save(entity);
    return this.toResponse(saved);
  }

  async update(id: number, dto: UpdateItemVendaDto): Promise<ItemVendaResponseDto> {
    const entity = await this.itemVendaRepository.findOne({ where: { id } as any });
    if (!entity) {
      throw new NotFoundException(`ItemVenda not found: ${id}`);
    }
    if (dto.quantidade !== undefined) entity.quantidade = dto.quantidade;
    if (dto.precoUnitario !== undefined) entity.precoUnitario = dto.precoUnitario;
    if (dto.vendaId !== undefined) entity.venda = { id: dto.vendaId } as any;
    if (dto.produtoId !== undefined) entity.produto = { id: dto.produtoId } as any;
    const saved = await this.itemVendaRepository.save(entity);
    return this.toResponse(saved);
  }

  async delete(id: number): Promise<void> {
    const result = await this.itemVendaRepository.delete(id as any);
    if (result.affected === 0) {
      throw new NotFoundException(`ItemVenda not found: ${id}`);
    }
  }

  private toResponse(entity: ItemVenda): ItemVendaResponseDto {
    return {
      id: entity.id,
      quantidade: entity.quantidade,
      precoUnitario: entity.precoUnitario,
      vendaId: entity.venda?.id ?? undefined,
      produtoId: entity.produto?.id ?? undefined,
    };
  }
}
