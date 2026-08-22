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
import { VendaService } from './vendas.service';
import { CreateVendaDto } from './dto/create-venda.dto';
import { UpdateVendaDto } from './dto/update-venda.dto';
import { VendaResponseDto } from './dto/venda-response.dto';

@ApiTags('Venda')
@Controller('vendas')
export class VendaController {
  constructor(private readonly vendaService: VendaService) {}

  @ApiOperation({ summary: 'List all Venda records' })
  @Get()
  findAll(): Promise<VendaResponseDto[]> {
    return this.vendaService.findAll();
  }

  @ApiOperation({ summary: 'Get a Venda by id' })
  @Get(':id')
  findById(@Param('id') id: number): Promise<VendaResponseDto> {
    return this.vendaService.findById(id);
  }

  @ApiOperation({ summary: 'Create a new Venda' })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateVendaDto): Promise<VendaResponseDto> {
    return this.vendaService.create(dto);
  }

  @ApiOperation({ summary: 'Update an existing Venda' })
  @Put(':id')
  update(
    @Param('id') id: number,
    @Body() dto: UpdateVendaDto,
  ): Promise<VendaResponseDto> {
    return this.vendaService.update(id, dto);
  }

  @ApiOperation({ summary: 'Delete a Venda by id' })
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@Param('id') id: number): Promise<void> {
    return this.vendaService.delete(id);
  }
}
