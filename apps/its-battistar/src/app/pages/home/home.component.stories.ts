import { provideRouter } from '@angular/router';
import {
  applicationConfig,
  type Meta,
  type StoryObj,
} from '@storybook/angular';

import { appRoutes } from '../../app.routes';
import { HomeComponent } from './home.component';

const meta: Meta<HomeComponent> = {
  component: HomeComponent,
  title: 'HomeComponent',
  decorators: [
    applicationConfig({
      providers: [provideRouter(appRoutes)],
    }),
  ],
};
export default meta;
type Story = StoryObj<HomeComponent>;

export const Primary: Story = {
  args: {},
};
