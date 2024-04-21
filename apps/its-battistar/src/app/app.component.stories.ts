import { provideRouter } from '@angular/router';
import {
  applicationConfig,
  type Meta,
  type StoryObj,
} from '@storybook/angular';

import { AppComponent } from './app.component';
// import { RouterTestingModule } from '@angular/router/testing';
import { appRoutes } from './app.routes';

const meta: Meta<AppComponent> = {
  component: AppComponent,
  title: 'AppComponent',
  decorators: [
    applicationConfig({
      providers: [provideRouter(appRoutes)],
    }),
    // moduleMetadata({
    //   // imports: [RouterTestingModule],
    //   // providers: [],
    //   // declarations: [],
    // }),
  ],
};
export default meta;
type Story = StoryObj<AppComponent>;

export const Primary: Story = {
  args: {},
};
