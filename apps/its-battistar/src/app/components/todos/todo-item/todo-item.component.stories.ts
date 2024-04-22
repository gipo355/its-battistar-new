import {
  applicationConfig,
  type Meta,
  type StoryObj,
} from '@storybook/angular';

import { TodoItemComponent } from './todo-item.component';

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

export const Primary: Story = {
  args: {},
};
