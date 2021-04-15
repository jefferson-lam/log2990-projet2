import { AfterViewInit, Component, ElementRef, EventEmitter, HostListener, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { Rgba } from '@app/classes/rgba';
import { Vec2 } from '@app/classes/vec2';
import * as ColorConstants from '@app/constants/color-constants';
import { ColorService } from '@app/services/color/color.service';

@Component({
    selector: 'app-color-palette',
    templateUrl: './color-palette.component.html',
    styleUrls: ['./color-palette.component.scss'],
})
export class ColorPaletteComponent implements AfterViewInit, OnChanges {
    // Base code provided by Lukas Marx (https://malcoded.com/posts/angular-color-picker/)
    ctx: CanvasRenderingContext2D;
    mousedown: boolean;
    selectedPosition: Vec2;

    @ViewChild('canvas', { static: true })
    canvas: ElementRef<HTMLCanvasElement>;

    @Input() currentOpacity: number;
    @Input() hue: Rgba;

    @Output() color: EventEmitter<Rgba>;

    constructor(public colorService: ColorService) {
        this.mousedown = false;
        this.color = new EventEmitter<Rgba>();
    }

    ngAfterViewInit(): void {
        this.draw();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.hue) {
            this.draw();
            const pos = this.selectedPosition;
            this.draw();
            if (pos) {
                this.setColorAtPosition(pos.x, pos.y);
            }
        }
    }

    @HostListener('window:mouseup', ['$event'])
    onMouseUp(evt: MouseEvent): void {
        this.mousedown = false;
    }

    onMouseDown(evt: MouseEvent): void {
        this.mousedown = true;
        this.selectedPosition = { x: evt.offsetX, y: evt.offsetY };
        this.draw();
        this.setColorAtPosition(evt.offsetX, evt.offsetY);
    }

    onMouseMove(evt: MouseEvent): void {
        if (this.mousedown) {
            this.selectedPosition = { x: evt.offsetX, y: evt.offsetY };
            this.draw();
            this.setColorAtPosition(evt.offsetX, evt.offsetY);
        }
    }

    private draw(): void {
        if (!this.ctx) {
            this.ctx = this.canvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        }
        const width = this.canvas.nativeElement.width;
        const height = this.canvas.nativeElement.height;

        this.ctx.fillStyle = this.hue !== undefined ? this.colorService.convertRgbaToString(this.hue) : 'white';
        this.ctx.fillRect(0, 0, width, height);

        const whiteGrad = this.ctx.createLinearGradient(0, 0, width, 0);
        whiteGrad.addColorStop(0, 'rgba(255,255,255,1)');
        whiteGrad.addColorStop(1, 'rgba(255,255,255,0)');

        this.ctx.fillStyle = whiteGrad;
        this.ctx.fillRect(0, 0, width, height);

        const blackGrad = this.ctx.createLinearGradient(0, 0, 0, height);
        blackGrad.addColorStop(0, 'rgba(0,0,0,0)');
        blackGrad.addColorStop(1, 'rgba(0,0,0,1)');

        this.ctx.fillStyle = blackGrad;
        this.ctx.fillRect(0, 0, width, height);

        // Cursor position (transparent circle)
        if (this.selectedPosition) {
            this.ctx.strokeStyle = 'white';
            this.ctx.fillStyle = 'white';
            this.ctx.beginPath();
            this.ctx.arc(this.selectedPosition.x, this.selectedPosition.y, ColorConstants.PICKER_POINTER_SIZE, 0, 2 * Math.PI);
            this.ctx.lineWidth = ColorConstants.PICKER_POINTER_LINE_WIDTH;
            this.ctx.stroke();
        }
    }

    private setColorAtPosition(x: number, y: number): void {
        const rgbaColor = this.colorService.getColorAtPosition(this.ctx, x, y, this.currentOpacity);
        this.color.emit(rgbaColor);
    }
}
