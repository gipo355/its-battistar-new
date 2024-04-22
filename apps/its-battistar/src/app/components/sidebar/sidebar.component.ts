import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';

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

  @Input()
  menuItems = [
    {
      title: 'Overview',
      icon: '🛖',
      link: 'overview',
    },
    {
      title: 'Todos',
      icon: '✅',
      link: 'todos',
    },
    {
      title: 'Settings',
      icon: '⚙️',
      link: 'settings',
    },
  ];
}
