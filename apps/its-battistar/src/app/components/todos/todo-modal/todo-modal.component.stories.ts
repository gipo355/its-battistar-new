import { provideRouter } from '@angular/router';
import {
  applicationConfig,
  type Meta,
  type StoryObj,
} from '@storybook/angular';

import { todosRoutes } from '../todos.routes';
import { TodoModalComponent } from './todo-modal.component';

const meta: Meta<TodoModalComponent> = {
  title: 'TodoModalComponent',
  component: TodoModalComponent,
  decorators: [
    applicationConfig({
      providers: [provideRouter(todosRoutes)],
    }),
  ],
};
export default meta;
type Story = StoryObj<TodoModalComponent>;

export const Primary: Story = {
  args: {},
};
export const Edit: Story = {
  args: {},
};
