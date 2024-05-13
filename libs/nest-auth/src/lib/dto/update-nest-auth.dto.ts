import { PartialType } from '@nestjs/mapped-types';

import { RegisterNestAuthDto } from './register-nest-auth.dto';

export class UpdateNestAuthDto extends PartialType(RegisterNestAuthDto) {}
