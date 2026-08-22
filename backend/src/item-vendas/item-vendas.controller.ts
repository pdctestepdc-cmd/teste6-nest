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
import { ItemVendaService } from './item-vendas.service';
import { CreateItemVendaDto } from './dto/create-item-venda.dto';
import { UpdateItemVendaDto } from './dto/update-item-venda.dto';
import { ItemVendaResponseDto } from './dto/item-venda-response.dto';

@ApiTags('ItemVenda')
@Controller('itemVendas')
export class ItemVendaController {
  constructor(private readonly itemVendaService: ItemVendaService) {}

  @ApiOperation({ summary: 'List all ItemVenda records' })
  @Get()
  findAll(): Promise<ItemVendaResponseDto[]> {
    return this.itemVendaService.findAll();
  }

  @ApiOperation({ summary: 'Get a ItemVenda by id' })
  @Get(':id')
  findById(@Param('id') id: number): Promise<ItemVendaResponseDto> {
    return this.itemVendaService.findById(id);
  }

  @ApiOperation({ summary: 'Create a new ItemVenda' })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateItemVendaDto): Promise<ItemVendaResponseDto> {
    return this.itemVendaService.create(dto);
  }

  @ApiOperation({ summary: 'Update an existing ItemVenda' })
  @Put(':id')
  update(
    @Param('id') id: number,
    @Body() dto: UpdateItemVendaDto,
  ): Promise<ItemVendaResponseDto> {
    return this.itemVendaService.update(id, dto);
  }

  @ApiOperation({ summary: 'Delete a ItemVenda by id' })
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@Param('id') id: number): Promise<void> {
    return this.itemVendaService.delete(id);
  }
}
