import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { MAX_RGB_VALUE } from '@app/constants/color-constants';
import { MAX_EXPORT_CANVAS_HEIGHT, MAX_EXPORT_CANVAS_WIDTH } from '@app/constants/popup-constants';
import { DrawingService } from '@app/services/drawing/drawing.service';

@Component({
    selector: 'app-export-drawing',
    templateUrl: './export-drawing.component.html',
    styleUrls: ['./export-drawing.component.scss'],
})
export class ExportDrawingComponent implements AfterViewInit {
    @ViewChild('exportImg', { static: false }) exportImg: ElementRef<HTMLImageElement>;
    @ViewChild('exportCanvas', { static: true }) exportCanvasRef: ElementRef<HTMLCanvasElement>;
    exportCanvas: HTMLCanvasElement;
    exportCtx: CanvasRenderingContext2D;
    canvasStyleWidth: string;
    canvasStyleHeight: string;

    link: HTMLAnchorElement;

    baseCanvas: HTMLCanvasElement;

    type: string;
    name: string;
    filter: string;

    constructor(drawingService: DrawingService) {
        this.baseCanvas = drawingService.canvas;
        this.setPopupSizes();
        this.type = 'png';
        this.name = 'Image';
        this.filter = 'original';
        this.link = document.createElement('a');
    }

    ngAfterViewInit(): void {
        this.exportCanvas = this.exportCanvasRef.nativeElement;
        this.exportCtx = this.exportCanvas.getContext('2d') as CanvasRenderingContext2D;
        this.exportCtx.drawImage(this.baseCanvas, 0, 0);
        this.whiteToAlpha();
        this.exportImg.nativeElement.src = this.exportCanvas.toDataURL();
    }

    setPopupSizes(): void {
        if (this.baseCanvas.height > this.baseCanvas.width) {
            this.canvasStyleWidth = (this.baseCanvas.width / this.baseCanvas.height) * MAX_EXPORT_CANVAS_WIDTH + 'px';
            this.canvasStyleHeight = MAX_EXPORT_CANVAS_HEIGHT + 'px';
        } else {
            this.canvasStyleWidth = MAX_EXPORT_CANVAS_WIDTH + 'px';
            this.canvasStyleHeight = (this.baseCanvas.height / this.baseCanvas.width) * MAX_EXPORT_CANVAS_HEIGHT + 'px';
        }
    }

    whiteToAlpha(): void {
        const imgData = this.exportCtx.getImageData(0, 0, this.exportCanvas.width, this.exportCanvas.height);
        // tslint:disable-next-line:no-magic-numbers
        for (let i = 0; i < imgData.data.length; i += 4) {
            if (imgData.data[i] === MAX_RGB_VALUE && imgData.data[i + 1] === MAX_RGB_VALUE && imgData.data[i + 2] === MAX_RGB_VALUE) {
                imgData.data[i] = 0;
                imgData.data[i + 1] = 0;
                imgData.data[i + 2] = 0;
                // tslint:disable-next-line:no-magic-numbers
                imgData.data[i + 3] = 0;
            }
        }
        this.exportCtx.putImageData(imgData, 0, 0);
    }

    applyFilter(filter: string): void {
        this.exportCanvas.style.filter = filter;
        this.exportImg.nativeElement.style.filter = filter;
    }

    createBackground(): void {
        if (this.exportCanvas.style.filter === 'invert(0%)') {
            this.exportCtx.fillStyle = 'black';
        } else {
            this.exportCtx.fillStyle = 'white';
        }
        this.exportCtx.fillRect(0, 0, this.exportCanvas.width, this.exportCanvas.height);
        this.exportCtx.drawImage(this.baseCanvas, 0, 0);
    }

    saveImage(): void {
        if (this.type === 'jpeg') {
            this.createBackground();
        }
        this.link.download = this.name + '.' + this.type;
        this.link.href = this.exportCanvas.toDataURL('image/' + this.type);
        this.link.click();
    }
}
