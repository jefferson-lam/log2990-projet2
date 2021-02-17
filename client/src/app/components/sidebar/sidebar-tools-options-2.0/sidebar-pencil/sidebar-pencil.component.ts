import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { SettingsManagerService } from '@app/services/manager/settings-manager';
import { ToolManagerService } from '@app/services/manager/tool-manager-service';

@Component({
  selector: 'app-sidebar-pencil',
  templateUrl: './sidebar-pencil.component.html',
  styleUrls: ['./sidebar-pencil.component.scss']
})
export class SidebarPencilComponent {
  max: number = 200;
  min: number = 1;
  tickInterval: number = 1;
  toolSize: number | undefined;
  currentTool: Tool;

  constructor(public settingsManager: SettingsManagerService, public toolManagerService: ToolManagerService) {
    this.toolSizeChanged.subscribe((newSize: number) => settingsManager.setLineWidth(newSize));
  }

  @Input() newTool: Tool; // INPUT FROM SIDEBAR
  @Input() selected: number;

  currentToolName: string = 'outil selectionné';

  @Output() toolSizeChanged: EventEmitter<number> = new EventEmitter();

  setMax(numberInput: number) {
    return numberInput;
  }

  setToolSize() {
    console.log(this.toolSize);
    this.toolSizeChanged.emit(this.toolSize);
  }
}
