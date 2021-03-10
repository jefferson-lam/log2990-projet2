import { CdkDragEnd } from '@angular/cdk/drag-drop';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { RectangleSelectionService } from '@app/services/tools/selection/rectangle-selection-service';

@Component({
    selector: 'app-selection',
    templateUrl: './selection.component.html',
    styleUrls: ['./selection.component.scss'],
})
export class SelectionComponent implements OnInit {
    @ViewChild('selectionCanvas', { static: false }) selectionCanvas: ElementRef<HTMLCanvasElement>;
    private selectionCtx: CanvasRenderingContext2D;

    constructor(private drawingService: DrawingService, public rectangleSelectionService: RectangleSelectionService) {}

    ngAfterViewInit(): void {
        this.selectionCtx = this.selectionCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.drawingService.selectionCtx = this.selectionCtx;
        this.drawingService.selectionCanvas = this.selectionCanvas.nativeElement;
    }

    ngOnInit(): void {}

    setPosition(event: CdkDragEnd) {
        this.selectionCanvas.nativeElement.style.top = parseInt(this.selectionCanvas.nativeElement.style.top) + event.distance.y + 'px';
        this.selectionCanvas.nativeElement.style.left = parseInt(this.selectionCanvas.nativeElement.style.left) + event.distance.x + 'px';
        event.source._dragRef.reset();
    }
}
