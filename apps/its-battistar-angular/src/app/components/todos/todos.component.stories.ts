import type { Meta, StoryObj } from '@storybook/angular';

import { TodosComponent } from './todos.component';

const meta: Meta<TodosComponent> = {
  component: TodosComponent,
  title: 'TodosComponent',
};
export default meta;
type Story = StoryObj<TodosComponent>;

export const Primary: Story = {
  args: {},
};
