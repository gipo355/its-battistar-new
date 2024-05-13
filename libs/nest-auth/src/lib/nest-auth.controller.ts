import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { NestAuthService } from './nest-auth.service';
import { CreateNestAuthDto } from './dto/create-nest-auth.dto';
import { UpdateNestAuthDto } from './dto/update-nest-auth.dto';

@Controller('nest-auth')
export class NestAuthController {
  constructor(private readonly nestAuthService: NestAuthService) {}

  @Post()
  create(@Body() createNestAuthDto: CreateNestAuthDto) {
    return this.nestAuthService.create(createNestAuthDto);
  }

  @Get()
  findAll() {
    return this.nestAuthService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.nestAuthService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateNestAuthDto: UpdateNestAuthDto
  ) {
    return this.nestAuthService.update(+id, updateNestAuthDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.nestAuthService.remove(+id);
  }
}
