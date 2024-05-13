import { PartialType } from '@nestjs/mapped-types';
import { CreateNestAuthDto } from './create-nest-auth.dto';

export class UpdateNestAuthDto extends PartialType(CreateNestAuthDto) {}
