import { Component, OnInit } from '@angular/core';
import { ColorService } from '@app/services/color/color.service'
import { PipetteService } from '@app/services/tools/pipette-service'

@Component({
  selector: 'app-sidebar-pipette',
  templateUrl: './sidebar-pipette.component.html',
  styleUrls: ['./sidebar-pipette.component.scss']
})
export class SidebarPipetteComponent implements OnInit {
  pipetteService: PipetteService;
  colorService: ColorService;

  constructor(colorService: ColorService, pipetteService: PipetteService) { }

  ngOnInit(): void {
  }

  getCurrentPipetteColor() {
    console.log('sidebar-pipette');
    this.pipetteService.getCurrentColor();
  }
}
