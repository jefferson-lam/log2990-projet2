import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DrawingService } from '@app/services/drawing/drawing.service';

@Component({
    selector: 'app-selection',
    templateUrl: './selection.component.html',
    styleUrls: ['./selection.component.scss'],
})
export class SelectionComponent implements OnInit {
    @ViewChild('selectionCanvas', { static: false }) selectionCanvas: ElementRef<HTMLCanvasElement>;
    private selectionCtx: CanvasRenderingContext2D;
    // private selectionCanvasSize: Vec2 = { x: 0, y: 0 };

    constructor(private drawingService: DrawingService) {}

    ngAfterViewInit(): void {
        this.selectionCtx = this.selectionCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.drawingService.selectionCtx = this.selectionCtx;
        this.drawingService.selectionCanvas = this.selectionCanvas.nativeElement;
    }

    ngOnInit(): void {}
}
