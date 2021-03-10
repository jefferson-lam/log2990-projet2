import { Component } from '@angular/core';
import { DatabaseService } from '@app/services/database/database.service';
import { Message } from '@common/communication/message';

@Component({
    selector: 'app-save-drawing',
    templateUrl: './save-drawing.component.html',
    styleUrls: ['./save-drawing.component.scss'],
})
export class SaveDrawingComponent {
    tags: string[] = new Array();
    request: Message = { title: 'Error', body: '' };
    constructor(public database: DatabaseService) {}

    tagIsEmpty(tag: string): boolean {
        return tag.length === 0;
    }

    checkIsTagValid(tag: string): boolean {
        // TODO: Add check for tag
        if (this.tags.includes(tag)) {
            return false;
        }
        if (this.tagIsEmpty(tag)) {
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

    saveDrawing(title: string, tags: string[]): void {
        this.database.saveDrawing(title, tags).subscribe({
            complete: () => {
                console.log('complete');
            },
            next: (result: Message) => {
                console.log('next');
                this.request = result;
            },
        });
    }
}
