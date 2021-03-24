import { Component, HostListener, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MainPageCarrouselComponent } from '@app/components/main-page/main-page-carrousel/main-page-carrousel.component';
import { BehaviorSubject } from 'rxjs';

@Component({
    selector: 'app-main-page',
    templateUrl: './main-page.component.html',
    styleUrls: ['./main-page.component.scss'],
})
export class MainPageComponent implements OnInit {
    readonly title: string = 'LOG2990';
    message: BehaviorSubject<string> = new BehaviorSubject<string>('');

    oldDrawingTrue: boolean = true;
    drawingExists: boolean;

    isPopUpOpen: boolean = false;

    constructor(public dialog: MatDialog) {}

    ngOnInit(): void {
        this.dialog.afterAllClosed.subscribe(() => {
            this.isPopUpOpen = false;
        });
    }

    openCarousel(): void {
        this.dialog.open(MainPageCarrouselComponent, {
            height: '700px',
            width: '1800px',
        });
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
