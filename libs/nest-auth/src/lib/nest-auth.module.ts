import { Module } from '@nestjs/common';
import { NestAuthService } from './nest-auth.service';
import { NestAuthController } from './nest-auth.controller';

@Module({
  controllers: [NestAuthController],
  providers: [NestAuthService],
  exports: [NestAuthService], // 👈 Export the service to inject it in other modules
})
export class NestAuthModule {}
