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
    centerPosition: Vec2;
    radiiPosition: Vec2;
    borderColor: string;

    constructor(canvasContext: CanvasRenderingContext2D, ellipseService: EllipseService) {
        super();
        this.cornerCoords = [];
        this.setValues(canvasContext, ellipseService);
        this.centerPosition = {} as Vec2;
        this.radiiPosition = {} as Vec2;
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
        this.cornerCoords = Object.assign([], ellipseService.cornerCoords);
    }

    private drawEllipse(ctx: CanvasRenderingContext2D, path: Vec2[]): void {
        this.getEllipseCenter(path[ShapeConstants.START_INDEX], path[ShapeConstants.END_INDEX], this.isCircle);
        this.getRadiiXAndY(path);

        this.borderColor = this.fillMode === ToolConstants.FillMode.FILL_ONLY ? this.primaryColor : this.secondaryColor;
        if (this.radiiPosition.x > this.lineWidth && this.radiiPosition.y > this.lineWidth) {
            this.radiiPosition.x -= this.lineWidth / 2;
            this.radiiPosition.y -= this.lineWidth / 2;
            this.drawTypeEllipse(ctx);
        } else {
            this.lineWidth = 0;
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
        this.centerPosition.x = start.x + Math.sign(xVector) * displacementX;
        this.centerPosition.y = start.y + Math.sign(yVector) * displacementY;
    }

    private getSmallRadiiXY(): Vec2 {
        const smallRadii: Vec2 = {} as Vec2;
        smallRadii.x =
            Math.abs(this.radiiPosition.x - this.lineWidth / 2) < this.radiiPosition.x + this.lineWidth / 2
                ? Math.abs(this.radiiPosition.x - this.lineWidth / 2)
                : this.radiiPosition.x + this.lineWidth / 2;
        smallRadii.y =
            Math.abs(this.radiiPosition.y - this.lineWidth / 2) < this.radiiPosition.y + this.lineWidth / 2
                ? Math.abs(this.radiiPosition.y - this.lineWidth / 2)
                : this.radiiPosition.y + this.lineWidth / 2;
        return smallRadii;
    }

    private drawBorderEllipse(ctx: CanvasRenderingContext2D): void {
        ctx.save();
        ctx.beginPath();
        const smallRadii = this.getSmallRadiiXY();
        ctx.ellipse(
            this.centerPosition.x,
            this.centerPosition.y,
            smallRadii.x,
            smallRadii.y,
            EllipseConstants.ROTATION,
            ShapeConstants.START_ANGLE,
            ShapeConstants.END_ANGLE,
        );
        ctx.ellipse(
            this.centerPosition.x,
            this.centerPosition.y,
            smallRadii.x + this.lineWidth,
            smallRadii.y + this.lineWidth,
            EllipseConstants.ROTATION,
            ShapeConstants.START_ANGLE,
            ShapeConstants.END_ANGLE,
        );
        ctx.clip('evenodd');
        ctx.fillStyle = this.borderColor;
        ctx.fill();
        ctx.restore();
    }

    private drawCenterEllipse(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = this.primaryColor;
        ctx.beginPath();
        ctx.ellipse(
            this.centerPosition.x,
            this.centerPosition.y,
            this.radiiPosition.x - this.lineWidth / 2,
            this.radiiPosition.y - this.lineWidth / 2,
            EllipseConstants.ROTATION,
            ShapeConstants.START_ANGLE,
            ShapeConstants.END_ANGLE,
        );
        ctx.fill();
    }

    private drawFullEllipse(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = this.primaryColor;
        ctx.beginPath();
        ctx.ellipse(
            this.centerPosition.x,
            this.centerPosition.y,
            this.radiiPosition.x + this.lineWidth / 2,
            this.radiiPosition.y + this.lineWidth / 2,
            EllipseConstants.ROTATION,
            ShapeConstants.START_ANGLE,
            ShapeConstants.END_ANGLE,
        );
        ctx.fill();
    }

    private drawOutlineEllipse(ctx: CanvasRenderingContext2D): void {
        ctx.strokeStyle = this.secondaryColor;
        ctx.lineWidth = this.lineWidth;
        ctx.beginPath();
        ctx.ellipse(
            this.centerPosition.x,
            this.centerPosition.y,
            this.radiiPosition.x,
            this.radiiPosition.y,
            EllipseConstants.ROTATION,
            ShapeConstants.START_ANGLE,
            ShapeConstants.END_ANGLE,
        );
        ctx.closePath();
        ctx.stroke();
    }

    private drawTypeEllipse(ctx: CanvasRenderingContext2D): void {
        if (this.fillMode === ToolConstants.FillMode.OUTLINE) {
            this.drawOutlineEllipse(ctx);
            return;
        }
        if (this.fillMode === ToolConstants.FillMode.OUTLINE_FILL) this.drawBorderEllipse(ctx);

        if (this.radiiPosition.x - this.lineWidth / 2 <= 0 || this.radiiPosition.y - this.lineWidth / 2 <= 0) return;
        if (this.fillMode === ToolConstants.FillMode.OUTLINE_FILL) {
            this.drawCenterEllipse(ctx);
        } else {
            this.drawFullEllipse(ctx);
        }
    }

    private getRadiiXAndY(path: Vec2[]): void {
        this.radiiPosition.x = Math.abs(path[ShapeConstants.END_INDEX].x - path[ShapeConstants.START_INDEX].x) / 2;
        this.radiiPosition.y = Math.abs(path[ShapeConstants.END_INDEX].y - path[ShapeConstants.START_INDEX].y) / 2;

        if (this.isCircle) {
            const shortestSide = Math.min(Math.abs(this.radiiPosition.x), Math.abs(this.radiiPosition.y));
            this.radiiPosition.x = this.radiiPosition.y = shortestSide;
        }
    }
}
