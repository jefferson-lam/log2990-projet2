import { Command } from '@app/classes/command';
import { Vec2 } from '@app/classes/vec2';
import * as RectangleConstants from '@app/constants/rectangle-constants';
import * as ToolConstants from '@app/constants/tool-constants';
import { RectangleService } from '@app/services/tools/rectangle/rectangle-service';

export class RectangleCommand extends Command {
    isSquare: boolean;
    lineWidth: number;
    fillMode: ToolConstants.FillMode;
    primaryColor: string;
    secondaryColor: string;
    cornerCoords: Vec2[] = [];
    width: number;
    height: number;
    fillColor: string;
    borderColor: string;

    constructor(canvasContext: CanvasRenderingContext2D, rectangleService: RectangleService) {
        super();
        this.setValues(canvasContext, rectangleService);
    }

    setValues(canvasContext: CanvasRenderingContext2D, rectangleService: RectangleService): void {
        this.ctx = canvasContext;
        this.isSquare = rectangleService.isSquare;
        this.fillMode = rectangleService.fillMode;
        this.primaryColor = rectangleService.primaryColor;
        this.secondaryColor = rectangleService.secondaryColor;
        this.lineWidth = rectangleService.lineWidth;
        this.cornerCoords = Object.assign([], rectangleService.cornerCoords);
    }

    execute(): void {
        this.drawRectangle(this.ctx, this.cornerCoords);
    }

    private drawRectangle(ctx: CanvasRenderingContext2D, path: Vec2[]): void {
        this.width = path[RectangleConstants.END_INDEX].x - path[RectangleConstants.START_INDEX].x;
        this.height = path[RectangleConstants.END_INDEX].y - path[RectangleConstants.START_INDEX].y;
        if (this.isSquare) {
            const shortestSide = Math.min(Math.abs(this.width), Math.abs(this.height));
            this.width = Math.sign(this.width) * shortestSide;
            this.height = Math.sign(this.height) * shortestSide;
        }
        this.borderColor = this.fillMode === ToolConstants.FillMode.FILL_ONLY ? this.primaryColor : this.secondaryColor;
        if (Math.abs(this.width) > this.lineWidth && Math.abs(this.height) > this.lineWidth) {
            this.width -= Math.sign(this.width) * this.lineWidth;
            this.height -= Math.sign(this.height) * this.lineWidth;
            this.fillColor = this.primaryColor;
            this.drawTypeRectangle(ctx, path);
        } else {
            this.fillMode = ToolConstants.FillMode.OUTLINE_FILL;
            this.lineWidth = RectangleConstants.MIN_BORDER_WIDTH;
            this.drawTypeRectangle(ctx, path);
        }
    }

    private drawTypeRectangle(ctx: CanvasRenderingContext2D, path: Vec2[]): void {
        ctx.beginPath();
        ctx.lineJoin = 'miter';
        const startX = path[RectangleConstants.START_INDEX].x + (Math.sign(this.width) * this.lineWidth) / 2;
        const startY = path[RectangleConstants.START_INDEX].y + (Math.sign(this.height) * this.lineWidth) / 2;
        ctx.rect(startX, startY, this.width, this.height);

        ctx.strokeStyle = this.borderColor;
        ctx.lineWidth = this.lineWidth;
        ctx.stroke();
        if (this.fillMode !== ToolConstants.FillMode.OUTLINE) {
            ctx.fillStyle = this.fillColor;
            ctx.fill();
        }
    }
}
