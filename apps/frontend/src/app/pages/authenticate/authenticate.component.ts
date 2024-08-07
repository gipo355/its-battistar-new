import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

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

    toggleForms(): void {
        this.isLoginForm = !this.isLoginForm;
    }
}
