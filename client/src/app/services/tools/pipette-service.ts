import { Injectable } from '@angular/core';
import { Rgba } from '@app/classes/rgba';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import * as MouseConstants from '@app/constants/mouse-constants';
import * as PipetteConstants from '@app/constants/pipette-constants';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ColorService } from '../color/color.service';
import { ToolManagerService } from '../manager/tool-manager-service';
import { UndoRedoService } from '../undo-redo/undo-redo.service';

@Injectable({
  providedIn: 'root'
})
export class PipetteService extends Tool {
  mousePosition: Vec2;
  ctx: CanvasRenderingContext2D;
  //currentColor: Rgba = { red: '255', green: '255', blue: '255', alpha: 1};
  centerPixelData: ImageData;
  previewData: ImageData;
  colorService: ColorService;
  toolManager: ToolManagerService;
  mouseDown: boolean = false;
  leftMouseUp: boolean;
  rightMouseUp: boolean;
  inBound: boolean;

  constructor(drawingService: DrawingService, undoRedoService: UndoRedoService) {
    super(drawingService, undoRedoService);
  }

  onMouseMove(event: MouseEvent) {
    if(this.inBound) {
      this.mousePosition = this.getPositionFromMouse(event);
      let pixelData = this.drawingService.baseCtx.getImageData(this.mousePosition.x, this.mousePosition.y, 1, 1);
      let contextData = this.drawingService.baseCtx.getImageData(this.mousePosition.x - 5, this.mousePosition.y - 5, 10, 10);
      this.setCenterPixelData(pixelData);
      this.setPreviewData(contextData);
      //this.setCurrentColor(this.pixelDataToRgba(pixelData));
    }
  }

  onMouseClick(event: MouseEvent) {
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

  pixelDataToRgba(data: ImageData) {
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

  // setCurrentColor(color: Rgba) {
  //   this.currentColor = color;
  // }

  setPrimaryColor(color: Rgba) {
    this.colorService.setPrimaryColor(color);
  }

  setSecondaryColor(color: Rgba) {
    this.colorService.setSecondaryColor(color);
  }

  setCenterPixelData(data: ImageData) {
    this.centerPixelData = data;
  }

  setPreviewData(data: ImageData) {
    this.previewData = data;
  }
}
