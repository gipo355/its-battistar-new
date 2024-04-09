import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NxWelcomeComponent } from './nx-welcome.component';
import {
  NgbPaginationModule,
  NgbAlertModule,
} from '@ng-bootstrap/ng-bootstrap';

@Component({
  standalone: true,
  imports: [
    NxWelcomeComponent,
    RouterModule,

    // ng-bootstrap modules
    NgbPaginationModule,
    NgbAlertModule,
  ],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'its-battistar';
}
