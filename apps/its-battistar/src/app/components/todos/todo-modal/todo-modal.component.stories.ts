import {
  applicationConfig,
  type Meta,
  type StoryObj,
} from '@storybook/angular';

import { TodoModalComponent } from './todo-modal.component';

const meta: Meta<TodoModalComponent> = {
  title: 'TodoModalComponent',
  component: TodoModalComponent,
  decorators: [
    applicationConfig({
      providers: [],
    }),
  ],
};
export default meta;
type Story = StoryObj<TodoModalComponent>;

export const Primary: Story = {
  args: {},
};
