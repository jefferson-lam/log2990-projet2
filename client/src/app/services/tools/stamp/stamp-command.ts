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
        this.setValues(canvasContext, stampService);
    }

    execute(): void {
        this.addStamp();
    }

    setValues(canvasContext: CanvasRenderingContext2D, stampService: StampService): void {
        this.ctx = canvasContext;
        this.rotationAngle = stampService.rotationAngle;
        this.imageSource = stampService.imageSource;
        this.imageZoomFactor = stampService.imageZoomFactor;
        this.cornerCoords = Object.assign([], stampService.cornerCoords);
    }

    addStamp(): void {
        const stamp = new Image();
        stamp.src = this.imageSource;
        this.ctx.save();
        this.ctx.translate(this.cornerCoords[RectangleConstants.START_INDEX].x, this.cornerCoords[RectangleConstants.START_INDEX].y);
        this.ctx.rotate(this.rotationAngle);
        this.pasteStamp(stamp);
        this.ctx.restore();
    }

    pasteStamp(stamp: HTMLImageElement): void {
        const startPosition = {
            x: -this.getStampSize() / StampConstants.WIDTH_STAMP_FACTOR,
            y: -this.getStampSize() / 2,
        };
        const stampSize = {
            width: this.getStampSize() * StampConstants.FORMAT_MATCH,
            height: this.getStampSize(),
        };
        this.ctx.drawImage(stamp, startPosition.x, startPosition.y, stampSize.width, stampSize.height);
    }

    getStampSize(): number {
        if (this.imageZoomFactor === 0) this.imageZoomFactor = 1;
        if (this.imageZoomFactor < 0) return (1 / Math.abs(this.imageZoomFactor)) * (StampConstants.INIT_STAMP_SIZE / 2);
        return this.imageZoomFactor * (StampConstants.INIT_STAMP_SIZE / 2);
    }
}
