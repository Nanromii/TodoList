import { UserResponse } from '../dto/response/user-response.dto';
import { User } from '../entity/user.entity';
import { UserRequest } from '../dto/request/user.request.dto';
import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserMapper {
  toResponse(user: User): UserResponse {
      return new UserResponse(user.username);
  }

  async toEntity(request: UserRequest): Promise<User> {
      const password = await bcrypt.hash(request.password, 10);
      const user = new User();
      user.password = password;
      user.username = request.username;
      user.todos = [];
      user.roles = [];
      user.refreshTokens = [];
      user.createdAt = new Date();
      user.updatedAt = new Date();
      return user;
  }
}