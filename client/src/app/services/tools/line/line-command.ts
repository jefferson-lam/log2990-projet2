import { Command } from '@app/classes/command';
import { Vec2 } from '@app/classes/vec2';
import * as LineConstants from '@app/constants/line-constants';
import { LineService } from './line-service';

export class LineCommand extends Command {
    withJunction: boolean;
    junctionRadius: number;
    lineWidth: number;
    primaryColor: string;
    path: Vec2[] = [];
    isPreview: boolean;

    constructor(canvasContext: CanvasRenderingContext2D, lineService: LineService) {
        super();
        this.isPreview = false;
        this.ctx = canvasContext;

        this.path = Object.assign([], lineService.linePathData);

        this.withJunction = lineService.withJunction;
        this.junctionRadius = lineService.junctionRadius;
        this.lineWidth = lineService.lineWidth;
        this.primaryColor = lineService.primaryColor;
    }

    setValues(canvasContext: CanvasRenderingContext2D, lineService: LineService): void {
        this.isPreview = true;
        this.ctx = canvasContext;

        this.path = [];
        this.path = Object.assign([], lineService.linePathData);

        this.withJunction = lineService.withJunction;
        this.junctionRadius = lineService.junctionRadius;
        this.lineWidth = lineService.lineWidth;
        this.primaryColor = lineService.primaryColor;
    }

    execute(): void {
        this.drawLine(this.ctx, this.path);
    }

    private drawLine(ctx: CanvasRenderingContext2D, path: Vec2[]): void {
        if (this.isPreview) {
            this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        }
        ctx.beginPath();
        ctx.lineWidth = this.lineWidth;
        ctx.strokeStyle = this.primaryColor;
        for (const point of path) {
            if (this.withJunction) {
                ctx.arc(point.x, point.y, this.junctionRadius, LineConstants.DEGREES_0, LineConstants.DEGREES_360);
                ctx.fillStyle = this.primaryColor;
                ctx.fill();
            }
            ctx.moveTo(point.x, point.y);
            ctx.lineTo(point.x, point.y);
        }
        ctx.stroke();
    }
}
