import { AfterViewInit, Component, Inject, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import * as SaveDrawingConstants from '@app/constants/save-drawing-constants';
import { DatabaseService } from '@app/services/database/database.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { LocalServerService } from '@app/services/local-server/local-server.service';
import { Message } from '@common/communication/message';
import { ServerDrawing } from '@common/communication/server-drawing';
import * as ServerConstants from '@common/validation/server-constants';
import { timeout } from 'rxjs/operators';
import { TagInputComponent } from './tag-input/tag-input.component';
import { TitleInputComponent } from './title-input/title-input.component';
@Component({
    selector: 'app-save-drawing',
    templateUrl: './save-drawing.component.html',
    styleUrls: ['./save-drawing.component.scss'],
})
export class SaveDrawingComponent implements AfterViewInit {
    @ViewChild('tagInput') private tagInput: TagInputComponent;
    @ViewChild('titleInput') private titleInput: TitleInputComponent;

    resultMessage: string = '';
    saveProgressEnum: typeof SaveDrawingConstants.SaveProgress = SaveDrawingConstants.SaveProgress;
    saveProgress: SaveDrawingConstants.SaveProgress = SaveDrawingConstants.SaveProgress.CHOOSING_SETTING;
    request: Message = { title: 'Error', body: '' };
    isTitleValid: boolean = false;
    areTagsValid: boolean = true;
    isSavePossible: boolean = false;

    imageURL: string;

    constructor(
        private database: DatabaseService,
        private localServerService: LocalServerService,
        private drawingService: DrawingService,
        @Inject(MatDialogRef) private dialogRef: MatDialogRef<SaveDrawingComponent>,
    ) {}

    ngAfterViewInit(): void {
        this.imageURL = this.drawingService.canvas.toDataURL();
    }

    verifyTitleValid(isTitleValid: boolean): void {
        this.isTitleValid = isTitleValid;
        this.verifySavePossible();
    }

    verifyTagsValid(areTagsValid: boolean): void {
        this.areTagsValid = areTagsValid;
        this.verifySavePossible();
    }

    private verifySavePossible(): void {
        this.isSavePossible = this.isTitleValid && this.areTagsValid;
    }

    saveDrawing(): void {
        this.dialogRef.disableClose = true;
        this.saveProgress = SaveDrawingConstants.SaveProgress.SAVING;
        this.database
            .saveDrawing(this.titleInput.title, this.tagInput.tags)
            .pipe(timeout(SaveDrawingConstants.TIMEOUT_MAX_TIME))
            .subscribe({
                complete: () => {
                    if (this.request.title.includes('Success')) {
                        this.saveProgress = SaveDrawingConstants.SaveProgress.COMPLETE;
                    } else {
                        this.saveProgress = SaveDrawingConstants.SaveProgress.ERROR;
                        this.resultMessage = this.request.body;
                    }
                    this.sendDrawingToServer();
                },
                next: (result: Message) => {
                    this.request = result;
                },
                error: (error: Error) => {
                    this.saveProgress = SaveDrawingConstants.SaveProgress.ERROR;
                    if (error.message.includes('Timeout')) {
                        this.resultMessage = 'Temps de connection au serveur a expiré.';
                    }
                    this.dialogRef.disableClose = false;
                },
            });
    }

    private sendDrawingToServer(): void {
        this.resultMessage = this.request.body;
        this.dialogRef.disableClose = false;
        const insertedId = this.resultMessage.slice(ServerConstants.ID_MESSAGE_SLICE);
        const drawing: ServerDrawing = { id: insertedId, image: this.imageURL };
        this.localServerService.sendDrawing(drawing).subscribe();
    }
}
