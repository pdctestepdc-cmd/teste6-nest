import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Produto } from './produto.entity';
import { CreateProdutoDto } from './dto/create-produto.dto';
import { UpdateProdutoDto } from './dto/update-produto.dto';
import { ProdutoResponseDto } from './dto/produto-response.dto';

@Injectable()
export class ProdutoService {
  constructor(
    @InjectRepository(Produto)
    private readonly produtoRepository: Repository<Produto>,
  ) {}

  async findAll(): Promise<ProdutoResponseDto[]> {
    const entities = await this.produtoRepository.find();
    return entities.map((entity) => this.toResponse(entity));
  }

  async findById(id: number): Promise<ProdutoResponseDto> {
    const entity = await this.produtoRepository.findOne({ where: { id } as any });
    if (!entity) {
      throw new NotFoundException(`Produto not found: ${id}`);
    }
    return this.toResponse(entity);
  }

  async create(dto: CreateProdutoDto): Promise<ProdutoResponseDto> {
    const entity = this.produtoRepository.create({
      nome: dto.nome,
      descricao: dto.descricao,
      preco: dto.preco,
      quantidadeEstoque: dto.quantidadeEstoque,
    });
    const saved = await this.produtoRepository.save(entity);
    return this.toResponse(saved);
  }

  async update(id: number, dto: UpdateProdutoDto): Promise<ProdutoResponseDto> {
    const entity = await this.produtoRepository.findOne({ where: { id } as any });
    if (!entity) {
      throw new NotFoundException(`Produto not found: ${id}`);
    }
    if (dto.nome !== undefined) entity.nome = dto.nome;
    if (dto.descricao !== undefined) entity.descricao = dto.descricao;
    if (dto.preco !== undefined) entity.preco = dto.preco;
    if (dto.quantidadeEstoque !== undefined) entity.quantidadeEstoque = dto.quantidadeEstoque;
    const saved = await this.produtoRepository.save(entity);
    return this.toResponse(saved);
  }

  async delete(id: number): Promise<void> {
    const result = await this.produtoRepository.delete(id as any);
    if (result.affected === 0) {
      throw new NotFoundException(`Produto not found: ${id}`);
    }
  }

  private toResponse(entity: Produto): ProdutoResponseDto {
    return {
      id: entity.id,
      nome: entity.nome,
      descricao: entity.descricao,
      preco: entity.preco,
      quantidadeEstoque: entity.quantidadeEstoque,
    };
  }
}
