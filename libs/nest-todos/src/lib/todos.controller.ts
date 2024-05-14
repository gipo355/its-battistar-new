import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';

import { AssignTodoDto } from './dto/assign-todo.dto';
import { CreateTodoDto } from './dto/create-todo.dto';
import { TodosService } from './todos.service';

@Controller('todos')
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @Post()
  async create(@Body() createTodoDto: CreateTodoDto): Promise<unknown> {
    return this.todosService.create(createTodoDto);
  }

  @Get()
  async findAll(
    @Query('showCompleted') showCompleted: boolean
  ): Promise<unknown> {
    return this.todosService.findAll(showCompleted);
  }

  @Patch(':id/check')
  async check(@Param('id') id: string): Promise<unknown> {
    return this.todosService.check(id);
  }

  @Patch(':id/uncheck')
  async uncheck(@Param('id') id: string): Promise<unknown> {
    return this.todosService.uncheck(id);
  }

  @Post(':id/assign')
  async assign(
    @Param('id') id: string,
    @Body() assignTodoDto: AssignTodoDto
  ): Promise<unknown> {
    return this.todosService.assign(id, assignTodoDto.userId);
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.todosService.findOne(id);
  // }
}
