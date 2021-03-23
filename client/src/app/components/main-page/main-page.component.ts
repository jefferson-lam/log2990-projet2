import { Component, HostListener } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MainPageCarrouselComponent } from '@app/components/main-page/main-page-carrousel/main-page-carrousel.component';
import { IndexService } from '@app/services/index/index.service';
import { Message } from '@common/communication/message';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
    selector: 'app-main-page',
    templateUrl: './main-page.component.html',
    styleUrls: ['./main-page.component.scss'],
})
export class MainPageComponent {
    readonly title: string = 'LOG2990';
    message: BehaviorSubject<string> = new BehaviorSubject<string>('');

    oldDrawingTrue: boolean = true;
    drawingExists: boolean;

    constructor(private basicService: IndexService, public dialog: MatDialog) {}

    sendTimeToServer(): void {
        const newTimeMessage: Message = {
            title: 'Hello from the client',
            body: 'Time is : ' + new Date().toString(),
        };
        // Important de ne pas oublier "subscribe" ou l'appel ne sera jamais lancé puisque personne l'observe
        this.basicService.basicPost(newTimeMessage).subscribe();
    }

    getMessagesFromServer(): void {
        this.basicService
            .basicGet()
            // Cette étape transforme le Message en un seul string
            .pipe(
                map((message: Message) => {
                    return `${message.title} ${message.body}`;
                }),
            )
            .subscribe(this.message);
    }

    openCarousel(): void {
        this.dialog.open(MainPageCarrouselComponent, {
            height: '700px',
            width: '1800px',
        });
    }

    @HostListener('window:keydown.control.g', ['$event'])
    onCtrlShiftGKeyDown(event: KeyboardEvent): void {
        event.preventDefault();
        this.openCarousel();
    }
}
