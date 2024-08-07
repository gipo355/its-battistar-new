import { Component, inject, OnInit } from '@angular/core';

import { ApiService } from '../../api/api.service';
import { AuthService } from '../../api/auth.service';
import { AppService } from '../../app.service';
import { InfoPopupComponent } from '../../info-popup/info-popup.component';
import { InfoPopupService } from '../../info-popup/info-popup.service';
import { SpinnerComponent } from '../../spinner/spinner.component';
import { TodoComponent } from '../../todo/todo.component';
import { TodoFormComponent } from '../../todo-form/todo-form.component';
import { TodosFilterComponent } from '../../todos-filter/todos-filter.component';
import { TodosListComponent } from '../../todos-list/todos-list.component';
import { UserInfoComponent } from '../../user-info/user-info.component';
import { UserListComponent } from '../../user-list/user-list.component';
import { UserListService } from '../../user-list/user-list.service';
import { TodosService } from './todos.service';

@Component({
    standalone: true,
    imports: [
        TodoFormComponent,
        TodosListComponent,
        TodosFilterComponent,
        SpinnerComponent,
        TodoComponent,
        InfoPopupComponent,
        UserInfoComponent,
        UserListComponent,
    ],
    selector: 'app-todos',
    templateUrl: './todos.component.html',
    styleUrl: './todos.component.scss',
})
export class TodosComponent implements OnInit {
    infoPopupService = inject(InfoPopupService);
    userListService = inject(UserListService);
    appService = inject(AppService);
    todosService = inject(TodosService);
    authService = inject(AuthService);
    apiService = inject(ApiService);

    ngOnInit(): void {
        this.apiService.getTodos();
    }
}
