import { Component, HostListener, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DiscardChangesPopupComponent } from '@app/components/main-page/discard-changes-popup/discard-changes-popup.component';
import { MainPageCarrouselComponent } from '@app/components/main-page/main-page-carrousel/main-page-carrousel.component';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';
import { BehaviorSubject } from 'rxjs';

@Component({
    selector: 'app-main-page',
    templateUrl: './main-page.component.html',
    styleUrls: ['./main-page.component.scss'],
})
export class MainPageComponent implements OnInit {
    readonly title: string = 'LOG2990';
    message: BehaviorSubject<string> = new BehaviorSubject<string>('');

    ongoingDrawing: boolean;

    isPopUpOpen: boolean = false;

    constructor(public dialog: MatDialog, public router: Router, public drawingService: DrawingService, public undoRedoService: UndoRedoService) {}

    ngOnInit(): void {
        this.ongoingDrawing = false;
        if (localStorage.getItem('autosave')) {
            this.ongoingDrawing = true;
        }
        this.dialog.afterAllClosed.subscribe(() => {
            this.isPopUpOpen = false;
        });
    }

    newDrawing(): void {
        if (localStorage.getItem('autosave')) {
            const dialogRef = this.dialog.open(DiscardChangesPopupComponent);
            dialogRef.afterClosed().subscribe((discarded) => {
                if (discarded) {
                    this.undoRedoService.reset();
                    localStorage.removeItem('autosave');
                    localStorage.removeItem('initialDrawing');
                    this.router.navigate(['/', 'editor']);
                }
            });
        } else {
            this.undoRedoService.reset();
            this.router.navigate(['/', 'editor']);
            localStorage.removeItem('initialDrawing');
        }
    }

    openCarousel(): void {
        this.dialog.open(MainPageCarrouselComponent, {
            height: '700px',
            width: '1800px',
        });
    }

    continueDrawing(): void {
        localStorage.setItem('initialDrawing', localStorage.getItem('autosave') as string);
        this.router.navigate(['/', 'editor']);
    }

    @HostListener('window:keydown.control.g', ['$event'])
    onCtrlGKeyDown(event: KeyboardEvent): void {
        event.preventDefault();
        if (!this.isPopUpOpen) {
            this.openCarousel();
            this.isPopUpOpen = true;
        }
    }
}
