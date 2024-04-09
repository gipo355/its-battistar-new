import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { sharedTypes } from '@its-battistar/shared-types';
import {
  NgbAlertModule,
  NgbPaginationModule,
  NgbTooltipModule,
} from '@ng-bootstrap/ng-bootstrap';

import { NxWelcomeComponent } from './nx-welcome.component';

@Component({
  standalone: true,
  imports: [
    NxWelcomeComponent,
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
export class AppComponent implements OnInit {
  title = 'its-battistar';

  ngOnInit(): void {
    console.log(sharedTypes());
  }
}
