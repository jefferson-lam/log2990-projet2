import { Injectable } from '@angular/core';
import { Command } from '@app/classes/command';

@Injectable({
    providedIn: 'root',
})
export class ToolSelectionCommandService extends Command {
    constructor() {
        super();
    }
    execute() {}
}
