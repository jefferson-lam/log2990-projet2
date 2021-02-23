import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import * as MouseConstants from '@app/constants/mouse-constants';
import { DrawingService } from '@app/services/drawing/drawing.service';

@Injectable({
  providedIn: 'root',
})

export class AerosolService extends Tool{
  private pathData: Vec2[];
  lineWidth: number;
  waterDropWidth: number;
  emissionCount: number;
  randomAngle: number;
  randomRadius: number;
  secondaryColor: string = '#2F2A36';

  constructor(drawingService: DrawingService) {
    super(drawingService);
    this.clearPath();
    this.lineWidth = 70;
    this.emissionCount = 50
    this.waterDropWidth = 1;
  }

  onMouseDown(event: MouseEvent): void {
    this.mouseDown = event.button === MouseConstants.MouseButton.Left;
    if (this.mouseDown) {
      this.clearPath();

      this.mouseDownCoord = this.getPositionFromMouse(event);
      this.pathData.push(this.mouseDownCoord);
      this.airBrushCircle(this.drawingService.baseCtx, event);
    }
  }

  onMouseUp(event: MouseEvent): void {
    if (this.mouseDown) {
      const mousePosition = this.getPositionFromMouse(event);
      this.pathData.push(mousePosition);
    }
    this.mouseDown = false;
    this.clearPath();
  }

  onMouseMove(event: MouseEvent): void {
    if (this.mouseDown) {
      const mousePosition = this.getPositionFromMouse(event);
      this.pathData.push(mousePosition);
      this.airBrushCircle(this.drawingService.baseCtx, event);
    }
  }

  onMouseLeave(event: MouseEvent): void {
    this.drawingService.clearCanvas(this.drawingService.previewCtx);
    this.clearPath();
  }

  onMouseEnter(event: MouseEvent): void {
    if (event.buttons === MouseConstants.MouseButton.Left) {
      this.mouseDown = false;
    }
  }

  private getRandomEmission(radius: number): Vec2 {
    this.randomAngle = Math.random() * (2 * Math.PI);
    this.randomRadius = Math.random() * radius;

    return {x: Math.cos(this.randomAngle) * this.randomRadius,
            y: Math.sin(this.randomAngle) * this.randomRadius};
  }

  private airBrushCircle(ctx: CanvasRenderingContext2D, event: MouseEvent): void {
    const mousePosition = this.getPositionFromMouse(event);
    console.log(this.emissionCount);
    for (var i = 0; i < this.emissionCount; i++){
      let randomEmission = this.getRandomEmission(this.lineWidth/2);
      let x = mousePosition.x + randomEmission.x;
      let y = mousePosition.y + randomEmission.y;
      ctx.fillStyle = this.secondaryColor;
      ctx.fillRect(x, y, this.waterDropWidth, this.waterDropWidth);
    };
  }

  private clearPath(): void {
    this.pathData = [];
  }

  setWaterDropWidth(width: number): void {
    this.waterDropWidth = width;
  }

  setEmissionCount(newEmissionCount: number): void {
    this.emissionCount = newEmissionCount;
  }

  setLineWidth(width: number): void {
    this.lineWidth = width;
  }

  setSecondaryColor(newColor: string): void {
    this.secondaryColor = newColor;
  }
}
