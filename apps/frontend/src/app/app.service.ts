import { Injectable, type Signal, signal } from '@angular/core';

import { fakeTodos } from '../data/todos';
import type { Todo } from '../model/todo';

@Injectable({
    providedIn: 'root',
})
export class AppService {
    todos: Signal<Todo[]> = signal(fakeTodos);
    isEditing = signal(true);

    notificationMessage = signal('');
    notificationType = signal<'info' | 'success' | 'warning' | 'error'>('info');
    // eslint-disable-next-line no-magic-numbers
    popupDuration = signal(5000);

    showNotification(
        message: string,
        // eslint-disable-next-line no-magic-numbers
        duration = 5000,
        type: 'info' | 'success' | 'warning' | 'error' = 'info'
    ): void {
        this.notificationMessage.set(message);
        setTimeout(() => {
            this.notificationMessage.set('');
            this.notificationType.set(type);
            this.popupDuration.set(duration);
        }, this.popupDuration()); // Duration in milliseconds
    }
}
