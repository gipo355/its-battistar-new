import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject,OnInit } from '@angular/core';

import { ApiService } from '../api/api.service';
import { UserListService } from './user-list.service';


@Component({
    selector: 'app-user-list',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './user-list.component.html',
    styleUrl: './user-list.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserListComponent implements OnInit {
    apiService = inject(ApiService);
    userListService = inject(UserListService);


    ngOnInit(): void {
        this.apiService.getUsers();
    }
}
