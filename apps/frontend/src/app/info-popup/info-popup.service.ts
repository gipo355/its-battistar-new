import { Injectable, signal } from '@angular/core';

interface Message {
    duration: number;
    message: string;
    type: 'info' | 'success' | 'warning' | 'error';
}

@Injectable({
    providedIn: 'root',
})
export class InfoPopupService {
    messages = signal<Map<symbol, Message>>(new Map());

    showNotification(
        message: string,
        type: 'info' | 'success' | 'warning' | 'error' = 'info',
        // eslint-disable-next-line no-magic-numbers
        duration = 3000
    ): void {
        const newMsgs = new Map(this.messages());

        const s = Symbol(message);

        newMsgs.set(s, {
            message,
            type,
            duration,
        });

        this.messages.set(newMsgs);

        setTimeout(() => {
            const clearedMessages = new Map(this.messages());
            clearedMessages.delete(s);
            this.messages.set(clearedMessages);
        }, duration);
    }
}
