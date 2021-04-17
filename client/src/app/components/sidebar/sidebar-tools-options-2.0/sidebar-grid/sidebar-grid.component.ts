import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { MatSlider } from '@angular/material/slider';
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
    opacityTickInterval: number = GridConstants.OPACITY_TICK_INTERVAL;
    widthTickInterval: number = GridConstants.SQUARE_WIDTH_INTERVAL;
    squareWidth: number = GridConstants.DEFAULT_SQUARE_WIDTH;
    opacityValue: number = GridConstants.DEFAULT_OPACITY;
    isGridOptionsDisplayed: boolean;

    @ViewChild('toggleGrid') toggleGrid: MatSlideToggle;
    @ViewChild('widthSlider') widthSlider: MatSlider;

    @Output() squareWidthChanged: EventEmitter<number> = new EventEmitter();
    @Output() opacityValueChanged: EventEmitter<number> = new EventEmitter();
    @Output() visibilityValueChanged: EventEmitter<boolean> = new EventEmitter();

    constructor(public canvasGridService: CanvasGridService) {}

    ngOnInit(): void {
        this.squareWidthChanged.subscribe((newWidth: number) => this.canvasGridService.setSquareWidth(newWidth));
        this.opacityValueChanged.subscribe((newOpacityValue: number) => this.canvasGridService.setOpacityValue(newOpacityValue));
        this.visibilityValueChanged.subscribe((newVisibilityValue: boolean) => this.canvasGridService.setVisibility(newVisibilityValue));
        this.canvasGridService.gridVisibilitySubject.asObservable().subscribe((gridVisibility) => {
            this.toggleGrid.checked = gridVisibility;
        });

        this.canvasGridService.squareWidthSubject.asObservable().subscribe((width) => {
            this.widthSlider.value = width;
            this.squareWidth = width;
        });
        this.isGridOptionsDisplayed = this.canvasGridService.isGridDisplayed;
        this.squareWidth = this.canvasGridService.squareWidth;
        this.opacityValue = this.canvasGridService.opacityValue;
    }

    emitSquareWidth(): void {
        this.squareWidthChanged.emit(this.squareWidth);
    }

    emitOpacityValue(): void {
        this.opacityValueChanged.emit(this.opacityValue);
    }

    emitVisibilityValue(): void {
        this.visibilityValueChanged.emit(this.isGridOptionsDisplayed);
    }
}
