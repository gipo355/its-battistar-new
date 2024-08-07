/* eslint-disable no-magic-numbers */
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
        username: new FormControl('', [
            Validators.required.bind(Validators).bind(this),
            Validators.minLength(3).bind(this),
        ]),
        password: new FormControl('', [
            Validators.required.bind(Validators).bind(this),
            Validators.minLength(8).bind(this),
        ]),
    });

    registerForm = this.fb.group({
        firstName: new FormControl('', [
            Validators.required.bind(Validators).bind(this),
            Validators.minLength(3).bind(this),
        ]),
        lastName: new FormControl('', [
            Validators.required.bind(Validators).bind(this),
            Validators.minLength(3).bind(this),
        ]),
        picture: new FormControl('', [
            Validators.required.bind(Validators).bind(this),
            Validators.minLength(3).bind(this),
        ]),
        username: new FormControl('', [
            Validators.required.bind(Validators).bind(this),
            Validators.pattern(
                '^([0-9]{4})-(1[0-2]|0[1-9])-(3[01]|0[1-9]|[12][0-9])$'
            ).bind(this),
        ]),
        password: new FormControl('', [
            Validators.required.bind(Validators).bind(this),
            Validators.minLength(8).bind(this),
        ]),
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
