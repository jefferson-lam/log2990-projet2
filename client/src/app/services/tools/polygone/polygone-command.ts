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
    borderColor: string;
    cornerCoords: Vec2[];

    centerPosition: Vec2;
    radiusWithin: number;

    constructor(canvasContext: CanvasRenderingContext2D, polygoneService: PolygoneService) {
        super();
        this.setValues(canvasContext, polygoneService);
        this.centerPosition = {} as Vec2;
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
        this.numberSides = polygoneService.numberSides;
        this.cornerCoords = Object.assign([], polygoneService.cornerCoords);
    }

    private drawPolygone(ctx: CanvasRenderingContext2D): void {
        this.getPolygoneCenter(this.cornerCoords[ShapeConstants.START_INDEX], this.cornerCoords[ShapeConstants.END_INDEX]);

        this.radiusWithin = this.getRadiiX(this.cornerCoords);
        if (this.radiusWithin < 0) {
            return;
        }
        this.borderColor = this.fillMode === ToolConstants.FillMode.FILL_ONLY ? this.primaryColor : this.secondaryColor;
        if (this.radiusWithin > this.lineWidth / 2) {
            this.drawTypePolygone(ctx);
        } else {
            this.primaryColor = this.borderColor;
            this.drawTypePolygone(ctx);
        }
    }

    private drawBorderShape(ctx: CanvasRenderingContext2D): void {
        ctx.save();
        ctx.beginPath();
        const ANGLE_EVEN = ShapeConstants.END_ANGLE / this.numberSides;
        if (this.numberSides % 2 !== 0) {
            for (let i = 0; i <= this.numberSides; i++) {
                const angle = ANGLE_EVEN * i - (PolygoneConstants.ANGLE_ODD / PolygoneConstants.ANGLE_LONG) * Math.PI;
                ctx.lineTo(this.centerPosition.x + this.radiusWithin * Math.cos(angle), this.centerPosition.y + this.radiusWithin * Math.sin(angle));
            }
            this.radiusWithin -= this.lineWidth;
            for (let i = 0; i <= this.numberSides; i++) {
                const angle = ANGLE_EVEN * i - (PolygoneConstants.ANGLE_ODD / PolygoneConstants.ANGLE_LONG) * Math.PI;
                ctx.lineTo(this.centerPosition.x + this.radiusWithin * Math.cos(angle), this.centerPosition.y + this.radiusWithin * Math.sin(angle));
            }
        } else {
            for (let i = 0; i <= this.numberSides; i++) {
                ctx.lineTo(
                    this.centerPosition.x + this.radiusWithin * Math.cos(ANGLE_EVEN * i),
                    this.centerPosition.y + this.radiusWithin * Math.sin(ANGLE_EVEN * i),
                );
            }
            this.radiusWithin -= this.lineWidth;
            for (let i = 0; i <= this.numberSides; i++) {
                ctx.lineTo(
                    this.centerPosition.x + this.radiusWithin * Math.cos(ANGLE_EVEN * i),
                    this.centerPosition.y + this.radiusWithin * Math.sin(ANGLE_EVEN * i),
                );
            }
        }
        ctx.clip('evenodd');
        ctx.fillStyle = this.borderColor;
        ctx.fill();
        ctx.restore();
    }

    private drawTypePolygone(ctx: CanvasRenderingContext2D): void {
        switch (this.fillMode) {
            case ToolConstants.FillMode.OUTLINE:
                this.drawBorderShape(ctx);
                break;
            case ToolConstants.FillMode.FILL_ONLY:
                ctx.fillStyle = this.primaryColor;
                this.drawShape(ctx);
                ctx.fill();
                break;
            case ToolConstants.FillMode.OUTLINE_FILL:
                this.drawBorderShape(ctx);
                ctx.fillStyle = this.primaryColor;
                this.drawShape(ctx);
                ctx.fill();
        }
    }

    private drawShape(ctx: CanvasRenderingContext2D): void {
        const ANGLE_EVEN = ShapeConstants.END_ANGLE / this.numberSides;
        ctx.beginPath();
        ctx.lineJoin = 'round';
        if (this.numberSides % 2 !== 0) {
            for (let i = 0; i < this.numberSides; i++) {
                const angle = ANGLE_EVEN * i - (PolygoneConstants.ANGLE_ODD / PolygoneConstants.ANGLE_LONG) * Math.PI;
                ctx.lineTo(this.centerPosition.x + this.radiusWithin * Math.cos(angle), this.centerPosition.y + this.radiusWithin * Math.sin(angle));
            }
        } else {
            ctx.moveTo(this.centerPosition.x + this.radiusWithin, this.centerPosition.y);
            for (let i = 0; i < this.numberSides; i++) {
                ctx.lineTo(
                    this.centerPosition.x + this.radiusWithin * Math.cos(ANGLE_EVEN * i),
                    this.centerPosition.y + this.radiusWithin * Math.sin(ANGLE_EVEN * i),
                );
            }
        }
        ctx.closePath();
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
        this.centerPosition.x = start.x + Math.sign(xVector) * displacementX;
        this.centerPosition.y = start.y + Math.sign(yVector) * displacementY;
    }

    private getRadiiX(path: Vec2[]): number {
        let xRadius = Math.abs(path[ShapeConstants.END_INDEX].x - path[ShapeConstants.START_INDEX].x) / 2;
        const yRadius = Math.abs(path[ShapeConstants.END_INDEX].y - path[ShapeConstants.START_INDEX].y) / 2;
        const shortestSide = Math.min(Math.abs(xRadius), Math.abs(yRadius));
        xRadius = shortestSide;

        return xRadius;
    }
}
