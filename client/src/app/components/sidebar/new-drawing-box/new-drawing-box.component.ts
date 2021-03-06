import { Component } from '@angular/core';
import { AutoSaveService } from '@app/services/auto-save/auto-save.service';

@Component({
    selector: 'app-new-drawing-box',
    templateUrl: './new-drawing-box.component.html',
    styleUrls: ['./new-drawing-box.component.scss'],
})
export class NewDrawingBoxComponent {
    constructor(private autoSaveService: AutoSaveService) {}

    newDrawing(): void {
        localStorage.removeItem('autosave');
        this.autoSaveService.loadDrawing();
    }
}
