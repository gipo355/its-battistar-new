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

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngOnInit(): void {
    this.filterForm.valueChanges
      // eslint-disable-next-line no-magic-numbers
      .pipe(takeUntil(this.destroy$), debounceTime(300))
      .subscribe((value) => {
        if (value.showCompleted !== undefined && value.showCompleted !== null) {
          this.todoStore.setShowCompleted(value.showCompleted);
        }
      });
  }

  todoStore = inject(TodosStore);

  filterForm = new FormGroup({
    showCompleted: new FormControl<boolean>(false), // checked/unchecked
    sortBy: new FormControl<keyof typeof TodoSortBy>('dueDate'), // date/title
  });

  sortByOptions = Object.values(TodoSortBy);

  // TODO: is there a way to use signal here?
  // checked = signal<boolean>(
  //   this.getFormControl<boolean>('showCompleted').value as boolean
  // );

  getFormControl<T>(name: string): FormControl {
    return this.filterForm.get(name) as FormControl<T>;
  }
}
