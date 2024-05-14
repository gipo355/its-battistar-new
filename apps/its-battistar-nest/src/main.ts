/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import 'dotenv-defaults/config';

import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';

import { AppModule } from './app/app.module';
import { connectMongoloid } from './app/db/mongo';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  Logger.log('Connecting to MongoDB');
  await connectMongoloid();

  app.disable('x-powered-by');

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    })
  );

  app.enableCors();

  const port = process.env.PORT ?? '3000';

  await app.listen(port);

  Logger.log(`🚀 Application is running on: http://localhost:${port}`);
}

bootstrap().catch((err: unknown) => {
  Logger.error(err);
});
