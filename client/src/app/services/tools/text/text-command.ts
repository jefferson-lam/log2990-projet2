import { Command } from '@app/classes/command';
import { Vec2 } from '@app/classes/vec2';
import * as TextConstants from '@app/constants/text-constants';
import { TextService } from '@app/services/tools/text/text-service';

export class TextCommand extends Command {
    private primaryColor: string;
    private fontSize: number;
    private fontStyle: string;
    private textAlign: string;
    private fontWeight: string;
    private fontFamily: string;
    private text: string;
    private splitText: string[];
    private spanLeftPosition: number;
    private spanTopPosition: number;

    private cornerCoords: Vec2;

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
        this.fontStyle = textService.placeHolderSpan.style.fontStyle;
        this.textAlign = textService.placeHolderSpan.style.textAlign;
        this.fontWeight = textService.placeHolderSpan.style.fontWeight;
        this.fontFamily = textService.placeHolderSpan.style.fontFamily;
        this.spanLeftPosition = textService.placeHolderSpan.clientWidth;
        this.spanTopPosition = textService.placeHolderSpan.clientHeight;

        this.text = textService.placeHolderSpan.innerText;
        this.cornerCoords = Object.assign([], textService.cornerCoords);
    }

    writeText(ctx: CanvasRenderingContext2D): void {
        this.splitTextString();
        ctx.beginPath();
        ctx.font =
            this.fontStyle +
            ' ' +
            this.fontWeight +
            ' ' +
            this.fontSize +
            'px/' +
            this.fontSize * TextConstants.LINE_HEIGHT_CONVERSION +
            'px ' +
            this.fontFamily;
        ctx.fillStyle = this.primaryColor;
        ctx.textAlign = this.textAlign as CanvasTextAlign;
        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < this.splitText.length; i++) {
            this.fillTextOnCanvas(ctx, i);
        }
    }

    fillTextOnCanvas(ctx: CanvasRenderingContext2D, index: number): void {
        const textPosition = {
            x: this.cornerCoords.x + this.adjustTextAlignWidth(this.textAlign),
            y:
                this.cornerCoords.y +
                this.fontSize +
                -TextConstants.LINE_HEIGHT_CONVERSION * 2 +
                (this.spanTopPosition / (this.splitText.length / index) + 1),
        };
        ctx.fillText(this.splitText[index], textPosition.x, textPosition.y);
    }

    splitTextString(): void {
        this.splitText = this.text.split('\n');
    }

    adjustTextAlignWidth(textAlign: string): number {
        if (textAlign === 'center') return this.spanLeftPosition / 2;
        if (textAlign === 'right') return this.spanLeftPosition;
        else return 0;
    }
}
