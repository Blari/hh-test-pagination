import { Controller, Get, Logger, Query } from '@nestjs/common';
import { UserService } from './users.service';
import { UsersResponseDto } from './users.response.dto';

@Controller('users')
export class UserController {
  private readonly logger = new Logger(UserController.name);
  constructor(private userService: UserService) {}

  @Get()
  async getAllUsers(@Query('page') _page: string, @Query('limit') _limit: string) {
    const page = parseInt(_page, 10) || 1;
    const limit = parseInt(_limit, 10) || 20;
    const skip = (page - 1) * limit;

    const [users, total] = await this.userService.findAll(skip, limit);
    return {
      users: users.map((user) => UsersResponseDto.fromUsersEntity(user)),
      page,
      limit,
      total,
    };
  }
}
