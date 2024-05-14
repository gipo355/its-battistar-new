import { Module } from '@nestjs/common';

import { NestAuthController } from './nest-auth.controller';
import { NestAuthService } from './nest-auth.service';

@Module({
  controllers: [NestAuthController],
  providers: [NestAuthService],
  exports: [NestAuthService], // 👈 Export the service to inject it in other modules
})
export class NestAuthModule {
  name = 'NestAuthModule';
}
