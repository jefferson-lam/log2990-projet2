import { Component, EventEmitter, Output } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { SettingsManagerService } from '@app/services/manager/settings-manager';
import { ToolManagerService } from '@app/services/manager/tool-manager-service';

@Component({
  selector: 'app-sidebar-rectangle',
  templateUrl: './sidebar-rectangle.component.html',
  styleUrls: ['./sidebar-rectangle.component.scss']
})
export class SidebarRectangleComponent  {
  max: number = 200;
  min: number = 1;
  tickInterval: number = 1;
  toolSize: number | undefined;
  fillMode: number | undefined;
  currentTool: Tool;

  @Output() toolSizeChanged: EventEmitter<number> = new EventEmitter();
  @Output() fillModeChanged: EventEmitter<number> = new EventEmitter();

  constructor(public settingsManager: SettingsManagerService, public toolManagerService: ToolManagerService) {
    this.toolSizeChanged.subscribe((newSize: number) => settingsManager.setLineWidth(newSize));
    this.fillModeChanged.subscribe((newFillMode: number) => settingsManager.setFillMode(newFillMode));
  }

  setMax(numberInput: number) {
    return numberInput;
  }

  setToolSize() {
    console.log(this.toolSize);
    this.toolSizeChanged.emit(this.toolSize);
  }

  setFillMode(newFillMode: number) {
    console.log(newFillMode);
    this.fillModeChanged.emit(newFillMode);
  }
}
