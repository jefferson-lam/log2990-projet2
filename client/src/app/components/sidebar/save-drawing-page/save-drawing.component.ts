import { Component } from '@angular/core';
import { DatabaseService } from '@app/services/database/database.service';
import { Message } from '@common/communication/message';

export enum SaveProgress {
    CHOOSING_SETTING,
    SAVING,
    COMPLTETE,
    ERROR,
}
@Component({
    selector: 'app-save-drawing',
    templateUrl: './save-drawing.component.html',
    styleUrls: ['./save-drawing.component.scss'],
})
export class SaveDrawingComponent {
    resultMessage: string = '';
    saveProgressEnum: typeof SaveProgress = SaveProgress;
    saveProgress: SaveProgress = SaveProgress.CHOOSING_SETTING;
    tags: string[] = new Array();
    request: Message = { title: 'Error', body: '' };

    constructor(public database: DatabaseService) {}

    private tagIsEmpty(tag: string): boolean {
        return tag.length === 0;
    }

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

    addTag(tag: string): void {
        if (this.checkIsTagValid(tag)) {
            this.tags.push(tag);
        }
        console.log(this.tags);
    }

    deleteTag(tag: string): void {
        const index = this.tags.indexOf(tag, 0);
        if (index > -1) {
            this.tags.splice(index, 1);
        }
    }

    private isTitleValid(title: string): boolean {
        if (title === '') {
            alert('Title cannot be empty!');
            return false;
        }
        return true;
    }

    saveDrawing(title: string, tags: string[]): void {
        if (this.isTitleValid(title)) {
            this.saveProgress = SaveProgress.SAVING;
            this.database.saveDrawing(title, tags).subscribe({
                complete: () => {
                    if (this.request.title.includes('Success')) {
                        this.saveProgress = SaveProgress.COMPLTETE;
                    } else {
                        this.saveProgress = SaveProgress.ERROR;
                    }
                    this.resultMessage = this.request.body;
                },
                next: (result: Message) => {
                    if (result === undefined) {
                        this.saveProgress = SaveProgress.ERROR;
                        return;
                    }
                    this.request = result;
                },
            });
        }
    }
}
