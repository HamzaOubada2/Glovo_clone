import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Repository } from 'typeorm';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ){}

    async register(registerDto:RegisterDto) {
        const {email, password, phone, role} = registerDto;

        const existingUser = await this.userRepository.findOne({where: {email}});

        if(existingUser) {
            throw new BadRequestException('Email Already Exists!');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = this.userRepository.create({
            email,
            password: hashedPassword,
            phone,
            role,
        });

        await this.userRepository.save(user);

        return {
            message: 'User Registred successfully',
            userId: user.id,
            email: user.email,
            role: user.role,
        }
    }


    // Login:
    
}
