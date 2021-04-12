import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Rgba } from '@app/classes/rgba';
import * as ColorConstants from '@app/constants/color-constants';
import { ColorService } from '@app/services/color/color.service';

@Component({
    selector: 'app-color-history',
    templateUrl: './color-history.component.html',
    styleUrls: ['./color-history.component.scss'],
})
export class ColorHistoryComponent implements AfterViewInit, OnInit {
    ctx: CanvasRenderingContext2D;
    primary: Rgba;
    secondary: Rgba;
    @ViewChild('canvas', { static: true })
    canvas: ElementRef<HTMLCanvasElement>;

    savedColors: Rgba[] = new Array();

    constructor(public colorService: ColorService) {}

    ngOnInit(): void {
        this.colorService.primaryObservable.subscribe((newColor: Rgba) => {
            this.primary = newColor;
        });
        this.colorService.secondaryObservable.subscribe((newColor: Rgba) => {
            this.secondary = newColor;
        });
        this.colorService.savedColorsObservable.subscribe((colors: Rgba[]) => {
            this.savedColors = colors;
            this.drawHistory();
        });
    }

    ngAfterViewInit(): void {
        this.drawHistory();
    }

    onLeftClick(evt: MouseEvent): void {
        this.colorService.setPrimaryColor(this.colorService.getColorAtPosition(this.ctx, evt.offsetX, evt.offsetY, this.primary.alpha));
    }

    onRightClick(evt: MouseEvent): boolean {
        this.colorService.setSecondaryColor(this.colorService.getColorAtPosition(this.ctx, evt.offsetX, evt.offsetY, this.secondary.alpha));
        return false;
    }

    private drawHistory(): void {
        if (!this.ctx) {
            this.ctx = this.canvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        }
        const width = this.canvas.nativeElement.width;
        const height = this.canvas.nativeElement.height;

        let idx = 0;
        let x;
        let y;
        for (let i = 0; i < ColorConstants.COLOR_HISTORY_ROWS; ++i) {
            for (let j = 0; j < ColorConstants.COLOR_HISTORY_COLUMNS; ++j) {
                x = (width / ColorConstants.COLOR_HISTORY_COLUMNS) * j;
                y = (height / ColorConstants.COLOR_HISTORY_ROWS) * i;
                this.ctx.fillStyle = idx < this.savedColors.length ? this.colorService.convertRgbaToString(this.savedColors[idx++]) : 'white';
                this.ctx.fillRect(x, y, x + width / ColorConstants.COLOR_HISTORY_COLUMNS, y + height / ColorConstants.COLOR_HISTORY_ROWS);
            }
        }
    }
}
