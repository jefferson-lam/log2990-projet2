import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { LineService } from '@app/services/tools/line-service';
import { PencilService } from '@app/services/tools/pencil-service';

@Injectable({
    providedIn: 'root',
})
export class ToolManagerService {
    constructor(public pencilService: PencilService, public lineService: LineService) {}

    selectTool(event: KeyboardEvent): Tool {
        console.log('Changing tool in tool manager...');
        switch (event.key) {
            case 'c':
                return this.pencilService;
            case 'l':
                return this.lineService;
            default:
                return this.pencilService;
        }
    }
}
