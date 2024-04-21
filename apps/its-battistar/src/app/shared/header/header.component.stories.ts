import { provideRouter } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import {
  applicationConfig,
  type Meta,
  moduleMetadata,
  type StoryObj,
} from '@storybook/angular';

import { appRoutes } from '../../app.routes';
import { HeaderComponent } from './header.component';

const meta: Meta<HeaderComponent> = {
  component: HeaderComponent,
  title: 'HeaderComponent',
  decorators: [
    applicationConfig({
      providers: [provideRouter(appRoutes)],
    }),
    moduleMetadata({
      imports: [RouterTestingModule],
    }),
  ],
};
export default meta;
type Story = StoryObj<HeaderComponent>;

export const Primary: Story = {
  args: {},
};
