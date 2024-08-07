import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../../api/auth.service';
import { InfoPopupService } from '../../info-popup/info-popup.service';

@Component({
    selector: 'app-authenticate',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './authenticate.component.html',
    styleUrl: './authenticate.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthenticateComponent {
    isLoginForm = true;
    fb = inject(FormBuilder);
    router = inject(Router);
    infoPopupService = inject(InfoPopupService);

    // TODO: add validation
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
        confirmPassword: new FormControl('', []),
    });

    authService = inject(AuthService);

    onSubmitLoginForm(): void {
        const login = {
            username: this.loginForm.value.username,
            password: this.loginForm.value.password,
        };

        if (!login.username || !login.password) {
            this.loginForm.markAllAsTouched();
            return;
        }

        this.authService.login(login.username, login.password);
        this.infoPopupService.showNotification(
            'Successfully logged in!',
            // eslint-disable-next-line no-magic-numbers
            5000,
            'success'
        );
        // BUG: doesn't navigate to the home page on first click
        this.router.navigate(['/']);
    }
    onSubmitRegisterForm(): void {
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

        this.infoPopupService.showNotification(
            'Successfully registered!',
            // eslint-disable-next-line no-magic-numbers
            5000,
            'success'
        );

        // BUG: doesn't navigate to the home page on first click
        this.router.navigate(['/']);
    }

    toggleForms(): void {
        this.isLoginForm = !this.isLoginForm;
    }
}
