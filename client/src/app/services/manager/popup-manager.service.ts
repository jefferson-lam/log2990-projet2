import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DiscardChangesPopupComponent } from '@app/components/main-page/discard-changes-popup/discard-changes-popup.component';
import { MainPageCarrouselComponent } from '@app/components/main-page/main-page-carrousel/main-page-carrousel.component';
import { ExportDrawingComponent } from '@app/components/sidebar/export-drawing/export-drawing.component';
import { NewDrawingBoxComponent } from '@app/components/sidebar/new-drawing-box/new-drawing-box.component';
import { SaveDrawingComponent } from '@app/components/sidebar/save-drawing-page/save-drawing.component';
import { WHITE_RGBA_DECIMAL } from '@app/constants/color-constants';
import { MAX_HEIGHT_FORM, MAX_WIDTH_FORM } from '@app/constants/popup-constants';
import { ToolManagerService } from '@app/services/manager/tool-manager-service';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';

@Injectable({
    providedIn: 'root',
})
export class PopupManagerService {
    isPopUpOpen: boolean;

    constructor(public dialog: MatDialog, public undoRedoService: UndoRedoService, public toolManager: ToolManagerService, public router: Router) {
        this.isPopUpOpen = false;
        this.dialog.afterAllClosed.subscribe(() => {
            this.isPopUpOpen = false;
        });
        this.dialog.afterOpened.subscribe(() => {
            this.isPopUpOpen = true;
        });
    }

    openCarouselPopUp(): void {
        if (!this.isPopUpOpen) {
            const dialogRef = this.dialog.open(MainPageCarrouselComponent, {
                height: '700px',
                width: '1800px',
            });
            dialogRef.afterClosed().subscribe((imageOpen) => {
                if (imageOpen.autosave) {
                    const discardRef = this.openDiscardChangesPopUp();
                    discardRef?.afterClosed().subscribe((discarded) => {
                        if (discarded) {
                            localStorage.setItem('autosave', imageOpen.data);
                        }
                    });
                }
            });
        }
    }

    openDiscardChangesPopUp(): MatDialogRef<DiscardChangesPopupComponent> | undefined {
        if (!this.isPopUpOpen) {
            const dialogRef = this.dialog.open(DiscardChangesPopupComponent);
            dialogRef.afterClosed().subscribe((discarded) => {
                if (discarded) {
                    this.router.navigate(['/', 'editor']);
                }
            });
            return dialogRef;
        }
        return;
    }

    openExportPopUp(): void {
        if (!this.isPopUpOpen) {
            this.toolManager.currentTool.onToolChange();
            this.dialog.open(ExportDrawingComponent, {
                maxWidth: MAX_WIDTH_FORM + 'px',
                maxHeight: MAX_HEIGHT_FORM + 'px',
            });
        }
    }

    openNewDrawingPopUp(): void {
        if (!this.undoRedoService.isUndoPileEmpty() && !this.isPopUpOpen) {
            this.toolManager.currentTool.onToolChange();
            this.dialog.open(NewDrawingBoxComponent);
        }
    }

    openSavePopUp(): void {
        if (!this.isCanvasEmpty() && !this.isPopUpOpen) {
            this.toolManager.currentTool.onToolChange();
            this.dialog.open(SaveDrawingComponent);
        }
    }

    isCanvasEmpty(): boolean {
        // Thanks to user Kaiido on stackoverflow.com
        // https://stackoverflow.com/questions/17386707/how-to-check-if-a-canvas-is-blank/17386803#comment96825186_17386803
        const canvas = document.getElementById('canvas') as HTMLCanvasElement;
        const baseCtx: CanvasRenderingContext2D = canvas.getContext('2d') as CanvasRenderingContext2D;
        const pixelBuffer = new Uint32Array(baseCtx.getImageData(0, 0, canvas.width, canvas.height).data.buffer);
        return !pixelBuffer.some((color) => color !== WHITE_RGBA_DECIMAL);
    }
}
