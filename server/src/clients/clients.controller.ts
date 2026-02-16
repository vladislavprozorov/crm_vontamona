import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { UsersDto } from './dto/Users.dto';

@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Get()
  async findAll() {
    return await this.clientsService.findAll();
  }
  @Get(":id")
  async findById(@Param("id") id: string) {
    return await this.clientsService.findById(id);
  }
  @Post()
  async create(@Body() dto: UsersDto) {
    return await this.clientsService.create(dto);
  }
  @Put(":id")
  async update(@Param("id") id: string, @Body() dto: UsersDto){
    return await this.clientsService.update(id, dto)
  }
  @Delete(":id")
  async delete(@Param("id") id: string){
    const deletedId = await this.clientsService.delete(id);
    return { id: deletedId };
  }
}
