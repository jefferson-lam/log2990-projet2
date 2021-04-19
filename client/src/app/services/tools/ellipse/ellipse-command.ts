import { Command } from '@app/classes/command';
import { Vec2 } from '@app/classes/vec2';
import * as EllipseConstants from '@app/constants/ellipse-constants';
import * as ShapeConstants from '@app/constants/shapes-constants';
import * as ToolConstants from '@app/constants/tool-constants';
import { EllipseService } from '@app/services/tools/ellipse/ellipse-service';

export class EllipseCommand extends Command {
    isCircle: boolean;
    lineWidth: number;
    fillMode: ToolConstants.FillMode;
    primaryColor: string;
    secondaryColor: string;
    cornerCoords: Vec2[];

    constructor(canvasContext: CanvasRenderingContext2D, ellipseService: EllipseService) {
        super();
        this.cornerCoords = [];
        this.setValues(canvasContext, ellipseService);
    }

    execute(): void {
        this.drawEllipse(this.ctx, this.cornerCoords);
    }

    setValues(canvasContext: CanvasRenderingContext2D, ellipseService: EllipseService): void {
        this.ctx = canvasContext;
        this.isCircle = ellipseService.isCircle;
        this.fillMode = ellipseService.fillMode;
        this.primaryColor = ellipseService.primaryColor;
        this.secondaryColor = ellipseService.secondaryColor;
        this.lineWidth = ellipseService.lineWidth;
        Object.assign(this.cornerCoords, ellipseService.cornerCoords);
    }

    private drawEllipse(ctx: CanvasRenderingContext2D, path: Vec2[]): void {
        const ellipseCenter = this.getEllipseCenter(path[ShapeConstants.START_INDEX], path[ShapeConstants.END_INDEX], this.isCircle);
        const startX = ellipseCenter.x;
        const startY = ellipseCenter.y;

        const radiiXAndY = this.getRadiiXAndY(path);
        let xRadius = radiiXAndY[ShapeConstants.X_INDEX];
        let yRadius = radiiXAndY[ShapeConstants.Y_INDEX];
        const borderColor: string = this.fillMode === ToolConstants.FillMode.FILL_ONLY ? this.primaryColor : this.secondaryColor;
        if (xRadius > this.lineWidth / 2 && yRadius > this.lineWidth / 2) {
            xRadius -= this.lineWidth / 2;
            yRadius -= this.lineWidth / 2;
            this.drawTypeEllipse(ctx, startX, startY, xRadius, yRadius, this.fillMode, this.primaryColor, borderColor, this.lineWidth);
        } else {
            this.drawTypeEllipse(
                ctx,
                startX,
                startY,
                xRadius,
                yRadius,
                ToolConstants.FillMode.OUTLINE_FILL,
                borderColor,
                borderColor,
                EllipseConstants.HIDDEN_BORDER_WIDTH,
            );
        }
    }

    private getEllipseCenter(start: Vec2, end: Vec2, isCircle: boolean): Vec2 {
        let displacementX: number;
        let displacementY: number;
        const radiusX = Math.abs(end.x - start.x) / 2;
        const radiusY = Math.abs(end.y - start.y) / 2;
        if (isCircle) {
            const shortestSide = Math.min(radiusX, radiusY);
            displacementX = displacementY = shortestSide;
        } else {
            displacementX = radiusX;
            displacementY = radiusY;
        }
        const xVector = end.x - start.x;
        const yVector = end.y - start.y;
        const centerX = start.x + Math.sign(xVector) * displacementX;
        const centerY = start.y + Math.sign(yVector) * displacementY;
        return { x: centerX, y: centerY };
    }

    private drawTypeEllipse(
        ctx: CanvasRenderingContext2D,
        startX: number,
        startY: number,
        xRadius: number,
        yRadius: number,
        fillMethod: number,
        primaryColor: string,
        secondaryColor: string,
        lineWidth: number,
    ): void {
        ctx.beginPath();
        ctx.setLineDash([]);
        ctx.lineJoin = 'round';
        ctx.ellipse(startX, startY, xRadius, yRadius, EllipseConstants.ROTATION, ShapeConstants.START_ANGLE, ShapeConstants.END_ANGLE);

        ctx.strokeStyle = secondaryColor;
        ctx.lineWidth = lineWidth;
        ctx.stroke();
        if (fillMethod !== ToolConstants.FillMode.OUTLINE) {
            ctx.fillStyle = primaryColor;
            ctx.beginPath();
            ctx.ellipse(
                startX,
                startY,
                xRadius - this.lineWidth / 2,
                yRadius - this.lineWidth / 2,
                EllipseConstants.ROTATION,
                ShapeConstants.START_ANGLE,
                ShapeConstants.END_ANGLE,
            );
            ctx.fill();
        }
    }

    private getRadiiXAndY(path: Vec2[]): number[] {
        let xRadius = Math.abs(path[ShapeConstants.END_INDEX].x - path[ShapeConstants.START_INDEX].x) / 2;
        let yRadius = Math.abs(path[ShapeConstants.END_INDEX].y - path[ShapeConstants.START_INDEX].y) / 2;

        if (this.isCircle) {
            const shortestSide = Math.min(Math.abs(xRadius), Math.abs(yRadius));
            xRadius = yRadius = shortestSide;
        }
        return [xRadius, yRadius];
    }
}
