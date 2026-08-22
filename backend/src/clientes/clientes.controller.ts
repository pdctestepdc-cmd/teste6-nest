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
import { ClienteService } from './clientes.service';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
import { ClienteResponseDto } from './dto/cliente-response.dto';

@ApiTags('Cliente')
@Controller('clientes')
export class ClienteController {
  constructor(private readonly clienteService: ClienteService) {}

  @ApiOperation({ summary: 'List all Cliente records' })
  @Get()
  findAll(): Promise<ClienteResponseDto[]> {
    return this.clienteService.findAll();
  }

  @ApiOperation({ summary: 'Get a Cliente by id' })
  @Get(':id')
  findById(@Param('id') id: number): Promise<ClienteResponseDto> {
    return this.clienteService.findById(id);
  }

  @ApiOperation({ summary: 'Create a new Cliente' })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateClienteDto): Promise<ClienteResponseDto> {
    return this.clienteService.create(dto);
  }

  @ApiOperation({ summary: 'Update an existing Cliente' })
  @Put(':id')
  update(
    @Param('id') id: number,
    @Body() dto: UpdateClienteDto,
  ): Promise<ClienteResponseDto> {
    return this.clienteService.update(id, dto);
  }

  @ApiOperation({ summary: 'Delete a Cliente by id' })
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@Param('id') id: number): Promise<void> {
    return this.clienteService.delete(id);
  }
}
