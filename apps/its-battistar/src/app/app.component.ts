import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import {
  NgbAlertModule,
  NgbPaginationModule,
  NgbTooltipModule,
} from '@ng-bootstrap/ng-bootstrap';

@Component({
  standalone: true,
  imports: [
    RouterModule,

    // ng-bootstrap modules
    NgbTooltipModule,
    NgbPaginationModule,
    NgbAlertModule,
  ],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'its-battistar';

  tooltip = 'This is a tooltip';
}
