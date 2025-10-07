import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserResponse } from '../../dto/response/user-response.dto';
import { UsersService } from '../../service/users.service';
import { UserMapper } from '../../mapper/user.mapper';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly userService: UsersService,
        private readonly userMapper: UserMapper
    ) {
        super({
          jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
          secretOrKey:
            "eFmNHUhVDVTBSgN6yacypFlj2hDJOILVyJUe0YalafzjBtPHhgzX85Sn9IVN7B67PaXnA2TI7vVjGd1PmCdEup7yVGPKnu7y42XUemmnz8SSvhQl9Yg93rM4QkfCtXQRtkFRliJGdhAUgNCiEmlSgMa4trXIUE5XB9qSHnVeZ2PYPrS9147JugFhjsuuwPWWKPKmUwGNeiaGFnfdcchcPrPCO5OoeSPR2mzCXssIhrB72ZsIoUq1rJXOZmDZ5rausT6EixrVlAdiBV6hoJHVdgQQOlQYcgoQhMZ3M08ViOVIIBNmlXIeRn8V4JD0qcS1jQQeMIic78J617N2lvuJSi3Fl5JQj7CsHuOsn1Fu0C9k31w4BTX5uVL68MZA3T1TCkAd6DMJAJrKvhS3JMHpYtHvKfYT4oXhVSUyFvD70oMW5WoLN1QftF03sVTI2aP9YnHH6twDFiOYrxCs8JrwrT9gXc5QpVOkMDArhtoU61JGZCqu9EEeHMTz09z92TIS",
        });
    }

    async validate(payload: any): Promise<UserResponse> {
        const user = await this.userService.findUserByUsername(payload.username);
        return this.userMapper.toResponse(user);
    }
}