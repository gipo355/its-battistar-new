import { Injectable } from '@nestjs/common';
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
    const newTodo = await TodoModel.create(createTodoDto);
    // TODO: populate when user entity is created

    return newTodo;
  }

  async findAll(showCompleted: boolean) {
    const todos = await TodoModel.find({
      completed: showCompleted,
    });
    // TODO: populate when user entity is created
    return todos;
  }

  async check(id: string) {
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
  }

  uncheck(id: string) {
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
  }

  assign(id: string, userId: string) {
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
  }

  // remove(id: number) {
  //   return `This action removes a #${id} todo`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} todo`;
  // }

  // update(id: number, updateTodoDto: UpdateTodoDto) {
  //   return `This action updates a #${id} todo`;
  // }
}
