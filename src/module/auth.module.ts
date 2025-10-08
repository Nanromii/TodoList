import { Module } from '@nestjs/common';
import { AuthController } from '../controller/auth.controller';
import { AuthService } from '../service/auth.service';
import { UsersModule } from './users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from '../utils/strategy/jwt.strategy.utils';

@Module({
    imports: [
        UsersModule,
        PassportModule,
        JwtModule.register({
            secret: 'eFmNHUhVDVTBSgN6yacypFlj2hDJOILVyJUe0YalafzjBtPHhgzX85Sn9IVN7B67PaXnA2TI7vVjGd1PmCdEup7yVGPKnu7y42XUemmnz8SSvhQl9Yg93rM4QkfCtXQRtkFRliJGdhAUgNCiEmlSgMa4trXIUE5XB9qSHnVeZ2PYPrS9147JugFhjsuuwPWWKPKmUwGNeiaGFnfdcchcPrPCO5OoeSPR2mzCXssIhrB72ZsIoUq1rJXOZmDZ5rausT6EixrVlAdiBV6hoJHVdgQQOlQYcgoQhMZ3M08ViOVIIBNmlXIeRn8V4JD0qcS1jQQeMIic78J617N2lvuJSi3Fl5JQj7CsHuOsn1Fu0C9k31w4BTX5uVL68MZA3T1TCkAd6DMJAJrKvhS3JMHpYtHvKfYT4oXhVSUyFvD70oMW5WoLN1QftF03sVTI2aP9YnHH6twDFiOYrxCs8JrwrT9gXc5QpVOkMDArhtoU61JGZCqu9EEeHMTz09z92TIS',
            signOptions: { expiresIn: '1h' }
        })
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy],
    exports: [AuthService]
})
export class AuthModule {}
