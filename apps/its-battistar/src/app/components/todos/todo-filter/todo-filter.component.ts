import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, Subject, takeUntil } from 'rxjs';

import { TodoSortByOptions, TodosStore } from '../todos.store';

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
        console.log('value', value);

        // handle show completed
        if (
          value.showCompleted !== undefined &&
          value.showCompleted !== null &&
          // avoid launching useless signals
          value.showCompleted !== this.todoStore.filter.showCompleted()
        ) {
          this.todoStore.updateFilters({
            showCompleted: value.showCompleted,
          });
        }

        console.log(value.showExpired, this.todoStore.filter.showExpired());
        if (
          value.showExpired !== undefined &&
          value.showExpired !== null &&
          // avoid launching useless signals
          value.showExpired !== this.todoStore.filter.showExpired()
        ) {
          console.log('if');
          this.todoStore.updateFilters({
            showExpired: value.showExpired,
          });
        }

        // handle sortBy
        if (
          value.sortBy !== undefined &&
          value.sortBy !== null &&
          value.sortBy !== this.todoStore.filter.currentSortBy()
        ) {
          this.todoStore.updateFilters({
            currentSortBy: value.sortBy,
          });
        }

        // handle query
        if (value.filterBox !== undefined && value.filterBox !== null) {
          this.todoStore.updateFilters({
            query: value.filterBox,
          });
        }
      });
  }

  sortByOptions = Object.keys(TodoSortByOptions);

  filterForm = new FormGroup({
    showCompleted: new FormControl<boolean>(
      this.todoStore.filter.showCompleted()
    ), // checked/unchecked
    // reset the original sort by hardcoding it, can improve this
    sortBy: new FormControl<keyof typeof TodoSortByOptions>('Newest'), // date/title
    filterBox: new FormControl<string>(''), // search
    showExpired: new FormControl<boolean>(this.todoStore.filter.showExpired()), // checked/unchecked
  });

  // TODO: is there a way to use signal here instead?
  // checked = signal<boolean>( this.getFormControl<boolean>('showCompleted').value as boolean);

  // getFormControl<T>(name: string): FormControl {
  //   return this.filterForm.get(name) as FormControl<T>;
  // }
}
