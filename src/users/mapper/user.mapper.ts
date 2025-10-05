import { UserResponse } from '../dto/response/user-response.dto';
import { User } from '../entity/user';
import { UserRequest } from '../dto/request/user-request.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserMapper {
  toResponse(user: User): UserResponse {
    return new UserResponse(user.username);
  }

  toEntity(request: UserRequest): User {
    const user = new User();
    user.username = request.username;
    user.todos = [];
    user.createdAt = new Date();
    user.updatedAt = new Date();
    return user;
  }
}