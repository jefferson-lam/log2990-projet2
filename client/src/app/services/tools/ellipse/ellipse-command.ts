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
    cornerCoords: Vec2[] = [];
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
        if (this.radiiPosition.x > this.lineWidth / 2 && this.radiiPosition.y > this.lineWidth / 2) {
            this.radiiPosition.x -= this.lineWidth / 2;
            this.radiiPosition.y -= this.lineWidth / 2;
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
        this.centerPosition.x = start.x + Math.sign(xVector) * displacementX;
        this.centerPosition.y = start.y + Math.sign(yVector) * displacementY;
    }

    private drawTypeEllipse(ctx: CanvasRenderingContext2D): void {
        ctx.beginPath();
        ctx.lineJoin = 'round';
        ctx.ellipse(
            this.centerPosition.x,
            this.centerPosition.y,
            this.radiiPosition.x,
            this.radiiPosition.y,
            EllipseConstants.ROTATION,
            ShapeConstants.START_ANGLE,
            ShapeConstants.END_ANGLE,
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
        this.radiiPosition.x = Math.abs(path[ShapeConstants.END_INDEX].x - path[ShapeConstants.START_INDEX].x) / 2;
        this.radiiPosition.y = Math.abs(path[ShapeConstants.END_INDEX].y - path[ShapeConstants.START_INDEX].y) / 2;

        if (this.isCircle) {
            const shortestSide = Math.min(Math.abs(this.radiiPosition.x), Math.abs(this.radiiPosition.y));
            this.radiiPosition.x = this.radiiPosition.y = shortestSide;
        }
    }
}
