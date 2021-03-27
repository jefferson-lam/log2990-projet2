import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'app-discard-changes-popup',
    templateUrl: './discard-changes-popup.component.html',
    styleUrls: ['./discard-changes-popup.component.scss'],
})
export class DiscardChangesPopupComponent {
    discard: boolean;
    constructor(public matDialogRef: MatDialogRef<DiscardChangesPopupComponent>) {
        this.discard = false;
        matDialogRef.beforeClosed().subscribe(() => {
            matDialogRef.close(this.discard);
        });
    }

    discardChanges(): void {
        this.discard = true;
    }
}
