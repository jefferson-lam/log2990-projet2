import { Component } from '@angular/core';

@Component({
    selector: 'app-save-page-error',
    templateUrl: './save-page-error.component.html',
    styleUrls: ['./save-page-error.component.scss'],
})
export class SavePageErrorComponent {
    reason: string;

    setReason(errorReason: string): void {
        this.reason = errorReason;
    }
}
