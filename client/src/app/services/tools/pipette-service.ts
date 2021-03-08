import { Injectable } from '@angular/core';
import { Rgba } from '@app/classes/rgba';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import * as MouseConstants from '@app/constants/mouse-constants';
import * as PipetteConstants from '@app/constants/pipette-constants';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { ColorService } from '../color/color.service';
import { ToolManagerService } from '../manager/tool-manager-service';
import { UndoRedoService } from '../undo-redo/undo-redo.service';

@Injectable({
  providedIn: 'root'
})
export class PipetteService extends Tool {
  mousePosition: Vec2;
  ctx: CanvasRenderingContext2D;
  toolManager: ToolManagerService;
  mouseDown: boolean = false;
  leftMouseUp: boolean;
  rightMouseUp: boolean;
  inBound: boolean;

  
  centerPixelData: ImageData = new ImageData(10, 10);
  centerPixelDataSource: Subject<ImageData> = new BehaviorSubject<ImageData>(this.centerPixelData);
  centerPixelDataObservable: Observable<ImageData> = this.centerPixelDataSource.asObservable();
  
  previewData: ImageData = new ImageData(10, 10);
  previewDataSource: Subject<ImageData> = new BehaviorSubject<ImageData>(this.previewData);
  previewDataObservable: Observable<ImageData> = this.centerPixelDataSource.asObservable();

  constructor(drawingService: DrawingService, undoRedoService: UndoRedoService, public colorService: ColorService) {
    super(drawingService, undoRedoService);
  }

  onMouseMove(event: MouseEvent): void {
    if(this.inBound) {
      this.mousePosition = this.getPositionFromMouse(event);
      let pixelData = this.drawingService.baseCtx.getImageData(this.mousePosition.x, this.mousePosition.y, 1, 1);
      let contextData = this.drawingService.baseCtx.getImageData(Math.max(0, this.mousePosition.x - 5), Math.max(0, this.mousePosition.y - 5), 10 , 10);
      this.setCenterPixelData(pixelData);
      this.setPreviewData(contextData);
    }
  }

  onMouseClick(event: MouseEvent): void {
    this.ctx = this.drawingService.canvas.getContext('2d') as CanvasRenderingContext2D;
    this.mousePosition = this.getPositionFromMouse(event);
    let pixelData = this.ctx.getImageData(this.mousePosition.x, this.mousePosition.y, 1, 1);
    
    if(event.button === MouseConstants.MouseButton.Left && this.inBound) {
      this.setPrimaryColor(this.pixelDataToRgba(pixelData));
    } 
    if(event.button === MouseConstants.MouseButton.Right && this.inBound) {
      this.setSecondaryColor(this.pixelDataToRgba(pixelData));
    }
  }

  onMouseLeave(event: MouseEvent): void {
    this.inBound = false;
  }

  onMouseEnter(event: MouseEvent): void {
    this.inBound = true;
  }

  pixelDataToRgba(data: ImageData): Rgba {
    let red = data.data[PipetteConstants.RED_POSTITION];
    let green = data.data[PipetteConstants.GREEN_POSTITION];
    let blue = data.data[PipetteConstants.BLUE_POSTITION];
    let alpha = data.data[PipetteConstants.ALPHA_POSTITION];

    let color = { red: red.toString(), green: green.toString(), blue: blue.toString(), alpha: alpha };
    return color;
  }

  convertRgbaToString(color: Rgba): string {
    return 'rgba(' + color.red + ', ' + color.green + ', ' + color.blue + ', ' + color.alpha + ')';
  }

  setPrimaryColor(color: Rgba): void{
    this.colorService.setPrimaryColor(color);
  }

  setSecondaryColor(color: Rgba): void {
    this.colorService.setSecondaryColor(color);
  }

  setCenterPixelData(data: ImageData): void {
    this.centerPixelData = data;
    this.centerPixelDataSource.next(this.centerPixelData);
  }

  setPreviewData(data: ImageData): void {
    this.previewData = data;
    this.previewDataSource.next(this.previewData);
  }
}
