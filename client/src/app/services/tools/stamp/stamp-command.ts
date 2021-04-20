import { Command } from '@app/classes/command';
import { Vec2 } from '@app/classes/vec2';
import * as StampConstants from '@app/constants/stamp-constants';
import { StampService } from '@app/services/tools/stamp/stamp-service';

export class StampCommand extends Command {
    private position: Vec2;
    private rotationAngle: number;
    private stamp: HTMLImageElement;
    private imageZoomFactor: number;

    constructor(canvasContext: CanvasRenderingContext2D, stampService: StampService) {
        super();
        this.setValues(canvasContext, stampService);
    }

    execute(): void {
        this.addStamp();
    }

    setValues(canvasContext: CanvasRenderingContext2D, stampService: StampService): void {
        this.ctx = canvasContext;
        this.stamp = new Image();
        this.loadStamp(stampService.imageSource);
        this.rotationAngle = stampService.rotationAngle;
        this.imageZoomFactor = stampService.imageZoomFactor;
        this.position = stampService.position;
    }

    private addStamp(): void {
        this.ctx.save();
        this.ctx.translate(this.position.x, this.position.y);
        this.ctx.rotate(this.rotationAngle);
        this.pasteStamp();
        this.ctx.restore();
    }

    private pasteStamp(): void {
        const startPosition = {
            x: -this.getStampSize() / StampConstants.WIDTH_STAMP_FACTOR,
            y: -this.getStampSize() / 2,
        };
        const stampSize = {
            width: this.getStampSize() * StampConstants.FORMAT_MATCH,
            height: this.getStampSize(),
        };
        this.ctx.drawImage(this.stamp, startPosition.x, startPosition.y, stampSize.width, stampSize.height);
    }

    private getStampSize(): number {
        if (this.imageZoomFactor === 0) this.imageZoomFactor = 1;
        if (this.imageZoomFactor < 0) return (1 / Math.abs(this.imageZoomFactor)) * (StampConstants.INIT_STAMP_SIZE / 2);
        return this.imageZoomFactor * (StampConstants.INIT_STAMP_SIZE / 2);
    }

    private loadStamp(stampSource: string): void {
        new Promise((r) => {
            this.stamp.onload = r;
            this.stamp.src = stampSource;
        }).then();
    }
}
