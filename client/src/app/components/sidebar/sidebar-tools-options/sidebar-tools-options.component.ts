import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { SettingsManagerService } from '@app/services/manager/settings-manager';
import { ToolManagerService } from '@app/services/manager/tool-manager-service';

@Component({
  selector: 'app-sidebar-tools-options',
  templateUrl: './sidebar-tools-options.component.html',
  styleUrls: ['./sidebar-tools-options.component.scss']
})
export class SidebarToolsOptionsComponent implements OnInit {
  max: number = 300;
  min: number = 1;
  tickInterval: number = 1;
  toolSize: number | undefined;
  fillMode: number | undefined;
  withJunction: boolean;
  junctionRadius: number | undefined;
  currentTool: Tool;

  radioGroup = document.getElementById('radioGroup');

  @Input() newTool: Tool; // INPUT FROM SIDEBAR
  @Input() selected: number;

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

  ngOnInit() {
    //this.currentTool = this.settingsManager.getCurrentTool();
  }

  // afterViewInit(): void {
  //   // console.log('wat')
  //   this.currentTool = this.settingsManager.getCurrentTool();
  //   // console.log(this.currentTool)
  // }

  // ngOnChanges(changes: SimpleChanges) {
  //   if(changes.)
  //   console.log('suh dude')
  //   console.log(this.newTool.name)
  //   this.toolSize = this.newTool.lineWidth;
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
    this.withJunctionChanged.emit(this.withJunction);
  }

  setJunctionRadius() {
    console.log(this.junctionRadius);
    this.junctionRadiusChanged.emit(this.junctionRadius);
  }

  // reset() {
  //   this.fillMode = this.currentTool.fillMode;
  // }
  

}
