import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';

// TODO : Déplacer ça dans un fichier séparé accessible par tous
export enum MouseButton {
    Left = 0,
    Middle = 1,
    Right = 2,
    Back = 3,
    Forward = 4,
}

enum CornerIndex {
    start = 0,
    end = 1,
    substitute = 2,
}

// TODO: CHANGE WAY TO GET COLOR
const primaryColor = '#B5CF60';
const secondColor = '#2F2A36';

// TODO: Find way to get fill mode
enum FillMode {
    OUTLINE = 0,
    FILL_ONLY = 1,
    OUTLINE_FILL = 2,
}

// TODO: Find way to get line width
const lineWidth = 5;

@Injectable({
    providedIn: 'root',
})
export class EllipseService extends Tool {
    pathData: Vec2[];
    isCircle: boolean;
    fillMode: FillMode;

    constructor(drawingService: DrawingService) {
        const MAX_PATH_DATA_SIZE = 2;
        super(drawingService);
        this.isCircle = false;
        this.fillMode = FillMode.OUTLINE_FILL;
        this.pathData = new Array<Vec2>(MAX_PATH_DATA_SIZE);
        this.clearPath();
    }

    onMouseDown(event: MouseEvent): void {
        this.mouseDown = event.button === MouseButton.Left;
        if (this.mouseDown) {
            this.mouseDownCoord = this.getPositionFromMouse(event);
            this.pathData[CornerIndex.start] = this.mouseDownCoord;
        }
    }

    onMouseUp(event: MouseEvent): void {
        if (this.mouseDown) {
            const mousePosition = this.getPositionFromMouse(event);
            this.pathData[CornerIndex.end] = mousePosition;
            this.drawEllipse(this.drawingService.baseCtx, this.pathData, primaryColor);
        }
        this.mouseDown = false;
        this.clearPath();
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
    }

    onMouseMove(event: MouseEvent): void {
        if (this.mouseDown) {
            const mousePosition = this.getPositionFromMouse(event);
            this.pathData[CornerIndex.end] = mousePosition;
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.drawEllipse(this.drawingService.previewCtx, this.pathData, primaryColor);
        }
    }

    onKeyDown(event: KeyboardEvent): void {
        if (this.mouseDown) {
            if (event.key === 'Shift') {
                this.isCircle = true;
                this.drawingService.clearCanvas(this.drawingService.previewCtx);
                this.drawEllipse(this.drawingService.previewCtx, this.pathData, primaryColor);
            }
        }
    }

    onKeyUp(event: KeyboardEvent): void {
        if (this.mouseDown) {
            if (event.key === 'Shift') {
                this.isCircle = false;
                this.drawingService.clearCanvas(this.drawingService.previewCtx);
                this.drawEllipse(this.drawingService.previewCtx, this.pathData, primaryColor);
            }
        } else {
            this.isCircle = false;
        }
    }

    private drawEllipse(ctx: CanvasRenderingContext2D, path: Vec2[], color: string): void {
        let xRadius = Math.abs((path[CornerIndex.end].x - path[CornerIndex.start].x) / 2);
        let yRadius = Math.abs((path[CornerIndex.end].y - path[CornerIndex.start].y) / 2);
        const fillMethod = this.fillMode;
        if (this.isCircle) {
            const longestSide = Math.max(Math.abs(xRadius), Math.abs(yRadius));
            xRadius = yRadius = longestSide;
        }
        this.drawTypeEllipse(ctx, path, color, secondColor, xRadius, yRadius, fillMethod);
    }

    private drawTypeEllipse(
        ctx: CanvasRenderingContext2D,
        path: Vec2[],
        fillColor: string,
        borderColor: string,
        xRadius: number,
        yRadius: number,
        fillMethod: number,
    ): void {
        const START_POS_X = (path[CornerIndex.end].x + path[CornerIndex.start].x) / 2;
        const START_POS_Y = (path[CornerIndex.end].y + path[CornerIndex.start].y) / 2;
        const ROTATION = 0;
        const START_ANGLE = 0;
        const END_ANGLE = Math.PI * 2;
        ctx.beginPath();
        ctx.ellipse(START_POS_X, START_POS_Y, xRadius, yRadius, ROTATION, START_ANGLE, END_ANGLE);
        if (fillMethod !== FillMode.OUTLINE) {
            ctx.fillStyle = fillColor;
            ctx.fill();
        }
        if (fillMethod !== FillMode.FILL_ONLY) {
            ctx.strokeStyle = borderColor;
            ctx.lineWidth = lineWidth;
            ctx.stroke();
        }
    }

    private clearPath(): void {
        this.pathData.fill({ x: 0, y: 0 });
    }
}
