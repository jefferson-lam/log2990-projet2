import { Command } from '@app/classes/command';
import { Vec2 } from '@app/classes/vec2';
import * as ToolConstants from '@app/constants/tool-constants';
import { RectangleService } from '@app/services/tools/rectangle/rectangle-service';

export class RectangleCommand extends Command {
    isSquare: boolean;
    lineWidth: number;
    fillMode: ToolConstants.FillMode;
    primaryColor: string;
    secondaryColor: string;
    cornerCoords: Vec2[] = [];

    constructor(canvasContext: CanvasRenderingContext2D, private rectangleService: RectangleService) {
        super(canvasContext);
        this.isSquare = rectangleService.isSquare;
        this.fillMode = rectangleService.fillMode;
        this.primaryColor = rectangleService.primaryColor;
        this.secondaryColor = rectangleService.secondaryColor;
        this.lineWidth = rectangleService.lineWidth;
        this.cornerCoords[0] = rectangleService.cornerCoords[0];
        this.cornerCoords[1] = rectangleService.cornerCoords[1];
    }

    execute(): void {
        this.rectangleService.drawRectangle(
            this.ctx,
            this.cornerCoords,
            this.isSquare,
            this.fillMode,
            this.lineWidth,
            this.primaryColor,
            this.secondaryColor,
        );
    }

    /*private drawRectangle(ctx: CanvasRenderingContext2D, path: Vec2[]): void {
        let width = path[RectangleConstants.END_INDEX].x - path[RectangleConstants.START_INDEX].x;
        let height = path[RectangleConstants.END_INDEX].y - path[RectangleConstants.START_INDEX].y;
        if (this.isSquare) {
            const longestSide = Math.min(Math.abs(width), Math.abs(height));
            width = Math.sign(width) * longestSide;
            height = Math.sign(height) * longestSide;
        }
        const borderColor: string = this.fillMode === ToolConstants.FillMode.FILL_ONLY ? this.primaryColor : this.secondaryColor;
        if (Math.abs(width) > this.lineWidth && Math.abs(height) > this.lineWidth) {
            width -= Math.sign(width) * this.lineWidth;
            height -= Math.sign(height) * this.lineWidth;
            this.drawTypeRectangle(ctx, path, width, height, this.fillMode, this.lineWidth, this.primaryColor, borderColor);
        } else {
            this.drawTypeRectangle(
                ctx,
                path,
                width,
                height,
                ToolConstants.FillMode.OUTLINE_FILL,
                RectangleConstants.MIN_BORDER_WIDTH,
                borderColor,
                borderColor,
            );
        }
    }

    private drawTypeRectangle(
        ctx: CanvasRenderingContext2D,
        path: Vec2[],
        width: number,
        height: number,
        fillMode: ToolConstants.FillMode,
        lineWidth: number,
        fillColor: string,
        borderColor: string,
    ): void {
        ctx.beginPath();
        ctx.lineJoin = 'miter';
        const startX = path[RectangleConstants.START_INDEX].x + (Math.sign(width) * lineWidth) / 2;
        const startY = path[RectangleConstants.START_INDEX].y + (Math.sign(height) * lineWidth) / 2;
        ctx.rect(startX, startY, width, height);

        ctx.strokeStyle = borderColor;
        ctx.lineWidth = lineWidth;
        ctx.stroke();
        if (fillMode !== ToolConstants.FillMode.OUTLINE) {
            ctx.fillStyle = fillColor;
            ctx.fill();
        }
    }*/
}
