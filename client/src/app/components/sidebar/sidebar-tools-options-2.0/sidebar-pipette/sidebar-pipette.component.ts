import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ColorService } from '@app/services/color/color.service';
import { PipetteService } from '@app/services/tools/pipette-service';

@Component({
    selector: 'app-sidebar-pipette',
    templateUrl: './sidebar-pipette.component.html',
    styleUrls: ['./sidebar-pipette.component.scss'],
})
export class SidebarPipetteComponent implements OnInit {
    ctx: CanvasRenderingContext2D;
    colorService: ColorService;
    rawData: ImageData = new ImageData(10, 10);
    previewData: ImageData = new ImageData(100, 100);

    constructor(colorService: ColorService, public pipetteService: PipetteService) {}

    @ViewChild('canvas', { static: true })
    canvas: ElementRef<HTMLCanvasElement>;

    ngOnInit(): void {
        this.pipetteService.previewDataObservable.subscribe((previewData: ImageData) => {
            this.rawData = previewData;
            this.drawPreview();
        });
    }

    drawPreview(): void {
        if (!this.ctx) {
            this.ctx = this.canvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        }
        this.ctx.fillStyle = '#FFF';
        this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

        let zoomedCanvas = document.createElement('canvas');
        zoomedCanvas.width = 100;
        zoomedCanvas.height = 100;
        let zoomedCtx = zoomedCanvas.getContext('2d') as CanvasRenderingContext2D;

        zoomedCtx.fillStyle = '#FFF';
        zoomedCtx.fillRect(0, 0, 100, 100);

        zoomedCtx.putImageData(this.rawData, 0, 0);
        this.ctx.drawImage(zoomedCtx.canvas, 0, 0, 10, 10, 0, 0, 100, 100);
        // Put center pixel in evidence
        this.ctx.strokeStyle = '#000';
        this.ctx.strokeRect(45, 45, 10, 10);
    }
}
