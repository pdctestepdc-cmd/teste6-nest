import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ProdutoService } from './produtos.service';
import { CreateProdutoDto } from './dto/create-produto.dto';
import { UpdateProdutoDto } from './dto/update-produto.dto';
import { ProdutoResponseDto } from './dto/produto-response.dto';

@ApiTags('Produto')
@Controller('produtos')
export class ProdutoController {
  constructor(private readonly produtoService: ProdutoService) {}

  @ApiOperation({ summary: 'List all Produto records' })
  @Get()
  findAll(): Promise<ProdutoResponseDto[]> {
    return this.produtoService.findAll();
  }

  @ApiOperation({ summary: 'Get a Produto by id' })
  @Get(':id')
  findById(@Param('id') id: number): Promise<ProdutoResponseDto> {
    return this.produtoService.findById(id);
  }

  @ApiOperation({ summary: 'Create a new Produto' })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateProdutoDto): Promise<ProdutoResponseDto> {
    return this.produtoService.create(dto);
  }

  @ApiOperation({ summary: 'Update an existing Produto' })
  @Put(':id')
  update(
    @Param('id') id: number,
    @Body() dto: UpdateProdutoDto,
  ): Promise<ProdutoResponseDto> {
    return this.produtoService.update(id, dto);
  }

  @ApiOperation({ summary: 'Delete a Produto by id' })
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@Param('id') id: number): Promise<void> {
    return this.produtoService.delete(id);
  }
}
