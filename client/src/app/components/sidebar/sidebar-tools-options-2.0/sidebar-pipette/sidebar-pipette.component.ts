import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as PipetteConstants from '@app/constants/pipette-constants';
import { PipetteService } from '@app/services/tools/pipette/pipette-service';

@Component({
    selector: 'app-sidebar-pipette',
    templateUrl: './sidebar-pipette.component.html',
    styleUrls: ['./sidebar-pipette.component.scss'],
})
export class SidebarPipetteComponent implements OnInit {
    private ctx: CanvasRenderingContext2D;
    private rawData: ImageData;
    inBound: boolean;

    constructor(public pipetteService: PipetteService) {
        this.rawData = new ImageData(PipetteConstants.RAWDATA_SIZE, PipetteConstants.RAWDATA_SIZE);
        this.inBound = false;
    }

    @ViewChild('canvas', { static: true }) private canvas: ElementRef<HTMLCanvasElement>;

    ngOnInit(): void {
        this.pipetteService.previewDataObservable.subscribe((previewData: ImageData) => {
            this.rawData = previewData;
            this.drawPreview();
        });
        this.pipetteService.inBoundObservable.subscribe((inBound: boolean) => {
            this.inBound = inBound;
            this.drawPreview();
        });
    }

    private drawPreview(): void {
        if (!this.ctx) {
            this.ctx = this.canvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        }
        this.ctx.imageSmoothingEnabled = false;
        this.ctx.clearRect(0, 0, PipetteConstants.PREVIEWDATA_SIZE, PipetteConstants.PREVIEWDATA_SIZE);

        if (this.inBound) {
            this.clipPreview();
            this.ctx.putImageData(this.rawData, PipetteConstants.RAWDATA_POSITION, PipetteConstants.RAWDATA_POSITION);
            this.zoomPreview();
            this.centerPixelStroke();
            this.previewStroke();
        } else {
            this.ctx.clearRect(0, 0, PipetteConstants.PREVIEWDATA_SIZE, PipetteConstants.PREVIEWDATA_SIZE);
        }
    }

    private clipPreview(): void {
        this.ctx.beginPath();
        this.ctx.arc(PipetteConstants.RAWDATA_POSITION, PipetteConstants.RAWDATA_POSITION, PipetteConstants.RAWDATA_POSITION, 0, Math.PI * 2, true);
        this.ctx.clip();
        this.ctx.closePath();
    }

    private zoomPreview(): void {
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

    centerPixelStroke(): void {
        this.ctx.strokeStyle = PipetteConstants.BLACK_STROKE;
        this.ctx.lineWidth = PipetteConstants.CENTER_PIXEL_LINE_WIDTH;
        this.ctx.strokeRect(
            PipetteConstants.CENTER_PIXEL_POSITION,
            PipetteConstants.CENTER_PIXEL_POSITION,
            PipetteConstants.CENTER_PIXEL_SIZE,
            PipetteConstants.CENTER_PIXEL_SIZE,
        );
    }

    previewStroke(): void {
        this.ctx.beginPath();
        this.ctx.arc(PipetteConstants.RAWDATA_POSITION, PipetteConstants.RAWDATA_POSITION, PipetteConstants.RAWDATA_POSITION, 0, Math.PI * 2, true);
        this.ctx.lineWidth = PipetteConstants.OUTER_BORDER_LINE_WIDTH;
        this.ctx.strokeStyle = PipetteConstants.BLACK_STROKE;
        this.ctx.stroke();
        this.ctx.closePath();
    }
}
