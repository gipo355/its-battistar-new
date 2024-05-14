import { Injectable } from '@nestjs/common';

import { LoginNestAuthDto } from './dto/login-nest-auth.dto';
import { RegisterNestAuthDto } from './dto/register-nest-auth.dto';

@Injectable()
export class NestAuthService {
  login(createNestAuthDto: LoginNestAuthDto): string {
    console.log(createNestAuthDto);
    return 'This action adds a new nestAuth';
  }
  register(createNestAuthDto: RegisterNestAuthDto): string {
    console.log(createNestAuthDto);
    return 'This action adds a new nestAuth';
  }
}
