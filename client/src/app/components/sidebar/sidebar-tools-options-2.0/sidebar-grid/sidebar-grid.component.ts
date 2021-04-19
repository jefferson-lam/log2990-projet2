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
    maxSquareWidth: number;
    minSquareWidth: number;
    minOpacityValue: number;
    maxOpacityValue: number;
    opacityTickInterval: number;
    widthTickInterval: number;
    squareWidth: number;
    opacityValue: number;
    isGridOptionsDisplayed: boolean;

    @ViewChild('toggleGrid') private toggleGrid: MatSlideToggle;
    @ViewChild('widthSlider') private widthSlider: MatSlider;

    @Output() private squareWidthChanged: EventEmitter<number>;
    @Output() opacityValueChanged: EventEmitter<number>;
    @Output() visibilityValueChanged: EventEmitter<boolean>;

    constructor(public canvasGridService: CanvasGridService) {
        this.maxSquareWidth = GridConstants.MAX_SQUARE_WIDTH;
        this.minSquareWidth = GridConstants.MIN_SQUARE_WIDTH;
        this.minOpacityValue = GridConstants.MIN_OPACITY_VALUE;
        this.maxOpacityValue = GridConstants.MAX_OPACITY_VALUE;
        this.opacityTickInterval = GridConstants.OPACITY_TICK_INTERVAL;
        this.widthTickInterval = GridConstants.SQUARE_WIDTH_INTERVAL;
        this.squareWidth = GridConstants.DEFAULT_SQUARE_WIDTH;
        this.opacityValue = GridConstants.DEFAULT_OPACITY;
        this.squareWidthChanged = new EventEmitter();
        this.opacityValueChanged = new EventEmitter();
        this.visibilityValueChanged = new EventEmitter();
    }

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
