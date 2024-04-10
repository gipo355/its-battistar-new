import { HttpClient, HttpClientModule } from '@angular/common/http';
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
    HttpClientModule,

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

  constructor(private http: HttpClient) {}

  tooltip = 'This is a tooltip';

  onHttp() {
    this.http.get('/api').subscribe({
      next: (response) => {
        console.log(response);
      },
      error: (error) => {
        console.error(error);
      },
    });
  }
}
