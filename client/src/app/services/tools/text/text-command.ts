import { Command } from '@app/classes/command';
import { Vec2 } from '@app/classes/vec2';
import * as EllipseConstants from '@app/constants/ellipse-constants';
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
        this.writeText(this.ctx, this.cornerCoords);
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

    writeText(ctx: CanvasRenderingContext2D, path: Vec2[]): void {
        const textLength = ctx.measureText(this.inputFromKeyboard);
        const start = path[EllipseConstants.START_INDEX];
        ctx.beginPath();
        ctx.rect(start.x, start.y, textLength.width, this.fontSize);
        ctx.font = this.fontSize + 'px ' + this.fontStyle;
        console.log(ctx.font);
        ctx.fillStyle = this.primaryColor;
        // ctx.textAlign = this.textAlignment;
        ctx.fillText(this.inputFromKeyboard, textLength.width, this.fontSize);
    }
}
