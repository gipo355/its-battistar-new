import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';

import { AuthService } from '../../api/auth.service';

@Component({
    selector: 'app-authenticate',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './authenticate.component.html',
    styleUrl: './authenticate.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthenticateComponent {
    isLoginForm = true;
    fb = inject(FormBuilder);

    loginForm = this.fb.group({
        username: new FormControl('', []),
        password: new FormControl('', []),
    });

    registerForm = this.fb.group({
        firstName: new FormControl('', []),
        lastName: new FormControl('', []),
        picture: new FormControl('', []),
        username: new FormControl('', []),
        password: new FormControl('', []),
    });

    authService = inject(AuthService);

    onSubmit(): void {
        if (this.isLoginForm) {
            const login = {
                username: this.loginForm.value.username,
                password: this.loginForm.value.password,
            };

            if (!login.username || !login.password) {
                this.loginForm.markAllAsTouched();
                return;
            }

            this.authService.login(login.username, login.password);
        } else {
            const firstName = this.registerForm.value.firstName;
            const lastName = this.registerForm.value.lastName;
            const picture = this.registerForm.value.picture;
            const username = this.registerForm.value.username;
            const password = this.registerForm.value.password;

            if (!firstName || !lastName || !picture || !username || !password) {
                this.loginForm.markAllAsTouched();
                return;
            }

            this.authService.register({
                firstName,
                lastName,
                picture,
                username,
                password,
            });
        }
    }

    toggleForms(): void {
        this.isLoginForm = !this.isLoginForm;
    }
}
