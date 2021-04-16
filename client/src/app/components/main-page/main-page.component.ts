import { Component, HostListener, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DiscardChangesPopupComponent } from '@app/components/main-page/discard-changes-popup/discard-changes-popup.component';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { PopupManagerService } from '@app/services/manager/popup-manager.service';
import { ShortcutManagerService } from '@app/services/manager/shortcut-manager.service';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';
import { BehaviorSubject } from 'rxjs';

@Component({
    selector: 'app-main-page',
    templateUrl: './main-page.component.html',
    styleUrls: ['./main-page.component.scss'],
})
export class MainPageComponent implements OnInit {
    readonly title: string;
    message: BehaviorSubject<string>;
    ongoingDrawing: boolean;

    constructor(
        public dialog: MatDialog,
        public router: Router,
        public drawingService: DrawingService,
        public undoRedoService: UndoRedoService,
        public popupManager: PopupManagerService,
        public shortcutManager: ShortcutManagerService,
    ) {
        this.title = 'LOG2990';
        this.message = new BehaviorSubject<string>('');
    }

    ngOnInit(): void {
        this.ongoingDrawing = false;
        if (localStorage.getItem('autosave')) {
            this.ongoingDrawing = true;
        }
    }

    newDrawing(): void {
        if (localStorage.getItem('autosave')) {
            const dialogRef = this.popupManager.openDiscardChangesPopUp() as MatDialogRef<DiscardChangesPopupComponent>;
            dialogRef.afterClosed().subscribe((discarded) => {
                if (discarded) {
                    this.undoRedoService.reset();
                    localStorage.removeItem('autosave');
                    this.router.navigate(['/', 'editor']);
                }
            });
        } else {
            this.undoRedoService.reset();
            this.router.navigate(['/', 'editor']);
        }
    }

    continueDrawing(): void {
        this.router.navigate(['/', 'editor']);
    }

    @HostListener('window:keydown.control.g', ['$event'])
    onCtrlGKeyDown(event: KeyboardEvent): void {
        this.shortcutManager.onCtrlGKeyDown(event);
    }
}
