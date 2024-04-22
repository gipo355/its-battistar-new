import { provideRouter } from '@angular/router';
import {
  applicationConfig,
  type Meta,
  type StoryObj,
} from '@storybook/angular';

import { dashboardRoutes } from '../../pages/dashboard/dashboard.routes';
import { MainContentComponent } from './main-content.component';

const meta: Meta<MainContentComponent> = {
  title: 'MainContentComponent',
  component: MainContentComponent,
  decorators: [
    applicationConfig({
      providers: [provideRouter(dashboardRoutes)],
    }),
  ],
};
export default meta;
type Story = StoryObj<MainContentComponent>;

export const Primary: Story = {
  args: {},
};
