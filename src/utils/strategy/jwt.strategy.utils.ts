import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../../service/users.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly userService: UsersService,
        private readonly config: ConfigService,
    ) {
        super({
          jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
          secretOrKey: config.get<string>('SECRET_KEY')!,
        });
    }

    async validate(payload: any): Promise<Object> {
        const user = await this.userService.findUserByUsername(payload.username);
        return {
            username: user.username,
            roles: user.roles.map(r => r.name)
        };
    }
}