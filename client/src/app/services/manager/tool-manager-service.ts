import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { EraserService } from '@app/services/tools/eraser-service';
import { PencilService } from '@app/services/tools/pencil-service';
import { RectangleService } from '@app/services/tools/rectangle-service';

@Injectable({
    providedIn: 'root',
})
export class ToolManagerService {
    constructor(public pencilService: PencilService, public eraserService: EraserService, public rectangleService: RectangleService) {}

    // Method that will pick tool according to what user presses on keyboard
    selectTool(event: KeyboardEvent): Tool {
        switch (event.key) {
            case '1':
                return this.rectangleService;
            case 'c':
                return this.pencilService;
            case 'e':
                return this.eraserService;
            default:
                return this.pencilService;
        }
    }
}
