/* eslint-disable no-magic-numbers */
// TODO: remove faker, reduce budget max size to 1mb in project.json
import { faker } from '@faker-js/faker/locale/en';
import type { ITodo } from '@its-battistar/shared-types';

// must provide an enum to faker
enum TodoColorOptions {
  blue = 'blue',
  default = 'default',
  green = 'green',
  pink = 'pink',
  red = 'red',
  yellow = 'yellow',
}

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
      user: faker.string.uuid(),
    };

    todos.push(newTodo);
  }
  return todos;
}
const todosTestData: ITodo[] = generateTestTodos(100);

export const todosTestDataMap = new Map<string, ITodo>(
  todosTestData.filter((todo) => todo.id).map((todo) => [todo.id, todo]) as [
    string,
    ITodo,
  ][]
);

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
