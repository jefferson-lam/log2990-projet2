import { Command } from '@app/classes/command';
import { Vec2 } from '@app/classes/vec2';
import * as RectangleConstants from '@app/constants/rectangle-constants';
import * as StampConstants from '@app/constants/stamp-constants';
import { StampService } from '@app/services/tools/stamp/stamp-service';

export class StampCommand extends Command {
    cornerCoords: Vec2[];
    rotationAngle: number;
    imageSource: string;
    imageZoomFactor: number;

    constructor(canvasContext: CanvasRenderingContext2D, stampService: StampService) {
        super();
        this.cornerCoords = [];
        this.setValues(canvasContext, stampService);
    }

    execute(): void {
        this.addStamp(this.ctx, this.cornerCoords, this.rotationAngle);
    }

    setValues(canvasContext: CanvasRenderingContext2D, stampService: StampService): void {
        this.ctx = canvasContext;
        this.rotationAngle = stampService.rotationAngle;
        this.imageSource = stampService.imageSource;
        this.imageZoomFactor = stampService.imageZoomFactor;
        Object.assign(this.cornerCoords, stampService.cornerCoords);
    }

    addStamp(ctx: CanvasRenderingContext2D, path: Vec2[], rotationAngle: number): void {
        const stamp = new Image();
        stamp.src = this.imageSource;
        ctx.save();
        ctx.translate(path[RectangleConstants.START_INDEX].x, path[RectangleConstants.START_INDEX].y);
        ctx.rotate(rotationAngle);
        this.pasteStamp(ctx, stamp);
        ctx.restore();
    }

    pasteStamp(ctx: CanvasRenderingContext2D, stamp: HTMLImageElement): void {
        const startPosition = {
            x: -this.getStampSize(this.imageZoomFactor) / StampConstants.WIDTH_STAMP_FACTOR,
            y: -this.getStampSize(this.imageZoomFactor) / 2,
        };
        const stampSize = {
            width: this.getStampSize(this.imageZoomFactor) * StampConstants.FORMAT_MATCH,
            height: this.getStampSize(this.imageZoomFactor),
        };
        ctx.drawImage(stamp, startPosition.x, startPosition.y, stampSize.width, stampSize.height);
    }

    getStampSize(zoomFactor: number): number {
        if (zoomFactor === 0) this.imageZoomFactor = 1;
        if (zoomFactor < 0) return (1 / Math.abs(zoomFactor)) * (StampConstants.INIT_STAMP_SIZE / 2);
        return zoomFactor * (StampConstants.INIT_STAMP_SIZE / 2);
    }
}
