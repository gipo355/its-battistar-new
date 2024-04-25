import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TodoSortBy } from '@its-battistar/shared-types';
import { debounceTime, Subject, takeUntil } from 'rxjs';

import { TodosStore } from '../todos.store';

// TODO: extract todo store and make it dumb component

@Component({
  selector: 'app-todo-filter',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './todo-filter.component.html',
  styleUrl: './todo-filter.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodoFilterComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  todoStore = inject(TodosStore);

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngOnInit(): void {
    // Using an observable, they are still good for events
    this.filterForm.valueChanges
      // eslint-disable-next-line no-magic-numbers
      .pipe(takeUntil(this.destroy$), debounceTime(300))
      .subscribe((value) => {
        // handle show completed
        if (
          value.showCompleted !== undefined &&
          value.showCompleted !== null &&
          // avoid launching useless signals
          value.showCompleted !== this.todoStore.showCompleted()
        ) {
          this.todoStore.setShowCompleted(value.showCompleted);
        }

        // handle sortBy
        if (
          value.sortBy !== undefined &&
          value.sortBy !== null &&
          value.sortBy !== this.todoStore.currentSortBy()
        ) {
          this.todoStore.updateSort(value.sortBy);
        }
      });
  }

  sortByOptions = Object.keys(TodoSortBy);

  filterForm = new FormGroup({
    showCompleted: new FormControl<boolean>(false), // checked/unchecked
    sortBy: new FormControl<keyof typeof TodoSortBy>('Newest'), // date/title
    filterBox: new FormControl<string>(''), // search
  });

  // TODO: is there a way to use signal here instead?
  // checked = signal<boolean>( this.getFormControl<boolean>('showCompleted').value as boolean);

  getFormControl<T>(name: string): FormControl {
    return this.filterForm.get(name) as FormControl<T>;
  }
}
