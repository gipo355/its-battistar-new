import { provideRouter } from '@angular/router';
import {
  applicationConfig,
  type Meta,
  type StoryObj,
} from '@storybook/angular';

import { dashboardRoutes } from '../../pages/dashboard/dashboard.routes';
import { SidebarComponent } from './sidebar.component';

const meta: Meta<SidebarComponent> = {
  title: 'SidebarComponent',
  component: SidebarComponent,
  decorators: [
    applicationConfig({
      providers: [provideRouter(dashboardRoutes)],
    }),
  ],
};
export default meta;
type Story = StoryObj<SidebarComponent>;

export const Primary: Story = {
  args: {},
};
