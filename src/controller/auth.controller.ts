import {
    Body,
    Controller,
    HttpException,
    HttpStatus,
    Logger,
    Post,
} from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { LoginRequest } from '../dto/request/login.request.dto';
import { ApiResponse } from '../dto/response/api.response';
import { TokenResponse } from '../dto/response/token.response';
import { TokenRequest } from '../dto/request/token.request';

@Controller('auth')
export class AuthController {
    private readonly logger = new Logger(AuthController.name);
    constructor(private readonly authService: AuthService) {}

    @Post('login')
    async login(@Body() request: LoginRequest): Promise<ApiResponse<TokenResponse>> {
        this.logger.log(`Request login by user, username=${request.username}.`);
        try {
            const response = await this.authService.login(request.username, request.password);
            return new ApiResponse(`Login successfully.`, response);
        } catch (error) {
            this.logger.error(`Failed to login: ${error.message}`, error.stack);
            throw new HttpException(
                new ApiResponse(`Failed to login: ${error.message}`),
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    @Post('refresh-token')
    async refreshToken(@Body() request: TokenRequest): Promise<ApiResponse<TokenResponse>> {
        this.logger.log(`Request refresh token by user.`);
        try {
            const response = await this.authService.refreshToken(request);
            return new ApiResponse(`Login successfully.`, response);
        } catch (error) {
            this.logger.error(`Failed to refresh token: ${error.message}`, error.stack);
            throw new HttpException(
                new ApiResponse(`Failed to refresh token: ${error.message}`),
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }
}