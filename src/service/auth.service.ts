import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { TokenResponse } from '../dto/response/token.response';

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
        const token = await this.jwtService.signAsync(payload);
        return new TokenResponse(token);
    }
}
