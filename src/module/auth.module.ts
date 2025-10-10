import { Module } from '@nestjs/common';
import { AuthController } from '../controller/auth.controller';
import { AuthService } from '../service/auth.service';
import { UsersModule } from './users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from '../strategy/jwt.strategy.utils';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
    imports: [
        UsersModule,
        PassportModule,
        ConfigModule,
        JwtModule.registerAsync({
            inject: [ConfigService],
            useFactory: (config: ConfigService) => ({
                secret: config.get<string>('SECRET_KEY'),
                signOptions: { expiresIn: config.get<string>('EXPIRY_TIME_ACCESS_TOKEN') }
            })
        })
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy],
    exports: [AuthService]
})
export class AuthModule {}
