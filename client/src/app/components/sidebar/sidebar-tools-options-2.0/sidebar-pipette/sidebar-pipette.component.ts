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
    rawData: ImageData = new ImageData(11, 11);
    previewData: ImageData = new ImageData(220, 220);
    inBound: boolean = false;

    constructor(colorService: ColorService, public pipetteService: PipetteService) {}

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

        this.ctx.beginPath();
        this.ctx.arc(110, 110, 110, 0, Math.PI * 2, true);
        this.ctx.clip();
        this.ctx.closePath();

        this.ctx.putImageData(this.rawData, 110, 110);

        this.ctx.drawImage(this.ctx.canvas, 110, 110, 11, 11, 0, 0, 220, 220);
        // Put center pixel in evidence
        this.ctx.strokeStyle = '#000';
        this.ctx.strokeRect(100, 100, 20, 20);
    }
}
