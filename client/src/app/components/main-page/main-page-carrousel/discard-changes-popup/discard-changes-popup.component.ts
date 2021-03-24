import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';

@Component({
    selector: 'app-discard-changes-popup',
    templateUrl: './discard-changes-popup.component.html',
    styleUrls: ['./discard-changes-popup.component.scss'],
})
export class DiscardChangesPopupComponent {
    dataUrl: string;
    constructor(
        public undoRedoService: UndoRedoService,
        public drawingService: DrawingService,
        public router: Router,
        // tslint:disable-next-line:no-any
        @Inject(MAT_DIALOG_DATA) data: any,
    ) {
        this.dataUrl = data.dataUrl;
    }

    discardChanges(): void {
        this.undoRedoService.reset();
        this.drawingService.setInitialImage(this.dataUrl);
        this.router.navigate(['/', 'editor']);
    }
}
