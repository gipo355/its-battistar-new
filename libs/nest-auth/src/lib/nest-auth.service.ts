import { Injectable } from '@nestjs/common';
import { RegisterNestAuthDto } from './dto/register-nest-auth.dto';
import { LoginNestAuthDto } from './dto/login-nest-auth.dto';

@Injectable()
export class NestAuthService {
  login(_createNestAuthDto: LoginNestAuthDto) {
    return 'This action adds a new nestAuth';
  }
  register(_createNestAuthDto: RegisterNestAuthDto) {
    return 'This action adds a new nestAuth';
  }
}
