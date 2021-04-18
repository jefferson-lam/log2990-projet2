import { AfterViewInit, Component, Inject, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import * as SaveDrawingConstants from '@app/constants/save-drawing-constants';
import { DatabaseService } from '@app/services/database/database.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { LocalServerService } from '@app/services/local-server/local-server.service';
import { Message } from '@common/communication/message';
import { ServerDrawing } from '@common/communication/server-drawing';
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

    resultMessage: string;
    saveProgressEnum: typeof SaveDrawingConstants.SaveProgress;
    saveProgress: SaveDrawingConstants.SaveProgress;
    request: Message;
    isTitleValid: boolean;
    areTagsValid: boolean;
    isSavePossible: boolean;

    imageURL: string;

    constructor(
        private database: DatabaseService,
        private localServerService: LocalServerService,
        private drawingService: DrawingService,
        @Inject(MatDialogRef) private dialogRef: MatDialogRef<SaveDrawingComponent>,
    ) {
        this.resultMessage = '';
        this.saveProgressEnum = SaveDrawingConstants.SaveProgress;
        this.saveProgress = SaveDrawingConstants.SaveProgress.CHOOSING_SETTING;
        this.request = { title: 'Error', body: '' };
        this.isTitleValid = false;
        this.areTagsValid = true;
        this.isSavePossible = false;
    }

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
        this.isSavePossible = this.isTitleValid;
    }

    saveDrawing(): void {
        this.dialogRef.disableClose = true;
        this.saveProgress = SaveDrawingConstants.SaveProgress.SAVING;
        this.database.saveDrawing(this.titleInput.title, this.tagInput.tags).subscribe({
            complete: () => {
                if (this.request.title.includes('Success')) {
                    this.saveProgress = SaveDrawingConstants.SaveProgress.COMPLETE;
                } else {
                    this.saveProgress = SaveDrawingConstants.SaveProgress.ERROR;
                    this.resultMessage = this.request.body;
                }
                this.resultMessage = this.request.body;
                this.dialogRef.disableClose = false;
                this.sendDrawingToServer();
            },
            next: (result: Message) => {
                this.request = result;
            },
            error: (error: Message) => {
                this.saveProgress = SaveDrawingConstants.SaveProgress.ERROR;
                if (error.body.includes('Timeout')) {
                    this.resultMessage = 'Temps de connection au serveur a expiré.';
                }
                this.dialogRef.disableClose = false;
            },
        });
    }

    private sendDrawingToServer(): void {
        const insertedId = this.resultMessage;
        const drawing: ServerDrawing = { id: insertedId, image: this.imageURL };
        this.localServerService.sendDrawing(drawing).subscribe();
    }
}
