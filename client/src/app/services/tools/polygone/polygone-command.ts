import { Command } from '@app/classes/command';
import { Vec2 } from '@app/classes/vec2';
import * as PolygoneConstants from '@app/constants/polygone-constants';
import * as ToolConstants from '@app/constants/tool-constants';
import { PolygoneService } from '@app/services/tools/polygone/polygone-service';

export class PolygoneCommand extends Command {
    initNumberSides: number;
    lineWidth: number;
    fillMode: ToolConstants.FillMode;
    primaryColor: string;
    secondaryColor: string;
    cornerCoords: Vec2[] = [];

    constructor(canvasContext: CanvasRenderingContext2D, polygoneService: PolygoneService) {
        super();
        this.setValues(canvasContext, polygoneService);
    }

    execute(): void {
        this.drawPolygone(this.ctx, this.cornerCoords, this.initNumberSides);
    }

    setValues(canvasContext: CanvasRenderingContext2D, polygoneService: PolygoneService): void {
        this.ctx = canvasContext;
        this.fillMode = polygoneService.fillMode;
        this.primaryColor = polygoneService.primaryColor;
        this.secondaryColor = polygoneService.secondaryColor;
        this.lineWidth = polygoneService.lineWidth;
        this.initNumberSides = polygoneService.initNumberSides;
        Object.assign(this.cornerCoords, polygoneService.cornerCoords);
    }

    private drawPolygone(ctx: CanvasRenderingContext2D, path: Vec2[], sides: number): void {
        const polygoneCenter = this.getPolygoneCenter(path[PolygoneConstants.START_INDEX], path[PolygoneConstants.END_INDEX]);
        const startX = polygoneCenter.x;
        const startY = polygoneCenter.y;
        const radiiXAndY = this.getRadiiXAndY(path);
        const xRadius = radiiXAndY[PolygoneConstants.X_INDEX];
        const yRadius = radiiXAndY[PolygoneConstants.X_INDEX];
        const borderColor: string = this.fillMode === ToolConstants.FillMode.FILL_ONLY ? this.primaryColor : this.secondaryColor;
        this.drawTypePolygone(ctx, startX, startY, xRadius, yRadius, sides, this.fillMode, this.primaryColor, borderColor, this.lineWidth);
    }

    private getPolygoneCenter(start: Vec2, end: Vec2): Vec2 {
        let displacementX: number;
        let displacementY: number;
        const radiusX = Math.abs(end.x - start.x) / 2;
        const radiusY = Math.abs(end.y - start.y) / 2;

        displacementX = radiusX;
        displacementY = radiusY;

        const xVector = end.x - start.x;
        const yVector = end.y - start.y;
        const centerX = start.x + Math.sign(xVector) * displacementX;
        const centerY = start.y + Math.sign(yVector) * displacementY;
        return { x: centerX, y: centerY };
    }

    private drawTypePolygone(
        ctx: CanvasRenderingContext2D,
        startX: number,
        startY: number,
        xRadius: number,
        yRadius: number,
        sides: number,
        fillMethod: number,
        primaryColor: string,
        secondaryColor: string,
        lineWidth: number,
    ): void {
        ctx.beginPath();
        ctx.setLineDash([]);
        ctx.lineJoin = 'round';
        const ANGLE = PolygoneConstants.END_ANGLE / sides;
        ctx.moveTo(startX + xRadius * Math.cos(0), startY + xRadius * Math.sin(0));
        for (let i = 1; i < sides; i++) {
            ctx.lineTo(startX + xRadius * Math.cos(ANGLE * i), startY + xRadius * Math.sin(ANGLE * i));
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

    private getRadiiXAndY(path: Vec2[]): number[] {
        const xRadius = Math.abs(path[PolygoneConstants.END_INDEX].x - path[PolygoneConstants.START_INDEX].x) / 2;
        const yRadius = Math.abs(path[PolygoneConstants.END_INDEX].y - path[PolygoneConstants.START_INDEX].y) / 2;
        return [xRadius, yRadius];
    }
}
