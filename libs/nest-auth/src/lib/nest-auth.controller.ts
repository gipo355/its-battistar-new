import { Controller, Post, Body } from '@nestjs/common';
import { NestAuthService } from './nest-auth.service';
import { RegisterNestAuthDto } from './dto/register-nest-auth.dto';
import { LoginNestAuthDto } from './dto/login-nest-auth.dto';

@Controller()
export class NestAuthController {
  constructor(private readonly nestAuthService: NestAuthService) {}

  @Post('register')
  register(@Body() createNestAuthDto: RegisterNestAuthDto) {
    return this.nestAuthService.register(createNestAuthDto);
  }

  @Post('login')
  login(@Body() loginNestAuthDto: LoginNestAuthDto) {
    return this.nestAuthService.login(loginNestAuthDto);
  }
}
