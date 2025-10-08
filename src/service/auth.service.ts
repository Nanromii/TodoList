import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { TokenResponse } from '../dto/response/token.response';
import { TokenRequest } from '../dto/request/token.request';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UsersService,
        private readonly jwtService: JwtService,
    ) {}

    async login(username: string, password: string): Promise<TokenResponse> {
        const user = await this.userService.findUserByUsername(username);
        if (!user) throw new UnauthorizedException('UserEntity not found');
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) throw new UnauthorizedException('Invalid password');
        const payload = {
            username: user.username,
            role: user.roles.map(r => r.name)
        };
        const accessToken = await this.jwtService.signAsync(payload);
        const refreshToken = await this.jwtService.signAsync(payload, {
            expiresIn: '7d'
        });
        await this.userService.saveRefreshToken(refreshToken, username);
        return new TokenResponse(accessToken, refreshToken);
    }

    async refreshToken(request: TokenRequest): Promise<TokenResponse> {
        const decoded = await this.jwtService.verifyAsync(request.token);
        const user = await this.userService.findUserByUsername(decoded.username);
        if (!user || !user.refreshTokens?.length)
            throw new UnauthorizedException('No refresh token found for user');
        const valid = await Promise.any(
            user.refreshTokens.map(async (t) =>
                bcrypt.compare(request.token, t.refreshToken)
            )
        ).catch(() => false);
        if (!valid) throw new UnauthorizedException('Refresh token not recognized');
        const payload = {
            username: user.username,
            role: user.roles.map((r) => r.name),
        };
        const newAccessToken = await this.jwtService.signAsync(payload);
        const newRefreshToken = await this.jwtService.signAsync(payload, {
            expiresIn: '7d',
        });
        await this.userService.saveRefreshToken(newRefreshToken, user.username);
        return new TokenResponse(newAccessToken, newRefreshToken);
    }
}
