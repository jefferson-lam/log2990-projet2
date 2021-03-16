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
  zoomedCtx: CanvasRenderingContext2D;
  colorService: ColorService;
  rawData: ImageData = new ImageData(10, 10);
  previewData: ImageData = new ImageData(100, 100);
  //centerPixelData: ImageData = new ImageData(1, 1);

  constructor(colorService: ColorService, public pipetteService: PipetteService) { }

  @ViewChild('canvas', { static: true })
  canvas: ElementRef<HTMLCanvasElement>;

  ngOnInit(): void {
    // this.pipetteService.centerPixelDataSource.subscribe((pixelData: ImageData) => {
    //   this.centerPixelData = pixelData;
    // });
    this.pipetteService.previewDataObservable.subscribe((previewData: ImageData) => {
      this.rawData = previewData;
      this.drawPreview();
    });
  }

  drawPreview(): void {
    if (!this.ctx) {
      this.ctx = this.canvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
    }

    //Zoom ImageData from 10x10 to 100x100
    //Iterate through every pixel of previewData (100x100)
    for(let i = 0; i < this.previewData.data.length; i += 4) {
        let bigRow = this.findBigRow(i, 100); // row position in big matrix
        let bigColumn = this.findBigColumn(i, 100); // column position in big matrix

        let smallRow = Math.floor(bigRow / 10); // row position from small matrix
        let smallColumn = Math.floor(bigColumn / 10); // column position from small matrix
        let index = this.findIndexInSmallArray(smallRow, smallColumn, 10);

        this.previewData.data[i] = this.rawData.data[index]; //R
        this.previewData.data[i + 1] = this.rawData.data[index + 1]; //G
        this.previewData.data[i + 2] = this.rawData.data[index + 2]; //B
        this.previewData.data[i + 3] = this.rawData.data[index + 3]; //A
    }
    this.ctx.putImageData(this.previewData, 0, 0)
  }

  findBigRow(rowCoord: number, width: number) {
    return Math.floor(rowCoord / width);
  }

  findBigColumn(rowCoord: number, width: number) {
    return (rowCoord - width);
  }

  findIndexInSmallArray(row: number, column: number, width: number) {
    return (row * width + column) * 4;
  }
}
