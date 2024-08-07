import { CommonModule } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    inject,
    OnDestroy,
} from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subject, takeUntil } from 'rxjs';

import { TodosService } from '../pages/todos/todos.service';

@Component({
    selector: 'app-todos-filter',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './todos-filter.component.html',
    styleUrl: './todos-filter.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodosFilterComponent implements OnDestroy {
    private destroy$ = new Subject<void>();
    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
    todosService = inject(TodosService);
    fb = inject(FormBuilder);
    // this comp is the top bar allowing to filter the todos with showCompleted and dueDate
    // it also has  a button to create a new todo

    filterForm = this.fb.group({
        filter: [''],
    });

    filterFormControl = this.filterForm.get('filter') as FormControl<string>;

    constructor() {
        this.filterForm
            .get('filter')
            ?.valueChanges.pipe(
                takeUntil(this.destroy$),
                // eslint-disable-next-line no-magic-numbers
                debounceTime(300),
                distinctUntilChanged()
            )
            .subscribe((value) => {
                if (value?.length) this.todosService.filterValue.set(value);
            });
    }
}
