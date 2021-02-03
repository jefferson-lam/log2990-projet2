import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { PencilService } from '@app/services/tools/pencil-service';

@Injectable({
    providedIn: 'root',
})
export class ToolManagerService {
    constructor(public pencilService: PencilService) {}

    //Method that will pick tool according to what user presses on keyboard
    selectTool(event: KeyboardEvent): Tool {
        switch (event.key) {
            case 'c':
                return this.pencilService;
            default:
                return this.pencilService;
        }
    }
}
