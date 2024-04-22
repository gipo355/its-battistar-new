import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { initFlowbite } from 'flowbite';

import { MainContentComponent } from '../../components/main-content/main-content.component';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { TopBarComponent } from '../../components/top-bar/top-bar.component';
import { HeaderComponent } from '../../shared/header/header.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    SidebarComponent,
    MainContentComponent,
    RouterModule,
    TopBarComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent implements OnInit {
  title = 'Dashboard';
  ngOnInit(): void {
    initFlowbite();
  }
}
