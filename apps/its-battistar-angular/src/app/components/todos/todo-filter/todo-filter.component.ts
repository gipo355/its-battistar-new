import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ETodoSortByOptions } from '@its-battistar/shared-types';
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

  /**
   * @description
   * this ngOnInit will handle the form changes and update the store
   */
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
          value.showCompleted !== this.todoStore.filter.showCompleted()
        ) {
          this.todoStore.updateFilters({
            showCompleted: value.showCompleted,
          });
        }

        if (
          value.showExpired !== undefined &&
          value.showExpired !== null &&
          // avoid launching useless signals
          value.showExpired !== this.todoStore.filter.showExpired()
        ) {
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

  /**
   * provide the options for the sortBy select menu from the store
   */
  sortByOptions = Object.keys(this.todoStore.todoSortByOptions());

  /**
   * @description
   * this is the form that will be used to filter the todos
   * it will be initialized with the current values from the store
   */
  filterForm = new FormGroup({
    showCompleted: new FormControl<boolean>(
      this.todoStore.filter.showCompleted()
    ), // checked/unchecked
    // reset the original sort by hardcoding it, can improve this
    sortBy: new FormControl<keyof typeof ETodoSortByOptions>('Newest'), // date/title
    filterBox: new FormControl<string>(''), // search
    showExpired: new FormControl<boolean>(this.todoStore.filter.showExpired()), // checked/unchecked
  });

  onClearFilter(): void {
    this.filterForm.get('filterBox')?.setValue('');
  }
}
