import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { SettingsManagerService } from '@app/services/manager/settings-manager';
import { ToolManagerService } from '@app/services/manager/tool-manager-service';

@Component({
  selector: 'app-sidebar-tools-options',
  templateUrl: './sidebar-tools-options.component.html',
  styleUrls: ['./sidebar-tools-options.component.scss']
})
export class SidebarToolsOptionsComponent implements OnInit {
  public toolSettings = { 
    widthSetting: false,
    traceType: false,
    junctionType: true,
    dotSize: false
  };
  currentToolName: string = 'outil selectionné';
  
  constructor(public settingsManager: SettingsManagerService, public toolManager: ToolManagerService) { 
    this.toolSizeChanged.subscribe((newSize: number) => settingsManager.setLineWidth(newSize));
  }

  @Output() toolSizeChanged: EventEmitter<number> = new EventEmitter();

  ngOnInit(): void {
  }
  setMax(muberInput: number) {
    if (muberInput >= 200) {
      return Math.round(muberInput / 200) + 'k';
    }
    return muberInput;
  }
}
