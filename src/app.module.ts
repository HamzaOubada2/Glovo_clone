import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/entities/user.entity.js';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),

        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (ConfigService: ConfigService) => ({
                type: 'mysql',
                host: ConfigService.get<string>('DB_HOST'),
                port: ConfigService.get<number>('DB_PORT'),
                username: ConfigService.get<string>('DB_USER'),
                password: ConfigService.get<string>('DB_PASSWORD'),
                database: ConfigService.get<string>("DB_NAME"),
                entities: [User],
                synchronize: true
            })
        })
    ]
})
export class AppModule {}
