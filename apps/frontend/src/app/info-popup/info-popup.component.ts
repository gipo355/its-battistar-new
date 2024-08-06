import { CommonModule } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    input,
    model,
    OnInit,
} from '@angular/core';

@Component({
    selector: 'app-info-popup',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './info-popup.component.html',
    styleUrl: './info-popup.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InfoPopupComponent implements OnInit {
    message = model('');

    type = model<'info' | 'success' | 'warning' | 'error'>('info');

    // eslint-disable-next-line no-magic-numbers
    duration = input(3000);

    ngOnInit(): void {
        if (this.message.length) {
            setTimeout(() => {
                this.message.set('');
            }, this.duration());
        }
    }
}
