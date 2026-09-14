import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { StoresService } from './stores.service';
import { CreateStoreDto } from './dtos/create-store.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

type AuthenticatedRequest = Request & {
    user: { sub: string; email: string; role: string };
};

@ApiTags('Stores')
@Controller('stores')
export class StoresController {
    constructor(private storesService: StoresService) {}


    @UseGuards(JwtAuthGuard)
    @Post()
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Create a new store (Store Owner only)' })
    @ApiResponse({ status: 201, description: 'Store successfully created' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async create(@Body() createStoreDto: CreateStoreDto, @Req() req: AuthenticatedRequest) {
        const ownerId = req.user.sub; // Extracting the ID from the JWT Token Payload
        return this.storesService.create(createStoreDto, ownerId);
    }


    @Get()
    @ApiOperation({ summary: 'Get all stores' })
    @ApiResponse({ status: 200, description: 'List of all stores' })
    async findAll() {
        return this.storesService.findAll();
    }
}