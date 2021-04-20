import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DiscardChangesPopupComponent } from '@app/components/main-page/discard-changes-popup/discard-changes-popup.component';
import { MainPageCarrouselComponent } from '@app/components/main-page/main-page-carrousel/main-page-carrousel.component';
import { ExportDrawingComponent } from '@app/components/sidebar/export-drawing/export-drawing.component';
import { NewDrawingBoxComponent } from '@app/components/sidebar/new-drawing-box/new-drawing-box.component';
import { SaveDrawingComponent } from '@app/components/sidebar/save-drawing-page/save-drawing.component';
import { ToolInfoComponent } from '@app/components/sidebar/tool-info/tool-info.component';
import { ToolManagerService } from '@app/services/manager/tool-manager-service';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';

@Injectable({
    providedIn: 'root',
})
export class PopupManagerService {
    isPopUpOpen: boolean;
    newDrawingPossible: boolean;

    constructor(public dialog: MatDialog, public undoRedoService: UndoRedoService, public toolManager: ToolManagerService, public router: Router) {
        this.newDrawingPossible = this.undoRedoService.initialImage !== undefined;
        this.undoRedoService.pileSizeObservable.subscribe(() => {
            if (this.undoRedoService.isUndoPileEmpty() && this.undoRedoService.initialImage === undefined) {
                this.newDrawingPossible = false;
                return;
            }
            this.newDrawingPossible = true;
        });
        this.isPopUpOpen = false;
        this.dialog.afterAllClosed.subscribe(() => {
            this.isPopUpOpen = false;
        });
        this.dialog.afterOpened.asObservable().subscribe(() => {
            this.isPopUpOpen = true;
        });
    }

    openCarrouselPopUp(): void {
        if (this.isPopUpOpen) return;
        const dialogRef = this.dialog.open(MainPageCarrouselComponent, {
            height: '700px',
            width: '1800px',
        });
        dialogRef.afterClosed().subscribe((imageOpen) => {
            if (!imageOpen.autosave) return;
            const discardRef = this.openDiscardChangesPopUp();
            discardRef?.afterClosed().subscribe((discarded) => {
                if (!discarded) return;
                localStorage.setItem('autosave', imageOpen.data);
            });
        });
    }

    openDiscardChangesPopUp(): MatDialogRef<DiscardChangesPopupComponent> | undefined {
        if (this.isPopUpOpen) return;
        const dialogRef = this.dialog.open(DiscardChangesPopupComponent);
        dialogRef.afterClosed().subscribe((discarded) => {
            if (!discarded) return;
            this.router.navigate(['/', 'editor']);
        });
        return dialogRef;
    }

    openExportPopUp(): void {
        if (this.isPopUpOpen) return;
        this.toolManager.currentTool.onToolChange();
        this.dialog.open(ExportDrawingComponent);
    }

    openNewDrawingPopUp(): void {
        if (this.isPopUpOpen) return;
        if (!this.newDrawingPossible) return;
        this.toolManager.currentTool.onToolChange();
        this.dialog.open(NewDrawingBoxComponent);
    }

    openSavePopUp(): void {
        if (this.isPopUpOpen) return;
        this.toolManager.currentTool.onToolChange();
        this.dialog.open(SaveDrawingComponent);
    }

    openToolInfoPopUp(): void {
        if (this.isPopUpOpen) return;
        this.toolManager.currentTool.onToolChange();
        this.dialog.open(ToolInfoComponent);
    }
}
