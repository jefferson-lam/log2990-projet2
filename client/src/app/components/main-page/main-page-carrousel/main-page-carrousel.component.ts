import { Component } from '@angular/core';
import { DrawingFormat } from '@app/classes/drawing-format';
import { TagFormat } from '@app/classes/tag-format';
import { DatabaseService } from '@app/services/database/database.service';

@Component({
    selector: 'app-main-page-carrousel',
    templateUrl: './main-page-carrousel.component.html',
    styleUrls: ['./main-page-carrousel.component.scss'],
})
export class MainPageCarrouselComponent {
    newTagAdded: boolean;
    drawingId: string;
    tagValue: string = '';
    drawings: DrawingFormat[];

    tagsList: TagFormat[] = [
        {
            name: '',
        },
    ];

    constructor(private databaseService: DatabaseService) {}

    getDrawing(): void {
        this.databaseService.getDrawings();
    }

    deleteDrawing(): void {
        this.databaseService.dropDrawing(this.drawingId);
    }

    updateDrawings(): void {
        this.newTagAdded = true;
    }

    addTag(): void {
        this.tagsList.push();
    }

    updateTags(): void {
        this.newTagAdded = !this.newTagAdded;
    }

    deleteTag(index: number): void {
        this.tagsList.splice(index, 1);
    }
}
