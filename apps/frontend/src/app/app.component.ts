import { Component, inject, OnInit } from '@angular/core';

import { ApiService } from './api/api.service';
import { AppService } from './app.service';
import { InfoPopupComponent } from './info-popup/info-popup.component';
import { InfoPopupService } from './info-popup/info-popup.service';
import { SpinnerComponent } from './spinner/spinner.component';
import { TodoComponent } from './todo/todo.component';
import { TodoFormComponent } from './todo-form/todo-form.component';
import { TodosFilterComponent } from './todos-filter/todos-filter.component';
import { TodosListComponent } from './todos-list/todos-list.component';

@Component({
    standalone: true,
    imports: [
        TodoFormComponent,
        TodosListComponent,
        TodosFilterComponent,
        SpinnerComponent,
        TodoComponent,
        InfoPopupComponent,
    ],
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
    infoPopupService = inject(InfoPopupService);
    appService = inject(AppService);
    apiService = inject(ApiService);

    ngOnInit(): void {
        this.apiService.getTodos();
    }
}
