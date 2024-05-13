import { Module } from '@nestjs/common';
import { TodosModule } from '@its-battistar/nest-todos';
import { NestUsersModule } from '@its-battistar/nest-users';
import { NestAuthModule } from '@its-battistar/nest-auth';

import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [TodosModule, NestUsersModule, NestAuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
