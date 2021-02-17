import { Component, EventEmitter, Output } from '@angular/core';
import { SettingsManagerService } from '@app/services/manager/settings-manager';
import { ToolManagerService } from '@app/services/manager/tool-manager-service';

@Component({
  selector: 'app-sidebar-line',
  templateUrl: './sidebar-line.component.html',
  styleUrls: ['./sidebar-line.component.scss']
})
export class SidebarLineComponent {
  max: number = 200;
  min: number = 1;
  tickInterval: number = 1;
  toolSize: number | undefined;
  withJunction: boolean;
  junctionRadius: number | undefined;

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

  setMax(numberInput: number) {
    return numberInput;
  }

  setToolSize() {this.toolSizeChanged.emit(this.toolSize);}
  setFillMode(newFillMode: number) {this.fillModeChanged.emit(newFillMode);}
  setWithJunction() {this.withJunctionChanged.emit(this.withJunction); console.log(this.withJunction);}
  setJunctionRadius() {this.junctionRadiusChanged.emit(this.junctionRadius);}
}
