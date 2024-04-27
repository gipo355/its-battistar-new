import { provideRouter } from '@angular/router';
import {
  applicationConfig,
  type Meta,
  type StoryObj,
} from '@storybook/angular';

import { dashboardRoutes } from '../../pages/dashboard/dashboard.routes';
import { TopBarComponent } from './top-bar.component';

const meta: Meta<TopBarComponent> = {
  title: 'TopBarComponent',
  component: TopBarComponent,
  decorators: [
    applicationConfig({
      providers: [provideRouter(dashboardRoutes)],
    }),
  ],
};
export default meta;
type Story = StoryObj<TopBarComponent>;

export const Primary: Story = {
  args: {},
};
