import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NxWelcomeComponent } from './nx-welcome.component';
import { sharedTypes } from '@its-battistar/shared-types';
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
export class AppComponent implements OnInit {
  title = 'its-battistar';

  ngOnInit(): void {
    console.log(sharedTypes());
  }
}
