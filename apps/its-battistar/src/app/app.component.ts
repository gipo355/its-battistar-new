import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

import { HeaderComponent } from './shared/header/header.component';

@Component({
  standalone: true,
  imports: [
    RouterModule,
    HttpClientModule,

    HeaderComponent,

    // ng-bootstrap modules
  ],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'its-battistar';
}
