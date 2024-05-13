import { Injectable } from '@nestjs/common';

import { LoginNestAuthDto } from './dto/login-nest-auth.dto';
import { RegisterNestAuthDto } from './dto/register-nest-auth.dto';

@Injectable()
export class NestAuthService {
  login(_createNestAuthDto: LoginNestAuthDto) {
    return 'This action adds a new nestAuth';
  }
  register(_createNestAuthDto: RegisterNestAuthDto) {
    return 'This action adds a new nestAuth';
  }
}
