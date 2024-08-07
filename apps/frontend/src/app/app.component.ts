import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { AuthService } from './api/auth.service';
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
        RouterOutlet,
    ],

    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
    infoPopupService = inject(InfoPopupService);
    authService = inject(AuthService);

    ngOnInit(): void {
        this.authService.loadFromLocalStorage();
    }
}
