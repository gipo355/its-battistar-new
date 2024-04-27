import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import { IMenuItem } from '../../pages/dashboard/dashboard.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent {
  title = 'Sidebar';

  // TODO: move to signal input
  // @Input()
  // menuItems: IMenuItem[] = [];
  menuItems = input<IMenuItem[]>();
}
