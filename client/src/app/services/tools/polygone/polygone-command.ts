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
    borderColor: string;
    cornerCoords: Vec2[] = [];

    centerX: number;
    centerY: number;
    radiusWithin: number;

    constructor(canvasContext: CanvasRenderingContext2D, polygoneService: PolygoneService) {
        super();
        this.setValues(canvasContext, polygoneService);
    }

    execute(): void {
        this.drawPolygone(this.ctx);
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

    private drawPolygone(ctx: CanvasRenderingContext2D): void {
        this.getPolygoneCenter(this.cornerCoords[PolygoneConstants.START_INDEX], this.cornerCoords[PolygoneConstants.END_INDEX]);

        const xRadius = this.getRadiiX(this.cornerCoords);
        this.radiusWithin = xRadius - this.lineWidth / 2;
        if (this.radiusWithin < 0) {
            return;
        }
        this.borderColor = this.fillMode === ToolConstants.FillMode.FILL_ONLY ? this.primaryColor : this.secondaryColor;
        this.drawTypePolygone(ctx);
    }

    private drawTypePolygone(ctx: CanvasRenderingContext2D): void {
        const ANGLE_EVEN = PolygoneConstants.END_ANGLE / this.initNumberSides;
        ctx.beginPath();
        ctx.lineJoin = 'round';
        if (this.initNumberSides % 2 !== 0) {
            for (let i = 0; i < this.initNumberSides; i++) {
                ctx.lineTo(
                    this.centerX +
                        this.radiusWithin * Math.cos(ANGLE_EVEN * i - (PolygoneConstants.ANGLE_ODD / PolygoneConstants.ANGLE_LONG) * Math.PI),
                    this.centerY +
                        this.radiusWithin * Math.sin(ANGLE_EVEN * i - (PolygoneConstants.ANGLE_ODD / PolygoneConstants.ANGLE_LONG) * Math.PI),
                );
            }
        } else {
            ctx.moveTo(this.centerX + this.radiusWithin, this.centerY);
            for (let i = 0; i < this.initNumberSides; i++) {
                ctx.lineTo(this.centerX + this.radiusWithin * Math.cos(ANGLE_EVEN * i), this.centerY + this.radiusWithin * Math.sin(ANGLE_EVEN * i));
            }
        }
        ctx.closePath();
        ctx.strokeStyle = this.borderColor;
        ctx.lineWidth = this.lineWidth;
        ctx.stroke();
        if (this.fillMode !== ToolConstants.FillMode.OUTLINE) {
            ctx.fillStyle = this.primaryColor;
            ctx.fill();
        }
    }

    private getPolygoneCenter(start: Vec2, end: Vec2): void {
        let displacementX: number;
        let displacementY: number;
        const radiusX = Math.abs(end.x - start.x) / 2;
        const radiusY = Math.abs(end.y - start.y) / 2;

        const shortestSide = Math.min(radiusX, radiusY);
        displacementX = displacementY = shortestSide;

        const xVector = end.x - start.x;
        const yVector = end.y - start.y;
        this.centerX = start.x + Math.sign(xVector) * displacementX;
        this.centerY = start.y + Math.sign(yVector) * displacementY;
    }

    private getRadiiX(path: Vec2[]): number {
        let xRadius = Math.abs(path[PolygoneConstants.END_INDEX].x - path[PolygoneConstants.START_INDEX].x) / 2;
        const yRadius = Math.abs(path[PolygoneConstants.END_INDEX].y - path[PolygoneConstants.START_INDEX].y) / 2;
        const shortestSide = Math.min(Math.abs(xRadius), Math.abs(yRadius));
        xRadius = shortestSide;

        return xRadius;
    }
}
