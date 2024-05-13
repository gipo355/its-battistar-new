import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';

import { NestAuthController } from './nest-auth.controller';
import { NestAuthService } from './nest-auth.service';

describe('NestAuthController', () => {
  let controller: NestAuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NestAuthController],
      providers: [NestAuthService],
    }).compile();

    controller = module.get<NestAuthController>(NestAuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
