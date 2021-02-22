import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { SettingsManagerService } from '@app/services/manager/settings-manager';

@Component({
  selector: 'app-sidebar-polygone',
  templateUrl: './sidebar-polygone.component.html',
  styleUrls: ['./sidebar-polygone.component.scss'],
})
export class SidebarPolygoneComponent implements OnInit {
  max: number = 200;
  min: number = 1;
  minPolygone: number = 3;
  maxPolygone: number = 12;
  tickInterval: number = 1;
  toolSize: number | undefined;
  polygoneSidesCount: number | undefined;
  fillMode: number | undefined;
  currentTool: Tool;

  @Output() toolSizeChanged: EventEmitter<number> = new EventEmitter();
  @Output() fillModeChanged: EventEmitter<number> = new EventEmitter();

  constructor(public settingsManager: SettingsManagerService) {}

  ngOnInit(): void {
    this.toolSizeChanged.subscribe((newSize: number) => this.settingsManager.setLineWidth(newSize));
    this.fillModeChanged.subscribe((newFillMode: number) => this.settingsManager.setFillMode(newFillMode));
  }

  setMaxSidesPolygone(numberInput: number): number {
    return numberInput;
  }
  setMaxThickness(numberInput: number): number {
    return numberInput;
  }

  emitToolSize(): void {
    this.toolSizeChanged.emit(this.toolSize);
  }

  emitPolygoneSideNumber(): void{

  }

  emitFillMode(newFillMode: number): void {
    this.fillModeChanged.emit(newFillMode);
  }
}
