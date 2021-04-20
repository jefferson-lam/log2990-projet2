import { AfterViewInit, Component, Inject, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { SaveProgress } from '@app/constants/save-drawing-constants';
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
    saveProgressEnum: typeof SaveProgress;
    saveProgress: SaveProgress;
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
        this.saveProgressEnum = SaveProgress;
        this.saveProgress = SaveProgress.CHOOSING_SETTING;
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
        this.saveProgress = SaveProgress.SAVING;
        this.database.saveDrawing(this.titleInput.title, this.tagInput.tags).subscribe({
            complete: () => {
                this.handleComplete();
                this.sendDrawingToServer();
            },
            next: (result: Message) => {
                this.request = result;
            },
            error: (error: Message) => {
                this.handleError(error);
            },
        });
    }

    private sendDrawingToServer(): void {
        const drawing: ServerDrawing = { id: this.resultMessage, image: this.imageURL };
        this.localServerService.sendDrawing(drawing).subscribe();
    }

    private handleComplete(): void {
        this.saveProgress = this.request.title.includes('Success') ? SaveProgress.COMPLETE : SaveProgress.ERROR;
        this.resultMessage = this.request.body;
        this.dialogRef.disableClose = false;
    }

    private handleError(error: Message): void {
        this.saveProgress = SaveProgress.ERROR;
        this.resultMessage = error.body.includes('Timeout') ? 'Temps de connection au serveur a expiré.' : 'Erreur!';
        this.dialogRef.disableClose = false;
    }
}
