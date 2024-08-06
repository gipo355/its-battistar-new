import { Injectable, signal } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class InfoPopupService {
    message = signal('');
    type = signal<'info' | 'success' | 'warning' | 'error'>('info');
    // eslint-disable-next-line no-magic-numbers
    duration = signal(5000);

    showNotification(
        message: string,
        // eslint-disable-next-line no-magic-numbers
        duration = 5000,
        type: 'info' | 'success' | 'warning' | 'error' = 'info'
    ): void {
        this.message.set(message);
        this.type.set(type);
        this.duration.set(duration);

        setTimeout(() => {
            this.message.set('');
        }, this.duration()); // Duration in milliseconds
    }
}
