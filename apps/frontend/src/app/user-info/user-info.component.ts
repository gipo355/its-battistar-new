import { CommonModule } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    inject,
    input,
} from '@angular/core';
import { Router } from '@angular/router';

import type { User } from '../../model/user';
import { AuthService } from '../api/auth.service';

@Component({
    selector: 'app-user-info',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './user-info.component.html',
    styleUrl: './user-info.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserInfoComponent {
    user = input<User | null>(null);
    authService = inject(AuthService);
    router = inject(Router);

    logout(): void {
        // Implement logout logic here
        this.authService.logout();
        void this.router.navigate(['/authenticate'], {
            replaceUrl: true,
        });
    }
}
