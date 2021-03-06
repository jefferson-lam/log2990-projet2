import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MainPageCarrouselComponent } from '@app/components/main-page/main-page-carrousel/main-page-carrousel.component';
import { IndexService } from '@app/services/index/index.service';
import { LocalServerService } from '@app/services/local-server/local-server.service';
import { Message } from '@common/communication/message';
import { ServerDrawing } from '@common/communication/server-drawing';
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

    constructor(private basicService: IndexService, private localServerService: LocalServerService, public dialog: MatDialog) {}

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

    sendDrawingToServer(): void {
        const drawing: ServerDrawing = { id: '123', pixels: [1, 2, 1], height: 100, width: 100 };
        this.localServerService.sendDrawing(drawing).subscribe();
    }

    openCarousel(): void {
        this.dialog.open(MainPageCarrouselComponent, {
            width: '400px;',
        });
    }
}
