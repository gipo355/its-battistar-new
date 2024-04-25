/* eslint-disable no-magic-numbers */
import { faker } from '@faker-js/faker';
import { ITodo } from '@its-battistar/shared-types';

function generateTestTodos(n: number): ITodo[] {
  const todos: ITodo[] = [];
  for (let i = 0; i < n; i++) {
    const newTodo = {
      id: faker.string.uuid(),
      title: faker.lorem.sentence(2),
      description: faker.lorem.sentence(20),
      completed: faker.datatype.boolean(),
      dueDate: faker.date.future(),
      expired: faker.datatype.boolean(),
      createdAt: faker.date.recent(),
      updatedAt: faker.date.recent(),
    };

    todos.push(newTodo);
  }
  return todos;
}

export const todosTestData: ITodo[] = generateTestTodos(100);
