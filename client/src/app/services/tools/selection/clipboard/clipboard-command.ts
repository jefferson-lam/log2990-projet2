import { Command } from '@app/classes/command';
import { ClipboardService } from './clipboard.service';

export class ClipboardCommand extends Command {
    constructor(public clipboardService: ClipboardService) {
        super();
    }

    setValues(): void {}

    execute(): void {}
}
