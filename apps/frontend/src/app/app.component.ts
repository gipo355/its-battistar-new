import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';

import { AppService } from './app.service';
import { InfoPopupComponent } from './info-popup/info-popup.component';
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
        InfoPopupComponent,
    ],
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
})
export class AppComponent {
    appService = inject(AppService);
}
