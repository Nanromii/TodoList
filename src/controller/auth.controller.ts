import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { LoginRequest } from '../dto/request/login.request.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('login')
    async login(@Body() request: LoginRequest) {
        return this.authService.login(request.username, request.password);
    }
}