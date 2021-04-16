import { Command } from '@app/classes/command';
import { Vec2 } from '@app/classes/vec2';
import { ClipboardService } from '@app/services/tools/selection/clipboard/clipboard.service';

export class LassoClipboardCommand extends Command {
    pathData: Vec2[];

    constructor(canvasContext: CanvasRenderingContext2D, clipboardService: ClipboardService) {
        super();
        this.setValues(canvasContext, clipboardService);
    }

    setValues(canvasContext: CanvasRenderingContext2D, clipboardService: ClipboardService): void {
        this.ctx = canvasContext;
        this.pathData = Object.assign([], clipboardService.pathData);
    }

    execute(): void {
        this.fillLasso(this.ctx, this.pathData, 'white');
    }

    private fillLasso(ctx: CanvasRenderingContext2D, pathData: Vec2[], color: string): void {
        ctx.beginPath();
        ctx.moveTo(pathData[0].x, pathData[0].y);
        for (const point of pathData) {
            ctx.lineTo(point.x, point.y);
        }
        ctx.save();
        ctx.clip();
        ctx.fillStyle = color;
        ctx.fill();
        ctx.restore();
    }
}
