import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-info-popup',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './info-popup.component.html',
    styleUrl: './info-popup.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InfoPopupComponent {}
