import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'app-todos-filter',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './todos-filter.component.html',
    styleUrl: './todos-filter.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodosFilterComponent {}
