import { Injectable } from '@nestjs/common';
import { CreateNestAuthDto } from './dto/create-nest-auth.dto';
import { UpdateNestAuthDto } from './dto/update-nest-auth.dto';

@Injectable()
export class NestAuthService {
  create(createNestAuthDto: CreateNestAuthDto) {
    return 'This action adds a new nestAuth';
  }

  findAll() {
    return `This action returns all nestAuth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} nestAuth`;
  }

  update(id: number, updateNestAuthDto: UpdateNestAuthDto) {
    return `This action updates a #${id} nestAuth`;
  }

  remove(id: number) {
    return `This action removes a #${id} nestAuth`;
  }
}
