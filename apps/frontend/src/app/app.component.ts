import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { TodoComponent } from './todo/todo.component';
import { TodoFormComponent } from './todo-form/todo-form.component';
import { TodosFilterComponent } from './todos-filter/todos-filter.component';
import { TodosListComponent } from './todos-list/todos-list.component';

@Component({
    standalone: true,
    imports: [
        CommonModule,
        TodoFormComponent,
        TodosListComponent,
        TodosFilterComponent,
        TodoComponent,
    ],
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
})
export class AppComponent {
    title = 'frontend';
}
