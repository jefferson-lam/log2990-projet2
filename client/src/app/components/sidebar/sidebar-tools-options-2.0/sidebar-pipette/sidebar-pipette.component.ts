import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ColorService } from '@app/services/color/color.service';
import { PipetteService } from '@app/services/tools/pipette-service';

@Component({
  selector: 'app-sidebar-pipette',
  templateUrl: './sidebar-pipette.component.html',
  styleUrls: ['./sidebar-pipette.component.scss']
})
export class SidebarPipetteComponent implements OnInit {
  ctx: CanvasRenderingContext2D;
  colorService: ColorService;
  rawData: ImageData = new ImageData(10, 10);
  previewData: ImageData = new ImageData(100, 100);
  centerPixelData: ImageData = new ImageData(1, 1);

  constructor(colorService: ColorService, public pipetteService: PipetteService) { }

  @ViewChild('canvas', { static: true })
  canvas: ElementRef<HTMLCanvasElement>;

  ngOnInit(): void {
    this.pipetteService.centerPixelDataSource.subscribe((pixelData: ImageData) => {
      this.centerPixelData = pixelData;
    });
    this.pipetteService.previewDataObservable.subscribe((previewData: ImageData) => {
      this.rawData = previewData;
      this.drawPreview();
    });
  }

  drawPreview(): void {
    if (!this.ctx) {
      this.ctx = this.canvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
    }
    console.log(this.rawData.data);
    
    // Tentative pour agrandir le 10x10 a 100x100
    let k = 0;
    // Iterate through every pixel of rawData (10x10)
    for(let i = 0; i < this.rawData.data.length; i += 4) {
      //Iterate through each group of 10 pixel of previewData (100x100)
      for(let j = 0; j < 10; j++) {
        this.previewData.data[k] = this.rawData.data[i] //R
        this.previewData.data[k + 1] = this.rawData.data[i + 1] //G
        this.previewData.data[k + 2] = this.rawData.data[i + 2] //B
        k += 4;
      }
    }

    
    // this.ctx.fillStyle = 'rgb(255, 0, 0)';
    // this.ctx.fillRect(0, 0, 100, 100);
    // this.ctx.lineWidth = 2;
    // this.ctx.strokeStyle = 'rgb(0, 0, 0)';
    // this.ctx.strokeRect(0, 0, 100, 100);

    // this.ctx.lineWidth = 0;
    // this.ctx.fillStyle = 'rgb(255, 255, 255)';
    // this.ctx.fillRect(49, 49, 5, 5);
    // this.ctx.lineWidth = 2;
    // this.ctx.strokeStyle = 'rgb(0, 0, 0)';
    // this.ctx.strokeRect(45, 45, 5, 5);

    this.ctx.putImageData(this.previewData, 0, 0);
  }
}
