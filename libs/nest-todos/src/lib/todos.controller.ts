import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
} from '@nestjs/common';
import { TodosService } from './todos.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { AssignTodoDto } from './dto/assign-todo.dto';

@Controller('todos')
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @Post()
  create(@Body() createTodoDto: CreateTodoDto) {
    return this.todosService.create(createTodoDto);
  }

  @Get()
  findAll(@Query('showCompleted') showCompleted: boolean) {
    return this.todosService.findAll(showCompleted);
  }

  @Patch(':id/check')
  check(@Param('id') id: string) {
    return this.todosService.check(id);
  }

  @Patch(':id/uncheck')
  uncheck(@Param('id') id: string) {
    return this.todosService.uncheck(id);
  }

  @Post(':id/assign')
  assign(@Param('id') id: string, @Body() assignTodoDto: AssignTodoDto) {
    return this.todosService.assign(id, assignTodoDto.userId);
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.todosService.findOne(id);
  // }
}
