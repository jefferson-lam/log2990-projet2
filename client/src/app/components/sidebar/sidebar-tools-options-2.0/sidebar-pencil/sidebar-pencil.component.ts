import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { SettingsManagerService } from '@app/services/manager/settings-manager';

@Component({
  selector: 'app-sidebar-pencil',
  templateUrl: './sidebar-pencil.component.html',
  styleUrls: ['./sidebar-pencil.component.scss']
})
export class SidebarPencilComponent implements OnInit {
  max: number = 200;
  min: number = 1;
  tickInterval: number = 1;
  toolSize: number | undefined;
  currentTool: Tool;

  constructor(public settingsManager: SettingsManagerService) {} 

  ngOnInit() {
    this.toolSizeChanged.subscribe((newSize: number) => this.settingsManager.setLineWidth(newSize));
  }

  @Input() newTool: Tool;
  @Input() selected: number;

  @Output() toolSizeChanged: EventEmitter<number> = new EventEmitter();

  setMax(numberInput: number) {
    return numberInput;
  }

  emitToolSize() {
    this.toolSizeChanged.emit(this.toolSize);
  }
}
