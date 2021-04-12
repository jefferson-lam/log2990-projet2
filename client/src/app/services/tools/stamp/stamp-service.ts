import { Injectable } from '@angular/core';
import { Command } from '@app/classes/command';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import * as MouseConstants from '@app/constants/mouse-constants';
import * as PolygoneConstants from '@app/constants/polygone-constants';
import * as StampConstants from '@app/constants/stamp-constants';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { StampCommand } from '@app/services/tools/stamp/stamp-command';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class StampService extends Tool {
    cornerCoords: Vec2[];
    stampState: boolean;
    imageSource: string;
    realRotationValues: number;
    rotationAngle: number;
    imageZoomFactor: number;
    degreesRotation: number;

    angleSubject: Subject<number>;

    previewCommand: StampCommand;

    constructor(drawingService: DrawingService, undoRedoService: UndoRedoService) {
        super(drawingService, undoRedoService);
        const MAX_PATH_DATA_SIZE = 2;
        this.imageSource = 'assets/stamp_1.svg';
        this.realRotationValues = StampConstants.MIN_ANGLE;
        this.rotationAngle = StampConstants.INIT_ROTATION_ANGLE;
        this.imageZoomFactor = StampConstants.INIT_REAL_ZOOM;
        this.degreesRotation = StampConstants.INIT_DEGREES_ANGLE_COUNTER;
        this.angleSubject = new Subject<number>();
        this.cornerCoords = new Array<Vec2>(MAX_PATH_DATA_SIZE);
        this.clearCornerCoords();
        this.previewCommand = new StampCommand(this.drawingService.previewCtx, this);
    }

    onMouseDown(event: MouseEvent): void {
        this.inUse = event.button === MouseConstants.MouseButton.Left;
        if (this.inUse) {
            this.cornerCoords[PolygoneConstants.START_INDEX] = this.getPositionFromMouse(event);
        }
    }

    onMouseUp(event: MouseEvent): void {
        if (this.inUse) {
            this.cornerCoords[PolygoneConstants.START_INDEX] = this.getPositionFromMouse(event);
            const command: Command = new StampCommand(this.drawingService.baseCtx, this);
            this.undoRedoService.executeCommand(command);
        }
        this.inUse = false;
        this.clearCornerCoords();
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
    }

    onMouseMove(event: MouseEvent): void {
        this.cornerCoords[PolygoneConstants.START_INDEX] = this.getPositionFromMouse(event);
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        this.previewCommand.setValues(this.drawingService.previewCtx, this);
        this.previewCommand.execute();
    }

    onMouseLeave(event: MouseEvent): void {
        if (this.inUse) {
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.cornerCoords[PolygoneConstants.END_INDEX] = this.getPositionFromMouse(event);
            this.previewCommand.setValues(this.drawingService.previewCtx, this);
            this.previewCommand.execute();
        } else {
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.cornerCoords[PolygoneConstants.END_INDEX] = this.getPositionFromMouse(event);
        }
    }

    onMouseEnter(event: MouseEvent): void {
        if (event.buttons === MouseConstants.PRIMARY_BUTTON && this.inUse) {
            this.inUse = true;
        } else {
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.inUse = false;
        }
    }

    onMouseWheel(event: WheelEvent): void {
        this.cornerCoords[PolygoneConstants.START_INDEX] = this.getPositionFromMouse(event);
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
            this.realRotationValues = angle - StampConstants.MAX_ANGLE;
        }
        if (angle < StampConstants.MIN_ANGLE) {
            this.realRotationValues = angle + StampConstants.MAX_ANGLE;
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

    private clearCornerCoords(): void {
        this.cornerCoords.fill({ x: 0, y: 0 });
    }
}
