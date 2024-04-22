import { provideRouter } from '@angular/router';
import {
  applicationConfig,
  type Meta,
  type StoryObj,
} from '@storybook/angular';

import { AppComponent } from './app.component';
import { appRoutes } from './app.routes';

const meta: Meta<AppComponent> = {
  component: AppComponent,
  title: 'AppComponent',
  decorators: [
    applicationConfig({
      providers: [provideRouter(appRoutes)],
    }),
  ],
};
export default meta;
type Story = StoryObj<AppComponent>;

export const Primary: Story = {
  args: {},
};