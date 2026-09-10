import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Repository } from 'typeorm';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        private jwtService: JwtService,
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
    async login(loginDto:LoginDto) {
        const user = await this.userRepository.findOne({
            where: {email: loginDto.email}
        });

        if(!user) {
            throw new UnauthorizedException("Invalid email or password");
        }

        const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
        if(!isPasswordValid) {
            throw new UnauthorizedException("Invalid email or password");
        }

        const payload = {sub: user.id, email:user.email, role:user.role};


        return {
            access_token: this.jwtService.sign(payload),
            userId: user.id,
            role: user.role
        }
    }

}
