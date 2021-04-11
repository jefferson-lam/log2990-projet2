import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';

@Component({
    selector: 'app-discard-changes-popup',
    templateUrl: './discard-changes-popup.component.html',
    styleUrls: ['./discard-changes-popup.component.scss'],
})
export class DiscardChangesPopupComponent {
    constructor(public matDialogRef: MatDialogRef<DiscardChangesPopupComponent>, public undoRedoService: UndoRedoService, public router: Router) {
        this.matDialogRef.disableClose = true;
    }

    cancel(): void {
        this.matDialogRef.close(false);
    }

    discardChanges(): void {
        this.undoRedoService.reset();
        localStorage.removeItem('autosave');
        this.matDialogRef.close(true);
    }
}
