import { Component } from '@angular/core';
import * as SaveDrawingConstants from '@app/constants/save-drawing-constants';
import { DatabaseService } from '@app/services/database/database.service';
import { Message } from '@common/communication/message';
import { timeout } from 'rxjs/operators';
@Component({
    selector: 'app-save-drawing',
    templateUrl: './save-drawing.component.html',
    styleUrls: ['./save-drawing.component.scss'],
})
export class SaveDrawingComponent {
    resultMessage: string = '';
    saveProgressEnum: typeof SaveDrawingConstants.SaveProgress = SaveDrawingConstants.SaveProgress;
    saveProgress: SaveDrawingConstants.SaveProgress = SaveDrawingConstants.SaveProgress.CHOOSING_SETTING;
    tags: string[] = new Array();
    request: Message = { title: 'Error', body: '' };

    constructor(public database: DatabaseService) {}

    addTag(tag: string): void {
        if (this.checkIsTagValid(tag)) {
            this.tags.push(tag);
        }
    }

    deleteTag(tag: string): void {
        const index = this.tags.indexOf(tag, 0);
        if (index > SaveDrawingConstants.TAG_NOT_FOUND) {
            this.tags.splice(index, 1);
        }
    }

    saveDrawing(title: string, tags: string[]): void {
        if (this.isTitleValid(title)) {
            this.saveProgress = SaveDrawingConstants.SaveProgress.SAVING;
            this.database
                .saveDrawing(title, tags)
                .pipe(timeout(SaveDrawingConstants.TIMEOUT_MAX_TIME))
                .subscribe({
                    complete: () => {
                        if (this.request.title.includes('Success')) {
                            this.saveProgress = SaveDrawingConstants.SaveProgress.COMPLETE;
                        } else {
                            this.saveProgress = SaveDrawingConstants.SaveProgress.ERROR;
                            this.resultMessage = this.request.body;
                        }
                        this.resultMessage = this.request.body;
                    },
                    next: (result: Message) => {
                        this.request = result;
                    },
                    error: (error: Error) => {
                        this.saveProgress = SaveDrawingConstants.SaveProgress.ERROR;
                        if (error.message.includes('Timeout')) {
                            this.resultMessage = 'Temps de connection au serveur a expiré.';
                        }
                    },
                });
        }
    }

    private tagIsEmpty(tag: string): boolean {
        return tag.length === 0;
    }

    // Tag not empty
    // Not more than 30 tags
    // Each tag not more than 20 chars
    // Only ascii chars
    private checkIsTagValid(tag: string): boolean {
        // TODO: Add check for tag
        if (this.tags.includes(tag)) {
            alert('You cannot put that tag in again!');
            return false;
        }
        if (this.tagIsEmpty(tag)) {
            alert('Tag cannot be empty!');
            return false;
        }
        return true;
    }

    // Title empty
    // Title ascii
    // Title max length 20 chars
    private isTitleValid(title: string): boolean {
        if (title === '') {
            alert('Title cannot be empty!');
            return false;
        }
        return true;
    }
}
