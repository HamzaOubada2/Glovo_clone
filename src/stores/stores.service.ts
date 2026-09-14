import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Store } from './entities/store.entity';
import { CreateStoreDto } from './dtos/create-store.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class StoresService {
    constructor(
        @InjectRepository(Store)
        private storesRepository: Repository<Store>,
        @InjectRepository(User)
        private usersRepository: Repository<User>
    ) {}



    async create(createdStoreDto: CreateStoreDto, ownerId: string): Promise<Store> {
        const owner = await this.usersRepository.findOne({where: {id: ownerId}});
        if(!owner) {
            throw new NotFoundException('Owner User Not Found!');
        }

        const store = this.storesRepository.create({
            ...createdStoreDto,
            ownerId
        });

        return this.storesRepository.save(store);
    }


    async findAll(): Promise<Store[]> {
        return this.storesRepository.find({relations: {owner: true}})
    }

    
}