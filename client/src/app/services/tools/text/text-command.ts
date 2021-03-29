import { Command } from '@app/classes/command';
import { Vec2 } from '@app/classes/vec2';
import { TextService } from '@app/services/tools/text/text-service';

export class TextCommand extends Command {
    primaryColor: string;
    fontSize: number;
    fontStyle: string;
    textAlignment: string;
    textBold: boolean;
    textItalic: boolean;
    inputFromKeyboard: string;
    cornerCoords: Vec2[] = [];

    constructor(canvasContext: CanvasRenderingContext2D, textService: TextService) {
        super();
        this.setValues(canvasContext, textService);
    }

    execute(): void {
        this.writeText(this.ctx);
    }

    setValues(canvasContext: CanvasRenderingContext2D, textService: TextService): void {
        this.ctx = canvasContext;
        this.primaryColor = textService.primaryColor;
        this.fontSize = textService.fontSize;
        this.fontStyle = textService.fontStyle;
        this.textAlignment = textService.textAlignment;
        this.textBold = textService.textBold;
        this.textItalic = textService.textItalic;
        this.inputFromKeyboard = textService.inputFromKeyboard;
        Object.assign(this.cornerCoords, textService.cornerCoords);
    }

    writeText(ctx: CanvasRenderingContext2D): void {
        ctx.font = this.fontSize + 'px' + this.fontStyle;
        ctx.fillStyle = this.primaryColor;
        // ctx.textAlign = this.textAlignment;
        ctx.fillText(this.inputFromKeyboard, 20, 30);
    }
}
