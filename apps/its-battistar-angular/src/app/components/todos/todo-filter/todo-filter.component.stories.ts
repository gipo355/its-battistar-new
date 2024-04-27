import {
  applicationConfig,
  type Meta,
  type StoryObj,
} from '@storybook/angular';

import { TodoFilterComponent } from './todo-filter.component';

const meta: Meta<TodoFilterComponent> = {
  title: 'TodoFilterComponent',
  component: TodoFilterComponent,
  decorators: [
    applicationConfig({
      providers: [],
    }),
  ],
};
export default meta;
type Story = StoryObj<TodoFilterComponent>;

export const Primary: Story = {
  args: {},
};
