import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('register')
    @ApiOperation({summary: 'Register a new User'})
    @ApiResponse({status: 201, description: 'User Successfylly registred'})
    @ApiResponse({status: 403, description: 'Bad Request or Email already exists.'})
    async register(@Body() registerDto: RegisterDto) {
        return this.authService.register(registerDto);
    }
}
