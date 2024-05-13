import { Module } from '@nestjs/common';
import { TodosModule } from '@its-battistar/nest-todos';

import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [TodosModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
