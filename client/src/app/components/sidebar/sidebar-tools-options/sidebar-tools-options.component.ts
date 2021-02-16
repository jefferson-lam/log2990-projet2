import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { SettingsManagerService } from '@app/services/manager/settings-manager';
import { ToolManagerService } from '@app/services/manager/tool-manager-service';

@Component({
  selector: 'app-sidebar-tools-options',
  templateUrl: './sidebar-tools-options.component.html',
  styleUrls: ['./sidebar-tools-options.component.scss']
})
export class SidebarToolsOptionsComponent implements OnInit {
  max: number = 100;
  min: number = 1;
  tickInterval: number = 1;
  toolSize: number | undefined;
  fillMode: number | undefined;
  withJunction: boolean;
  junctionRadius: number | undefined;

  currentTool: Tool;
  currentToolName: string = 'outil selectionné';

  
  constructor(public settingsManager: SettingsManagerService, public toolManagerService: ToolManagerService) { 
    this.toolSizeChanged.subscribe((newSize: number) => settingsManager.setLineWidth(newSize));
    this.fillModeChanged.subscribe((newFillMode: number) => settingsManager.setFillMode(newFillMode));
    this.withJunctionChanged.subscribe((newWithJunction: boolean) => settingsManager.setWithJunction(newWithJunction));
    this.junctionRadiusChanged.subscribe((newJunctionRadius: number) => settingsManager.setJunctionRadius(newJunctionRadius));
  }

  @Output() toolSizeChanged: EventEmitter<number> = new EventEmitter();
  @Output() fillModeChanged: EventEmitter<number> = new EventEmitter();
  @Output() withJunctionChanged: EventEmitter<boolean> = new EventEmitter();
  @Output() junctionRadiusChanged: EventEmitter<number> = new EventEmitter();

  ngOnInit(): void {
    // this.toolManagerService.activeToolSource.subscribe((newTool: Tool) => {
    //   this.currentTool = newTool;
    // })
  }

  // afterViewInit() {
  //   this.reset();
  // }

  setMax(muberInput: number) {
    if (muberInput >= 200) {
      return Math.round(muberInput / 200) + 'k';
    }
    return muberInput;
  }

  setToolSize() {
    console.log(this.toolSize);
    this.toolSizeChanged.emit(this.toolSize);
  }

  setFillMode(newFillMode: number) {
    console.log(newFillMode);
    this.fillModeChanged.emit(newFillMode);
  }

  setWithJunction() {
    console.log("CARRRRYYYY ONNNNNN, CARRYYYYY ONNNNNNN")
    this.withJunctionChanged.emit(this.withJunction);
  }

  setJunctionRadius() {
    console.log(this.junctionRadius);
    this.junctionRadiusChanged.emit(this.junctionRadius);
  }

  // reset() {
  //   this.toolSize = this.settingsManager.getToolSize()
    
  //   //this.withJunction = this.settingsManager.getWithJunction();
  //   this.junctionRadius = this.settingsManager.getJunctionRadius();
  //   if(this.settingsManager.getFillMode()) {
  //     this.fillMode = this.settingsManager.getFillMode();
  //     document.getElementById('border').
  //   }
  // }
}
