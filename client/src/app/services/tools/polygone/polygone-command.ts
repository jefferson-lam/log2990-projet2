import { Command } from '@app/classes/command';
import { Vec2 } from '@app/classes/vec2';
import * as PolygoneConstants from '@app/constants/polygone-constants';
import * as ShapeConstants from '@app/constants/shapes-constants';
import * as ToolConstants from '@app/constants/tool-constants';
import { PolygoneService } from '@app/services/tools/polygone/polygone-service';

export class PolygoneCommand extends Command {
    numberSides: number;
    lineWidth: number;
    fillMode: ToolConstants.FillMode;
    primaryColor: string;
    secondaryColor: string;
    cornerCoords: Vec2[];

    constructor(canvasContext: CanvasRenderingContext2D, polygoneService: PolygoneService) {
        super();
        this.cornerCoords = [];
        this.setValues(canvasContext, polygoneService);
    }

    execute(): void {
        this.drawPolygone(this.ctx, this.cornerCoords, this.numberSides);
    }

    setValues(canvasContext: CanvasRenderingContext2D, polygoneService: PolygoneService): void {
        this.ctx = canvasContext;
        this.fillMode = polygoneService.fillMode;
        this.primaryColor = polygoneService.primaryColor;
        this.secondaryColor = polygoneService.secondaryColor;
        this.lineWidth = polygoneService.lineWidth;
        this.numberSides = polygoneService.numberSides;
        Object.assign(this.cornerCoords, polygoneService.cornerCoords);
    }

    private drawPolygone(ctx: CanvasRenderingContext2D, path: Vec2[], sides: number): void {
        const polygoneCenter = this.getPolygoneCenter(path[ShapeConstants.START_INDEX], path[ShapeConstants.END_INDEX]);
        const startX = polygoneCenter.x;
        const startY = polygoneCenter.y;
        const radiiXAndY = this.getRadiiXAndY(path);
        const xRadius = radiiXAndY[ShapeConstants.X_INDEX];
        const radiusWithin = xRadius - this.lineWidth / 2;
        if (radiusWithin < 0) {
            return;
        }
        const borderColor: string = this.fillMode === ToolConstants.FillMode.FILL_ONLY ? this.primaryColor : this.secondaryColor;

        this.drawTypePolygone(ctx, radiusWithin, startX, startY, sides, this.fillMode, this.primaryColor, borderColor, this.lineWidth);
    }

    private drawTypePolygone(
        ctx: CanvasRenderingContext2D,
        radiusWithin: number,
        startX: number,
        startY: number,
        sides: number,
        fillMethod: number,
        primaryColor: string,
        secondaryColor: string,
        lineWidth: number,
    ): void {
        const ANGLE_EVEN = ShapeConstants.END_ANGLE / sides;
        ctx.beginPath();
        ctx.lineJoin = 'round';
        if (sides % 2 !== 0) {
            for (let i = 0; i < sides; i++) {
                ctx.lineTo(
                    startX + radiusWithin * Math.cos(ANGLE_EVEN * i - (PolygoneConstants.ANGLE_ODD / PolygoneConstants.ANGLE_LONG) * Math.PI),
                    startY + radiusWithin * Math.sin(ANGLE_EVEN * i - (PolygoneConstants.ANGLE_ODD / PolygoneConstants.ANGLE_LONG) * Math.PI),
                );
            }
        } else {
            ctx.moveTo(startX + radiusWithin, startY);
            for (let i = 0; i < sides; i++) {
                ctx.lineTo(startX + radiusWithin * Math.cos(ANGLE_EVEN * i), startY + radiusWithin * Math.sin(ANGLE_EVEN * i));
            }
        }
        ctx.closePath();
        ctx.strokeStyle = secondaryColor;
        ctx.lineWidth = lineWidth;
        ctx.stroke();
        if (fillMethod !== ToolConstants.FillMode.OUTLINE) {
            ctx.fillStyle = primaryColor;
            ctx.fill();
        }
    }

    private getPolygoneCenter(start: Vec2, end: Vec2): Vec2 {
        let displacementX: number;
        let displacementY: number;
        const radiusX = Math.abs(end.x - start.x) / 2;
        const radiusY = Math.abs(end.y - start.y) / 2;

        const shortestSide = Math.min(radiusX, radiusY);
        displacementX = displacementY = shortestSide;

        const xVector = end.x - start.x;
        const yVector = end.y - start.y;
        const centerX = start.x + Math.sign(xVector) * displacementX;
        const centerY = start.y + Math.sign(yVector) * displacementY;

        return { x: centerX, y: centerY };
    }

    getRadiiXAndY(path: Vec2[]): number[] {
        let xRadius = Math.abs(path[ShapeConstants.END_INDEX].x - path[ShapeConstants.START_INDEX].x) / 2;
        let yRadius = Math.abs(path[ShapeConstants.END_INDEX].y - path[ShapeConstants.START_INDEX].y) / 2;
        const shortestSide = Math.min(Math.abs(xRadius), Math.abs(yRadius));
        xRadius = yRadius = shortestSide;

        return [xRadius, yRadius];
    }
}
