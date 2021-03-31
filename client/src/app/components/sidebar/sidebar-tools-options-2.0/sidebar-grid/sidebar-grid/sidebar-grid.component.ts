import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import * as GridConstants from '@app/constants/canvas-grid-constants';
import { CanvasGridService } from '@app/services/canvas-grid/canvas-grid.service';

@Component({
    selector: 'app-sidebar-grid',
    templateUrl: './sidebar-grid.component.html',
    styleUrls: ['./sidebar-grid.component.scss'],
})
export class SidebarGridComponent implements OnInit {
    maxSquareWidth: number = GridConstants.MAX_SQUARE_WIDTH;
    minSquareWidth: number = GridConstants.MIN_SQUARE_WIDTH;
    minOpacityValue: number = GridConstants.MIN_OPACITY_VALUE;
    maxOpacityValue: number = GridConstants.MAX_OPACITY_VALUE;
    tickInterval: number = GridConstants.TICK_INTERVAL;
    squareWidth: number = GridConstants.DEFAULT_SQUARE_WIDTH;
    opacityValue: number = GridConstants.DEFAULT_OPACITY;
    visibilityValue: boolean = false;

    @ViewChild('toggleGrid', { static: false }) toggleGrid: ElementRef<HTMLElement>;

    @Output() squareWidthChanged: EventEmitter<number> = new EventEmitter();
    @Output() opacityValueChanged: EventEmitter<number> = new EventEmitter();
    @Output() visibilityValueChanged: EventEmitter<boolean> = new EventEmitter();

    constructor(public canvasGridService: CanvasGridService) {}

    ngOnInit(): void {
        this.squareWidthChanged.subscribe((newWidth: number) => this.canvasGridService.setSquareWidth(newWidth));
        this.opacityValueChanged.subscribe((newOpacityValue: number) => this.canvasGridService.setOpacityValue(newOpacityValue));
        this.visibilityValueChanged.subscribe((newVisibilityValue: boolean) => this.canvasGridService.setVisibility(newVisibilityValue));
    }

    changeSliderVisibilityInput(): void {
        this.visibilityValue = this.canvasGridService.gridVisibility;
        console.log('this is ok ' + this.visibilityValue);
    }

    emitSquareWidth(): void {
        this.squareWidthChanged.emit(this.squareWidth);
    }

    emitOpacityValue(): void {
        this.opacityValueChanged.emit(this.opacityValue);
    }

    emitVisibilityValue(): void {
        this.visibilityValueChanged.emit(this.visibilityValue);
    }
}
