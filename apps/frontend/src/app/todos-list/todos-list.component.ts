import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'app-todos-list',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './todos-list.component.html',
    styleUrl: './todos-list.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodosListComponent {}
