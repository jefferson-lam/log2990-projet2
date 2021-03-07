import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ColorService } from '@app/services/color/color.service';
import { PipetteService } from '@app/services/tools/pipette-service';

@Component({
  selector: 'app-sidebar-pipette',
  templateUrl: './sidebar-pipette.component.html',
  styleUrls: ['./sidebar-pipette.component.scss']
})
export class SidebarPipetteComponent implements OnInit {
  private ctx: CanvasRenderingContext2D;
  pipetteService: PipetteService;
  colorService: ColorService;

  constructor(colorService: ColorService, pipetteService: PipetteService) { }

  @ViewChild('canvas', { static: true })
  canvas: ElementRef<HTMLCanvasElement>;

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.drawPreview();
}

//   ngOnChanges(changes: SimpleChanges): void {
//     if (changes.savedColors) {
//         this.paintData();
//     }
// }

  // getCurrentPipetteColor() {
  //   console.log(this.pipetteService.currentColor);
  //   return this.pipetteService.currentColor;
  // }

  drawPreview(): void {
    if (!this.ctx) {
      this.ctx = this.canvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
    }
    //let canvas = document.getElementById('canvas') as HTMLCanvasElement;
    //let pixelData = this.getCurrentCenterPixelData();
    let previewData = this.getCurrentPreviewData();

    this.ctx.putImageData(previewData, 0, 0);
  }

  getCurrentCenterPixelData() {
    return this.pipetteService.centerPixelData;
  }

  getCurrentPreviewData() {
    return this.pipetteService.previewData;
  }
}
