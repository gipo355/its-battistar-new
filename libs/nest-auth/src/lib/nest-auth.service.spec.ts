import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';

import { NestAuthService } from './nest-auth.service';

describe('NestAuthService', () => {
  let service: NestAuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NestAuthService],
    }).compile();

    service = module.get<NestAuthService>(NestAuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
