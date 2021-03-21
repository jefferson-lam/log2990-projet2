import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as PipetteConstants from '@app/constants/pipette-constants';
import { ColorService } from '@app/services/color/color.service';
import { PipetteService } from '@app/services/tools/pipette/pipette-service';

@Component({
    selector: 'app-sidebar-pipette',
    templateUrl: './sidebar-pipette.component.html',
    styleUrls: ['./sidebar-pipette.component.scss'],
})
export class SidebarPipetteComponent implements OnInit {
    ctx: CanvasRenderingContext2D;
    colorService: ColorService;
    rawData: ImageData = new ImageData(PipetteConstants.RAWDATA_SIZE, PipetteConstants.RAWDATA_SIZE);
    previewData: ImageData = new ImageData(PipetteConstants.PREVIEWDATA_SIZE, PipetteConstants.PREVIEWDATA_SIZE);
    inBound: boolean = false;

    constructor(public pipetteService: PipetteService) {}

    @ViewChild('canvas', { static: true })
    canvas: ElementRef<HTMLCanvasElement>;

    ngOnInit(): void {
        this.pipetteService.previewDataObservable.subscribe((previewData: ImageData) => {
            this.rawData = previewData;
            this.drawPreview();
        });
        this.pipetteService.inBoundObservable.subscribe((inBound: boolean) => {
            this.inBound = inBound;
        });
    }

    drawPreview(): void {
        if (!this.ctx) {
            this.ctx = this.canvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        }
        this.ctx.imageSmoothingEnabled = false;
        this.ctx.clearRect(0, 0, PipetteConstants.PREVIEWDATA_SIZE, PipetteConstants.PREVIEWDATA_SIZE);

        const centerPixel = new Uint32Array(this.rawData.data.buffer)[60];
        if (centerPixel != 0) {
            (document.getElementById('pipettePreview') as HTMLCanvasElement).style.display = 'block';
            this.clipPreview(this.ctx);
            this.ctx.putImageData(this.rawData, PipetteConstants.RAWDATA_POSITION, PipetteConstants.RAWDATA_POSITION);
            this.zoomPreview(this.ctx);
            this.centerPixelStroke(this.ctx);
            this.previewStroke(this.ctx);
        } else {
            (document.getElementById('pipettePreview') as HTMLCanvasElement).style.display = 'none';
        }
    }

    clipPreview(ctx: CanvasRenderingContext2D) {
        this.ctx.beginPath();
        this.ctx.arc(PipetteConstants.RAWDATA_POSITION, PipetteConstants.RAWDATA_POSITION, PipetteConstants.RAWDATA_POSITION, 0, Math.PI * 2, true);
        this.ctx.clip();
        this.ctx.closePath();
    }

    zoomPreview(ctx: CanvasRenderingContext2D) {
        this.ctx.drawImage(
            this.ctx.canvas,
            PipetteConstants.RAWDATA_POSITION,
            PipetteConstants.RAWDATA_POSITION,
            PipetteConstants.RAWDATA_SIZE,
            PipetteConstants.RAWDATA_SIZE,
            0,
            0,
            PipetteConstants.PREVIEWDATA_SIZE,
            PipetteConstants.PREVIEWDATA_SIZE,
        );
    }

    centerPixelStroke(ctx: CanvasRenderingContext2D) {
        this.ctx.strokeStyle = PipetteConstants.BLACK_STROKE;
        this.ctx.lineWidth = PipetteConstants.CENTER_PIXEL_LINE_WIDTH;
        this.ctx.strokeRect(
            PipetteConstants.CENTER_PIXEL_POSITION,
            PipetteConstants.CENTER_PIXEL_POSITION,
            PipetteConstants.CENTER_PIXEL_SIZE,
            PipetteConstants.CENTER_PIXEL_SIZE,
        );
    }

    previewStroke(ctx: CanvasRenderingContext2D) {
        this.ctx.beginPath();
        this.ctx.arc(PipetteConstants.RAWDATA_POSITION, PipetteConstants.RAWDATA_POSITION, PipetteConstants.RAWDATA_POSITION, 0, Math.PI * 2, true);
        this.ctx.lineWidth = PipetteConstants.OUTER_BORDER_LINE_WIDTH;
        this.ctx.strokeStyle = PipetteConstants.BLACK_STROKE;
        this.ctx.stroke();
        this.ctx.closePath();
    }
}
