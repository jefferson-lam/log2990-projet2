import { Component } from '@angular/core';
import { DrawingFormat } from '@app/classes/drawing-format';
import { DatabaseService } from '@app/services/database/database.service';

@Component({
    selector: 'app-main-page-carrousel',
    templateUrl: './main-page-carrousel.component.html',
    styleUrls: ['./main-page-carrousel.component.scss'],
})
export class MainPageCarrouselComponent {
    drawingId: string;
    tagValue: string;
    drawings: DrawingFormat[];

    constructor(private databaseService: DatabaseService) {
        this.tagValue = '';
    }

    getDrawing(): void {
        this.databaseService.getDrawings();
    }

    // getDrawingId(): void {
    //     const x = JSON.parse(this.databaseService.getDrawings());
    // }

    deleteDrawing(): void {
        this.databaseService.dropDrawing(this.drawingId);
    }
    updateDrawings(): void {
        console.log('something');
    }
}
