import { Command } from '@app/classes/command';
import { Vec2 } from '@app/classes/vec2';
import * as EllipseConstants from '@app/constants/ellipse-constants';
import * as ToolConstants from '@app/constants/tool-constants';
import { EllipseService } from '@app/services/tools/ellipse/ellipse-service';

export class EllipseCommand extends Command {
    isCircle: boolean;
    lineWidth: number;
    fillMode: ToolConstants.FillMode;
    primaryColor: string;
    secondaryColor: string;
    cornerCoords: Vec2[] = [];
    centerX: number;
    centerY: number;
    xRadius: number;
    yRadius: number;
    borderColor: string;

    constructor(canvasContext: CanvasRenderingContext2D, ellipseService: EllipseService) {
        super();
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
        this.getEllipseCenter(path[EllipseConstants.START_INDEX], path[EllipseConstants.END_INDEX], this.isCircle);
        this.getRadiiXAndY(path);

        this.borderColor = this.fillMode === ToolConstants.FillMode.FILL_ONLY ? this.primaryColor : this.secondaryColor;
        if (this.xRadius > this.lineWidth / 2 && this.yRadius > this.lineWidth / 2) {
            this.xRadius -= this.lineWidth / 2;
            this.yRadius -= this.lineWidth / 2;
            this.drawTypeEllipse(ctx);
        } else {
            this.lineWidth = EllipseConstants.HIDDEN_BORDER_WIDTH;
            this.fillMode = ToolConstants.FillMode.OUTLINE_FILL;
            this.primaryColor = this.borderColor;
            this.drawTypeEllipse(ctx);
        }
    }

    private getEllipseCenter(start: Vec2, end: Vec2, isCircle: boolean): void {
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
        this.centerX = start.x + Math.sign(xVector) * displacementX;
        this.centerY = start.y + Math.sign(yVector) * displacementY;
    }

    private drawTypeEllipse(ctx: CanvasRenderingContext2D): void {
        ctx.beginPath();
        ctx.setLineDash([]);
        ctx.lineJoin = 'round';
        ctx.ellipse(
            this.centerX,
            this.centerY,
            this.xRadius,
            this.yRadius,
            EllipseConstants.ROTATION,
            EllipseConstants.START_ANGLE,
            EllipseConstants.END_ANGLE,
        );

        ctx.strokeStyle = this.borderColor;
        ctx.lineWidth = this.lineWidth;
        ctx.stroke();
        if (this.fillMode !== ToolConstants.FillMode.OUTLINE) {
            ctx.fillStyle = this.primaryColor;
            ctx.fill();
        }
    }

    private getRadiiXAndY(path: Vec2[]): void {
        this.xRadius = Math.abs(path[EllipseConstants.END_INDEX].x - path[EllipseConstants.START_INDEX].x) / 2;
        this.yRadius = Math.abs(path[EllipseConstants.END_INDEX].y - path[EllipseConstants.START_INDEX].y) / 2;

        if (this.isCircle) {
            const shortestSide = Math.min(Math.abs(this.xRadius), Math.abs(this.yRadius));
            this.xRadius = this.yRadius = shortestSide;
        }
    }
}
