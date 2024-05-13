import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto';
import { TodoModel } from './entities/todo.entity';

// response
// {
//   "id": "string",
//   "title": "string",
//   "dueDate": "2024-05-13",
//   "completed": true,
//   "expired": true,
//   "createdBy": {
//     "id": "someUserId",
//     "firstName": "John",
//     "lastName": "James",
//     "fullName": "John James",
//     "picture": "https//somedomain.com/somepicture.png"
//   },
//   "assignedTo": {
//     "id": "someUserId",
//     "firstName": "John",
//     "lastName": "James",
//     "fullName": "John James",
//     "picture": "https//somedomain.com/somepicture.png"
//   }
// }

@Injectable()
export class TodosService {
  async create(createTodoDto: CreateTodoDto) {
    return await this.tryCatch(async () => {
      const newTodo = await TodoModel.create(createTodoDto);
      // TODO: populate when user entity is created

      return newTodo;
    });
  }

  async findAll(showCompleted: boolean) {
    return await this.tryCatch(async () => {
      const todos = await TodoModel.find({
        completed: showCompleted,
      });
      return todos;
    });
  }

  async check(id: string) {
    return await this.tryCatch(async () => {
      const todo = await TodoModel.findByIdAndUpdate(
        {
          _id: id,
        },
        {
          completed: true,
        },
        {
          new: true,
        }
      );

      // TODO: populate when user entity is created

      return todo;
    });
  }

  async uncheck(id: string) {
    return await this.tryCatch(async () => {
      const todo = TodoModel.findByIdAndUpdate(
        {
          _id: id,
        },
        {
          completed: false,
        },
        {
          new: true,
        }
      );

      // TODO: populate when user entity is created

      return todo;
    });
  }

  async assign(id: string, userId: string) {
    return await this.tryCatch(async () => {
      const todo = TodoModel.findByIdAndUpdate(
        {
          _id: id,
        },
        {
          assignedTo: userId,
        },
        {
          new: true,
        }
      );

      // TODO: populate when user entity is created

      return todo;
    });
  }

  async tryCatch(cb: () => Promise<any>) {
    try {
      return cb();
    } catch (error) {
      if (error instanceof Error) {
        throw new HttpException(
          error.message,
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      }
      throw new HttpException(
        'mongoloid error',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
