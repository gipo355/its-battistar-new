import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'lib-error-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './error-page.component.html',
  styleUrl: './error-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ErrorPageComponent {
  name = 'ErrorPageComponent';
}
