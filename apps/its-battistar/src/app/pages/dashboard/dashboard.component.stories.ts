import { provideRouter } from '@angular/router';
import {
  applicationConfig,
  type Meta,
  type StoryObj,
} from '@storybook/angular';

import { DashboardComponent } from './dashboard.component';
import { dashboardRoutes } from './dashboard.routes';

const meta: Meta<DashboardComponent> = {
  title: 'DashboardComponent',
  component: DashboardComponent,
  decorators: [
    applicationConfig({
      providers: [provideRouter(dashboardRoutes)],
    }),
  ],
};
export default meta;
type Story = StoryObj<DashboardComponent>;

export const Primary: Story = {
  args: {},
};
