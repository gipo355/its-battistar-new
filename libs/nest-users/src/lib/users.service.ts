import { Injectable } from '@nestjs/common';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  create(createUserDto: CreateUserDto): string {
    console.log('createUserDto', createUserDto);
    return 'This action adds a new user';
  }

  findAll(): string {
    return `This action returns all users`;
  }

  findOne(id: string): string {
    return `This action returns a #${id} user`;
  }

  update(id: string, updateUserDto: UpdateUserDto): string {
    console.log('updateUserDto', updateUserDto);
    return `This action updates a #${id} user`;
  }

  remove(id: string): string {
    return `This action removes a #${id} user`;
  }
}
