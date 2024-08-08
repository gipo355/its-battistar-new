import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { InfoPopupService } from './info-popup.service';

@Component({
    selector: 'app-info-popup',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './info-popup.component.html',
    styleUrl: './info-popup.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InfoPopupComponent {
    infoPopupService = inject(InfoPopupService);

    // ngOnInit(): void {
    //     if (this.infoPopupService.message().length) {
    //         setTimeout(() => {
    //             this.infoPopupService.message.set('');
    //         }, this.infoPopupService.duration());
    //     }
    // }
}
