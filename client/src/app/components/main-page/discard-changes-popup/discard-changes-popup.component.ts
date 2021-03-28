import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'app-discard-changes-popup',
    templateUrl: './discard-changes-popup.component.html',
    styleUrls: ['./discard-changes-popup.component.scss'],
})
export class DiscardChangesPopupComponent {
    constructor(public matDialogRef: MatDialogRef<DiscardChangesPopupComponent>) {
        this.matDialogRef.disableClose = true;
    }

    cancel(): void {
        this.matDialogRef.close(false);
    }

    discardChanges(): void {
        this.matDialogRef.close(true);
    }
}
