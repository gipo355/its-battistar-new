/* eslint-disable no-magic-numbers */
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
    FormBuilder,
    FormControl,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { isStrongPassword } from 'validator';

import { AuthService } from '../../api/auth.service';
import { InfoPopupService } from '../../info-popup/info-popup.service';
import { inputIsASCII } from '../../shared/inputIsASCII';
import { inputIsStrongPassword } from '../../shared/inputIsStrongPassword';
import { inputIsUrl } from '../../shared/inputIsUrl';
import { passwordMatchValidator } from '../../shared/passwordMatchValidator';

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

    registerForm = this.fb.group(
        {
            firstName: new FormControl('', [
                Validators.required.bind(this),
                Validators.minLength(2),
            ]),
            lastName: new FormControl('', [
                Validators.required.bind(this),
                Validators.minLength(2),
            ]),
            picture: new FormControl('', [
                Validators.required.bind(this),
                inputIsUrl(),
            ]),
            username: new FormControl('', [
                inputIsASCII(),
                Validators.minLength(3),
            ]),
            password: new FormControl('', [inputIsStrongPassword()]),
            confirmPassword: new FormControl('', []),
        },
        { validators: passwordMatchValidator }
    );

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

            'success'
        );
        // BUG: doesn't navigate to the home page on first click
        setTimeout(() => {
            void this.router.navigate(['/']);
        }, 1000);
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

            'success'
        );

        // BUG: doesn't navigate to the home page on first click
        // must wait for signals to be updated
        setTimeout(() => {
            void this.router.navigate(['/']);
        }, 1000);
    }

    toggleForms(): void {
        this.isLoginForm = !this.isLoginForm;
    }
}
