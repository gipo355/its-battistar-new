/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable no-magic-numbers */
import type { ITodo } from '@its-battistar/shared-types';
import {
  applicationConfig,
  type Meta,
  type StoryObj,
} from '@storybook/angular';

import { TodoItemComponent } from './todo-item.component';

const mockTodo: ITodo = {
  id: '1',
  title: 'Mock Todo',
  completed: false,
  description: 'Mock Todo Description',
  expired: false,
  createdAt: new Date(),
  updatedAt: new Date(),
  dueDate: new Date(new Date().setDate(new Date().getDate() + 1)),
};

const mockTodoExpired: ITodo = {
  id: '1',
  title: 'Mock Todo Expired',
  completed: false,
  description: 'Mock Todo Description',
  expired: true,
  createdAt: new Date(),
  updatedAt: new Date(),
  dueDate: new Date(new Date().setDate(new Date().getDate() + 1)),
};

const meta: Meta<TodoItemComponent> = {
  title: 'TodoItemComponent',
  component: TodoItemComponent,
  decorators: [
    applicationConfig({
      providers: [],
    }),
  ],
};
export default meta;
type Story = StoryObj<TodoItemComponent>;

// TODO: how to test signals?
export const Primary: Story = {
  args: {
    todo: mockTodo as any,
  },
};
export const Expired: Story = {
  args: {
    todo: mockTodoExpired as any,
  },
};
