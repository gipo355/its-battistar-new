import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { HeaderComponent } from './shared/header/header.component';

@Component({
  standalone: true,
  imports: [
    RouterModule,
    HttpClientModule,

    HeaderComponent,

    // ng-bootstrap modules
    BrowserModule,
    NgbModule,
  ],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'its-battistar';
}
