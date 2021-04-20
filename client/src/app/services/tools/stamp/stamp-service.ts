import { Injectable } from '@angular/core';
import { Command } from '@app/classes/command';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import * as MouseConstants from '@app/constants/mouse-constants';
import * as StampConstants from '@app/constants/stamp-constants';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { StampCommand } from '@app/services/tools/stamp/stamp-command';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class StampService extends Tool {
    position: Vec2;
    stampState: boolean;
    imageSource: string;
    realRotationValues: number;
    rotationAngle: number;
    imageZoomFactor: number;
    private degreesRotation: number;

    angleSubject: Subject<number>;

    private previewCommand: StampCommand;

    constructor(drawingService: DrawingService, undoRedoService: UndoRedoService) {
        super(drawingService, undoRedoService);
        this.imageSource = 'assets/stamp_1.svg';
        this.realRotationValues = StampConstants.MIN_ANGLE;
        this.rotationAngle = StampConstants.INIT_ROTATION_ANGLE;
        this.imageZoomFactor = StampConstants.INIT_REAL_ZOOM;
        this.degreesRotation = StampConstants.INIT_DEGREES_ANGLE_COUNTER;
        this.angleSubject = new Subject<number>();
        this.position = { x: 0, y: 0 };
        this.previewCommand = new StampCommand(this.drawingService.previewCtx, this);
    }

    onMouseDown(event: MouseEvent): void {
        this.inUse = event.button === MouseConstants.MouseButton.Left;
        if (this.inUse) {
            this.position = this.getPositionFromMouse(event);
        }
    }

    onMouseUp(event: MouseEvent): void {
        if (this.inUse) {
            this.position = this.getPositionFromMouse(event);
            const command: Command = new StampCommand(this.drawingService.baseCtx, this);
            this.undoRedoService.executeCommand(command);
        }
        this.inUse = false;
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
    }

    onMouseMove(event: MouseEvent): void {
        this.position = this.getPositionFromMouse(event);
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        this.previewCommand.setValues(this.drawingService.previewCtx, this);
        this.previewCommand.execute();
    }

    onMouseLeave(): void {
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
    }

    onMouseEnter(event: MouseEvent): void {
        if (event.buttons === MouseConstants.MouseButton.Middle && this.inUse) {
            this.inUse = true;
        } else {
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.inUse = false;
        }
    }

    onMouseWheel(event: WheelEvent): void {
        event.preventDefault();
        this.position = this.getPositionFromMouse(event);
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        this.changeRotationAngle(event);
        this.previewCommand.setValues(this.drawingService.previewCtx, this);
        this.previewCommand.execute();
    }

    changeRotationAngleOnAlt(): void {
        this.degreesRotation = 1;
    }

    changeRotationAngleNormal(): void {
        this.degreesRotation = StampConstants.INIT_DEGREES_ANGLE_COUNTER;
    }

    changeRotationAngle(event: WheelEvent): void {
        if (event.deltaY > 0) {
            this.realRotationValues -= this.degreesRotation;
            this.rotationAngle = this.realRotationValues * StampConstants.CONVERT_RAD;
        } else {
            this.realRotationValues += this.degreesRotation;
            this.rotationAngle = this.realRotationValues * StampConstants.CONVERT_RAD;
        }
        this.setAngleSliderValue(this.realRotationValues);
    }

    setAngleSliderValue(angle: number): void {
        if (angle > StampConstants.MAX_ANGLE) {
            this.realRotationValues = angle - StampConstants.MAX_ANGLE - 1;
        }
        if (angle < StampConstants.MIN_ANGLE) {
            this.realRotationValues = angle + StampConstants.MAX_ANGLE + 1;
        }
        this.angleSubject.next(this.realRotationValues);
    }

    setImageSource(newImageSource: string): void {
        this.imageSource = newImageSource;
    }

    setImageZoomFactor(newZoomFactor: number): void {
        this.imageZoomFactor = newZoomFactor;
    }

    setAngleRotation(newAngle: number): void {
        this.rotationAngle = newAngle * StampConstants.CONVERT_RAD;
    }

    onToolChange(): void {
        this.onMouseUp({} as MouseEvent);
    }

    drawCursor(position: Vec2): void {
        this.position = position;
        this.previewCommand.setValues(this.drawingService.previewCtx, this);
        this.previewCommand.execute();
    }
}
