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
        const yRadius = radiiXAndY[PolygoneConstants.Y_INDEX];
        const borderColor: string = this.fillMode === ToolConstants.FillMode.FILL_ONLY ? this.primaryColor : this.secondaryColor;
        this.drawTypePolygone(ctx, startX, startY, xRadius, yRadius, sides, this.fillMode, this.primaryColor, borderColor, this.lineWidth);
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
        const ANGLE_EVEN = PolygoneConstants.END_ANGLE / sides;
        ctx.beginPath();
        ctx.lineJoin = 'round';
        if (sides % 2 !== 0) {
            for (let i = 0; i < sides; i++) {
                ctx.lineTo(
                    startX +
                        this.getDrawTypeRadius(xRadius, yRadius) *
                            Math.cos(ANGLE_EVEN * i - (PolygoneConstants.ANGLE_ODD / PolygoneConstants.ANGLE_LONG) * Math.PI),
                    startY +
                        this.getDrawTypeRadius(xRadius, yRadius) *
                            Math.sin(ANGLE_EVEN * i - (PolygoneConstants.ANGLE_ODD / PolygoneConstants.ANGLE_LONG) * Math.PI),
                );
            }
        } else {
            ctx.moveTo(startX + this.getDrawTypeRadius(xRadius, yRadius), startY);
            for (let i = 0; i < sides; i++) {
                ctx.lineTo(
                    startX + this.getDrawTypeRadius(xRadius, yRadius) * Math.cos(ANGLE_EVEN * i),
                    startY + this.getDrawTypeRadius(xRadius, yRadius) * Math.sin(ANGLE_EVEN * i),
                );
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
    getDrawTypeRadius(xRadius: number, yRadius: number): number {
        return Math.sqrt(xRadius ** 2 + yRadius ** 2);
    }

    getRadiiXAndY(path: Vec2[]): number[] {
        let xRadius = Math.abs(path[PolygoneConstants.END_INDEX].x - path[PolygoneConstants.START_INDEX].x) / 2;
        let yRadius = Math.abs(path[PolygoneConstants.END_INDEX].y - path[PolygoneConstants.START_INDEX].y) / 2;
        const shortestSide = Math.min(Math.abs(xRadius), Math.abs(yRadius));
        xRadius = yRadius = shortestSide;
        return [xRadius, yRadius];
    }
}
