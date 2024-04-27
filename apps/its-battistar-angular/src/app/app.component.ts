import { HttpClientModule } from '@angular/common/http';
import { Component, effect, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { getState } from '@ngrx/signals';
import * as Sentry from '@sentry/angular-ivy';
import { initFlowbite } from 'flowbite';

import { TodosStore } from './components/todos/todos.store';

@Component({
  standalone: true,
  imports: [RouterModule, HttpClientModule],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  todoStore = inject(TodosStore);
  trace = inject(Sentry.TraceService);

  ngOnInit(): void {
    initFlowbite();
  }

  constructor() {
    // TODO: remove this at the end, log state
    console.log('App component init');

    effect(() => {
      const state = getState(this.todoStore);
      console.log('state changed', state);
    });
  }

  title = 'its-battistar';
}
