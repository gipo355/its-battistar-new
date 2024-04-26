/* eslint-disable no-magic-numbers */
import { faker } from '@faker-js/faker';
import { ITodo } from '@its-battistar/shared-types';

enum TodoColorOptions {
  red = 'red',
  blue = 'blue',
  green = 'green',
  yellow = 'yellow',
  pink = 'pink',
  default = 'default',
}

// BUG: faker doesn't work in browser, requires node api
function generateTestTodos(n: number): ITodo[] {
  const todos: ITodo[] = [];
  for (let i = 0; i < n; i++) {
    const newTodo: ITodo = {
      id: faker.string.uuid(),
      title: faker.lorem.sentence(2),
      description: faker.lorem.sentence(20),
      completed: faker.datatype.boolean(),
      dueDate: faker.date.future(),
      expired: faker.datatype.boolean(),
      createdAt: faker.date.recent(),
      updatedAt: faker.date.recent(),
      color: faker.helpers.enumValue(TodoColorOptions),
    };

    todos.push(newTodo);
  }
  return todos;
}

// try with manual data
// export const todosTestData: ITodo[] = [
//   {
//     id: '1',
//     title: 'Mock Todo',
//     completed: false,
//     description: 'Mock Todo Description',
//     expired: false,
//     createdAt: new Date(),
//     updatedAt: new Date(),
//     dueDate: new Date(new Date().setDate(new Date().getDate() + 1)),
//   },
//   {
//     id: '2',
//     title: 'Mock Todo',
//     completed: false,
//     description: 'Mock Todo Description',
//     expired: false,
//     createdAt: new Date(),
//     updatedAt: new Date(),
//     dueDate: new Date(new Date().setDate(new Date().getDate() + 1)),
//   },
// ];

export const todosTestData: ITodo[] = generateTestTodos(100);
