import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { EraserService } from '@app/services/tools/eraser-service';
import { LineService } from '@app/services/tools/line-service';
import { PencilService } from '@app/services/tools/pencil-service';

@Injectable({
    providedIn: 'root',
})
export class ToolManagerService {
    constructor(public pencilService: PencilService, public eraserService: EraserService, public lineService: LineService) {}

    selectTool(event: KeyboardEvent): Tool {
        console.log('Changing tool in tool manager...');
        switch (event.key) {
            case 'c':
                return this.pencilService;
            case 'e':
                return this.eraserService;
            case 'l':
                return this.lineService;
            default:
                return this.pencilService;
        }
    }
}
