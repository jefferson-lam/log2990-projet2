import { Command } from '@app/classes/command';
import { Vec2 } from '@app/classes/vec2';
import { PencilService } from '@app/services/tools/pencil/pencil-service';

export class PencilCommand extends Command {
    private lineWidth: number;
    private primaryColor: string;
    private path: Vec2[];

    constructor(canvasContext: CanvasRenderingContext2D, pencilService: PencilService) {
        super();
        this.setValues(canvasContext, pencilService);
    }

    setValues(canvasContext: CanvasRenderingContext2D, pencilService: PencilService): void {
        this.ctx = canvasContext;
        this.path = Object.assign([], pencilService.pathData);
        this.lineWidth = pencilService.lineWidth;
        this.primaryColor = pencilService.primaryColor;
    }

    execute(): void {
        this.drawLine(this.ctx, this.path);
    }

    private drawLine(ctx: CanvasRenderingContext2D, path: Vec2[]): void {
        ctx.beginPath();

        ctx.lineWidth = this.lineWidth;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        for (const point of path) {
            ctx.lineTo(point.x, point.y);
        }
        ctx.strokeStyle = this.primaryColor;
        ctx.stroke();
    }
}
