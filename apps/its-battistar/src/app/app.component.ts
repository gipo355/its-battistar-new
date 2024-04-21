import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TodosComponent } from '@its-battistar/todos';

@Component({
  standalone: true,
  imports: [
    RouterModule,
    HttpClientModule,

    TodosComponent,

    // ng-bootstrap modules
  ],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'its-battistar';

  tooltip = 'This is a tooltip';
}
