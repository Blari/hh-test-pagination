import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersEntity } from './users.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectRepository(UsersEntity)
    private usersRepo: Repository<UsersEntity>,
  ) {}
  async findAll(skip: number, take: number): Promise<[UsersEntity[], number]> {
    const [users, total] = await this.usersRepo.findAndCount({
      order: {
        createdAt: 'DESC',
      },
      take: take,
      skip: skip,
    });
    return [users, total];
  }
}
