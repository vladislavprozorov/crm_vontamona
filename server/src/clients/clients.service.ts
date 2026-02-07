import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ClientEntity } from './entity/clients.entity';
import { Repository } from 'typeorm';
import { UsersDto } from './dto/Users.dto';

@Injectable()
export class ClientsService {
    constructor(@InjectRepository(ClientEntity) private readonly clientsRepository: Repository<ClientEntity>){}
    async findAll(): Promise<ClientEntity[]> {
        return await this.clientsRepository.find({
            order: {
                createdAt: "desc"
            }
        });
    }
    async findById(id: string): Promise<ClientEntity>{
        const user = await this.clientsRepository.findOne({
            where: {
                id
            }
        })
        if (!user) throw new NotFoundException("User not found");
        return user;
    }
    async create(dto: UsersDto): Promise<ClientEntity>{
        const client = this.clientsRepository.create(dto);
        return await this.clientsRepository.save(client);
    }
    async update(id: string, dto: UsersDto): Promise<ClientEntity>{
        const client = await this.findById(id);
        Object.assign(client, dto);
        return await this.clientsRepository.save(client)
    }
    async delete (id: string): Promise<string>{
        const client = await this.findById(id)
        await this.clientsRepository.remove(client)
        return client.id
    }
}
