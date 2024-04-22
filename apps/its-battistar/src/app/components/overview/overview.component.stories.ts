import { provideRouter } from '@angular/router';
import {
  applicationConfig,
  type Meta,
  type StoryObj,
} from '@storybook/angular';

import { dashboardRoutes } from '../../pages/dashboard/dashboard.routes';
import { OverviewComponent } from './overview.component';

const meta: Meta<OverviewComponent> = {
  title: 'OverviewComponent',
  component: OverviewComponent,
  decorators: [
    applicationConfig({
      providers: [provideRouter(dashboardRoutes)],
    }),
  ],
};
export default meta;
type Story = StoryObj<OverviewComponent>;

export const Primary: Story = {
  args: {},
};
