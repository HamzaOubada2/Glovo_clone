import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

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


    @Post('login')
    @ApiOperation({summary: 'Login user and return JWT access token'})
    @ApiResponse({status: 200, description: 'Successfully logged in'})
    @ApiResponse({status: 401, description: 'Unauthorizes credentials'})
    async login(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto);
    }
}
