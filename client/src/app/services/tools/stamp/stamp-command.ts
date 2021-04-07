import { Command } from '@app/classes/command';
import { Vec2 } from '@app/classes/vec2';
import * as RectangleConstants from '@app/constants/rectangle-constants';
import * as StampConstants from '@app/constants/stamp-constants';
import { StampService } from '@app/services/tools/stamp/stamp-service';

export class StampCommand extends Command {
    cornerCoords: Vec2[] = [];
    rotationAngle: number;
    imageSource: string;
    imageZoomFactor: number;

    constructor(canvasContext: CanvasRenderingContext2D, stampService: StampService) {
        super();
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
        const newStamp = new Image();
        newStamp.src = this.imageSource;
        ctx.save();
        ctx.translate(path[RectangleConstants.START_INDEX].x, path[RectangleConstants.START_INDEX].y);
        ctx.rotate(rotationAngle);
        ctx.drawImage(
            newStamp,
            -this.getStampSize(this.imageZoomFactor) / 2,
            -this.getStampSize(this.imageZoomFactor) / 2,
            this.getStampSize(this.imageZoomFactor) * StampConstants.FORMAT_MATCH,
            this.getStampSize(this.imageZoomFactor),
        );
        ctx.restore();
    }

    getStampSize(zoomFactor: number): number {
        return zoomFactor * (StampConstants.INIT_STAMP_SIZE / 2);
    }
}
