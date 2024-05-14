import { Body, Controller, Post } from '@nestjs/common';

import { LoginNestAuthDto } from './dto/login-nest-auth.dto';
import { RegisterNestAuthDto } from './dto/register-nest-auth.dto';
import { NestAuthService } from './nest-auth.service';

@Controller()
export class NestAuthController {
  constructor(private readonly nestAuthService: NestAuthService) {}

  @Post('register')
  register(@Body() createNestAuthDto: RegisterNestAuthDto): string {
    return this.nestAuthService.register(createNestAuthDto);
  }

  @Post('login')
  login(@Body() loginNestAuthDto: LoginNestAuthDto): string {
    return this.nestAuthService.login(loginNestAuthDto);
  }
}
