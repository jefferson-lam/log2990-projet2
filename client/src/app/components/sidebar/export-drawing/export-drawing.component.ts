import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MAX_RGB_VALUE } from '@app/constants/color-constants';
import * as ExportDrawingConstants from '@app/constants/export-drawing-constants';
import { MAX_EXPORT_CANVAS_HEIGHT, MAX_EXPORT_CANVAS_WIDTH } from '@app/constants/popup-constants';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ImgurService } from '@app/services/imgur/imgur.service';
import { ExportCompletePageComponent } from './export-complete-page/export-complete-page.component';
import { ExportErrorPageComponent } from './export-error-page/export-error-page.component';

@Component({
    selector: 'app-export-drawing',
    templateUrl: './export-drawing.component.html',
    styleUrls: ['./export-drawing.component.scss'],
})
export class ExportDrawingComponent implements AfterViewInit, OnInit {
    @ViewChild('exportImg', { static: false }) exportImg: ElementRef<HTMLImageElement>;
    @ViewChild('exportCanvas', { static: true }) exportCanvasRef: ElementRef<HTMLCanvasElement>;
    exportCanvas: HTMLCanvasElement;
    exportCtx: CanvasRenderingContext2D;
    canvasStyleWidth: string;
    canvasStyleHeight: string;

    link: HTMLAnchorElement;

    baseCanvas: HTMLCanvasElement;
    baseCtx: CanvasRenderingContext2D;

    type: string;
    name: string;
    filter: string;

    url: string;
    popUpToggle: ExportDrawingConstants.PopUpToggle;

    constructor(drawingService: DrawingService, private imgurService: ImgurService, public newDialog: MatDialog) {
        this.baseCanvas = drawingService.canvas;
        this.baseCtx = this.baseCanvas.getContext('2d') as CanvasRenderingContext2D;
        this.setPopupSizes();
        this.type = 'png';
        this.name = 'Image';
        this.filter = 'none';
        this.link = document.createElement('a');
    }

    ngOnInit(): void {
        this.imgurService.serviceSettingsObservable.subscribe((serviceSettings: [number, string]) => {
            this.popUpToggle = serviceSettings[0];
            this.url = serviceSettings[1];
            this.openPopUp();
        });
    }

    ngAfterViewInit(): void {
        this.exportCanvas = this.exportCanvasRef.nativeElement;
        this.exportCtx = this.exportCanvas.getContext('2d') as CanvasRenderingContext2D;
        this.refreshCanvas();
    }

    changeWhiteToAlpha(imgData: ImageData): void {
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

    refreshCanvas(clearBackground: boolean = false): void {
        const imgData = this.baseCtx.getImageData(0, 0, this.baseCanvas.width, this.baseCanvas.height);
        if (clearBackground) {
            this.changeWhiteToAlpha(imgData);
        } else {
            this.exportCtx.putImageData(imgData, 0, 0);
        }
        this.exportCtx.drawImage(this.exportCanvas, 0, 0);
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

    applyFilter(filter: string): void {
        this.exportCtx.filter = filter;
        if (filter !== 'invert(100%)') {
            this.refreshCanvas(true);
        } else {
            this.refreshCanvas();
        }
    }

    saveImage(): void {
        this.link.download = this.name + '.' + this.type;
        this.link.href = this.exportCanvas.toDataURL('image/' + this.type);
        this.link.click();
    }

    exportToImgur(): void {
        this.imgurService.exportDrawing(this.exportCanvas.toDataURL('image/' + this.type), this.name);
    }

    openPopUp(): void {
        if (this.popUpToggle === ExportDrawingConstants.PopUpToggle.ERROR && this.imgurService.mutex === 1) {
            this.openErrorPopUp();
        } else if (this.imgurService.mutex) {
            this.openCompletePopUp();
        }
    }

    openErrorPopUp(): void {
        this.newDialog.open(ExportErrorPageComponent);
        this.imgurService.mutex--;
    }

    openCompletePopUp(): void {
        this.newDialog.open(ExportCompletePageComponent);
        this.imgurService.mutex--;
    }
}
