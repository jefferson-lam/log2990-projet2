import { AfterViewInit, Component, ElementRef, EventEmitter, HostListener, Input, Output, ViewChild } from '@angular/core';
import { Rgba } from '@app/classes/rgba';
import * as ColorConstants from '@app/constants/color-constants';
import { ColorService } from '@app/services/color/color.service';
@Component({
    selector: 'app-color-slider',
    templateUrl: './color-slider.component.html',
    styleUrls: ['./color-slider.component.scss'],
})
export class ColorSliderComponent implements AfterViewInit {
    ctx: CanvasRenderingContext2D;
    mousedown: boolean = false;
    selectedHeight: number;

    constructor(public colorService: ColorService) {}

    @ViewChild('canvas', { static: true })
    canvas: ElementRef<HTMLCanvasElement>;

    @Input()
    rgbSelectorColor: Rgba;

    @Output()
    hue: EventEmitter<Rgba> = new EventEmitter();

    ngAfterViewInit(): void {
        this.drawSlider();
    }

    drawSlider(): void {
        if (!this.ctx) {
            this.ctx = this.canvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        }
        const width = this.canvas.nativeElement.width;
        const height = this.canvas.nativeElement.height;
        this.ctx.clearRect(0, 0, width, height);

        const gradient = this.ctx.createLinearGradient(0, 0, 0, height);
        const offset1 = 0.17;
        const offset2 = 0.34;
        const offset3 = 0.51;
        const offset4 = 0.68;
        const offset5 = 0.85;
        gradient.addColorStop(0, 'rgba(255, 0, 0, 1)');
        gradient.addColorStop(offset1, 'rgba(255, 255, 0, 1)');
        gradient.addColorStop(offset2, 'rgba(0, 255, 0, 1)');
        gradient.addColorStop(offset3, 'rgba(0, 255, 255, 1)');
        gradient.addColorStop(offset4, 'rgba(0, 0, 255, 1)');
        gradient.addColorStop(offset5, 'rgba(255, 0, 255, 1)');
        gradient.addColorStop(1, 'rgba(255, 0, 0, 1)');

        this.ctx.beginPath();
        this.ctx.rect(0, 0, width, height);
        this.ctx.fillStyle = gradient;
        this.ctx.fill();
        this.ctx.closePath();
    }

    drawSelection(): void {
        const width = this.canvas.nativeElement.width;
        this.drawSlider();
        if (this.selectedHeight) {
            this.ctx.beginPath();
            this.ctx.strokeStyle = 'white';
            this.ctx.lineWidth = ColorConstants.PICKER_POINTER_LINE_WIDTH;
            this.ctx.rect(0, this.selectedHeight - ColorConstants.PICKER_POINTER_LINE_WIDTH, width, ColorConstants.PICKER_POINTER_SIZE);
            this.ctx.stroke();
            this.ctx.closePath();
        }
    }

    // ngOnChanges(changes: SimpleChanges): void {
    //     if (changes.rgbSelectorColor) {
    //         const newHue = this.getHuePositionFromColor(this.rgbSelectorColor);
    //         this.selectedHeight = newHue;
    //         this.draw();
    //         this.emitHue(this.selectedHeight);
    //     }
    // }

    @HostListener('window:mouseup', ['$event'])
    onMouseUp(evt: MouseEvent): void {
        this.mousedown = false;
    }

    onMouseDown(evt: MouseEvent): void {
        this.mousedown = true;
        this.selectedHeight = evt.offsetY;
        this.drawSelection();
        this.emitHue(evt.offsetY);
    }

    @HostListener('window:mousemove', ['$event'])
    onMouseMove(evt: MouseEvent): void {
        if (this.mousedown) {
            if (evt.offsetY < 0) {
                this.selectedHeight = 0;
            } else if (evt.offsetY > this.canvas.nativeElement.height) {
                this.selectedHeight = this.canvas.nativeElement.height;
            } else {
                this.selectedHeight = evt.offsetY;
            }
            this.drawSelection();
            this.emitHue(this.selectedHeight);
        }
    }

    emitHue(y: number): void {
        const rgbaColor = this.colorService.getColorAtPosition(this.ctx, this.canvas.nativeElement.width / 2, y, 1);
        this.hue.emit(rgbaColor);
    }

    // logic provided by http://www.niwa.nu/2013/05/math-behind-colorspace-conversions-rgb-hsl/
    // getHuePositionFromColor(color: Rgba): number {
    //     let hue;
    //     const red: number = parseInt(color.red, 10) / 255;
    //     const green: number = parseInt(color.green, 10) / 255;
    //     const blue: number = parseInt(color.blue, 10) / 255;
    //     const min: number = Math.min(red, green, blue);
    //     const max: number = Math.max(red, green, blue);
    //     // Max and min will only be equal when all rgb have the same value
    //     if (max === min) {
    //         return 0;
    //     }

    //     if (max === red) {
    //         hue = (green - blue) / (max - min);
    //     } else if (max === green) {
    //         hue = 2 + (blue - red) / (max - min);
    //     } else {
    //         hue = 4 + (red - green) / (max - min);
    //     }

    //     hue *= 60; // find the sector of 60 degrees to which the color belongs

    //     if (hue < 0) {
    //         hue += 360;
    //     }
    //     // find position with current slider dimensions
    //     return Math.floor((hue * this.canvas.nativeElement.height) / 360);
    // }
}
