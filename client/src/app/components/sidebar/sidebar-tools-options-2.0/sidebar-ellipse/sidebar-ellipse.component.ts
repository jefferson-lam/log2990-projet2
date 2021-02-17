import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { SettingsManagerService } from '@app/services/manager/settings-manager';

@Component({
  selector: 'app-sidebar-ellipse',
  templateUrl: './sidebar-ellipse.component.html',
  styleUrls: ['./sidebar-ellipse.component.scss']
})
export class SidebarEllipseComponent implements OnInit {
  max: number = 200;
  min: number = 1;
  tickInterval: number = 1;
  toolSize: number | undefined;
  fillMode: number | undefined;
  currentTool: Tool;

  @Output() toolSizeChanged: EventEmitter<number> = new EventEmitter();
  @Output() fillModeChanged: EventEmitter<number> = new EventEmitter();

  constructor(public settingsManager: SettingsManagerService) {}

  ngOnInit() {
    this.toolSizeChanged.subscribe((newSize: number) => this.settingsManager.setLineWidth(newSize));
    this.fillModeChanged.subscribe((newFillMode: number) => this.settingsManager.setFillMode(newFillMode));
  }
  
  setMax(numberInput: number) {
    return numberInput;
  }

  emitToolSize() {
    this.toolSizeChanged.emit(this.toolSize);
  }

  emitFillMode(newFillMode: number) {
    this.fillModeChanged.emit(newFillMode);
  }
}

