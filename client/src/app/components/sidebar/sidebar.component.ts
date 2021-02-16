import { Location } from '@angular/common';
import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { SidebarToolButton } from '@app/classes/sidebar-tool-buttons';
import { Tool } from '@app/classes/tool';
import { ToolManagerService } from '@app/services/manager/tool-manager-service';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
    @Output() notifyOnToolSelect: EventEmitter<Tool> = new EventEmitter<Tool>();
    @Output() notifyEditorNewDrawing: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Input() currentTool: Tool;

  sidebarToolButtons: SidebarToolButton[] = [
    { id: 0, name: 'Crayon', serviceName:'PencilService' ,icon: 'create', keyShortcut: 'c', helpShortcut: '(Touche C)' },
    { id: 1, name: 'Efface', serviceName:'EraserService' ,icon: 'delete_outline', keyShortcut: 'e', helpShortcut: '(Touche E)' },
    { id: 2, name: 'Rectangle', serviceName:'RectangleService' ,icon: 'crop_portrait', keyShortcut: '1', helpShortcut: '(Touche 1)' },
    { id: 3, name: 'Ellipse', serviceName:'EllipseService' ,icon: 'vignette', keyShortcut: '2', helpShortcut: '(Touche 2)' },
    { id: 4, name: 'Polygone', serviceName:'PolygoneService' ,icon: 'brush', keyShortcut: '3', helpShortcut: '(Touche 3)' },
    { id: 5, name: 'Ligne', serviceName:'LineService' ,icon: 'trending_flat', keyShortcut: 'l', helpShortcut: '(Touche L)' },
    { id: 6, name: 'Texte', serviceName:'TextService' ,icon: 'text_format', keyShortcut: 't', helpShortcut: '(Touche T)' },
    { id: 7, name: 'Étampe', serviceName:'StampService' ,icon: 'today', keyShortcut: 'd', helpShortcut: '(Touche D)' },
    { id: 8, name: 'Pipette', serviceName:'PipetteService' ,icon: 'edit_location', keyShortcut: 'i', helpShortcut: '(Touche I)' },
    { id: 9, name: 'Rectangle de selection', serviceName:'SelectRectangleService' ,icon: 'tab_unselected', keyShortcut: 'r', helpShortcut: '(Touche R)' },
    { id: 10, name: 'Ellipse de selection', serviceName:'SelectEllipseService' ,icon: 'toys', keyShortcut: 's', helpShortcut: '(Touche S)' },
    { id: 11, name: 'Lasso polygonal', serviceName:'SelectLassoService' ,icon: 'gps_off', keyShortcut: 'v', helpShortcut: '(Touche V)' },
    { id: 12, name: 'Sceau de peinture', serviceName:'PaintBucketService' ,icon: 'format_color_fill', keyShortcut: 'b', helpShortcut: '(Touche B)' },
  ];


    @Input() selectedTool: SidebarToolButton = this.sidebarToolButtons[0];
    opened: boolean = false;
    shouldRun: boolean;
    isNewDrawing: boolean;

    constructor(public location: Location, public toolManagerService: ToolManagerService) {
        this.shouldRun = false;
    }

  //   filterByValue(search : string): void {
  //     const array = this.sidebarToolButtons;
  //     array.filter(res => Object.keys(res).some(this.matchesString(search)));
  //   }
  // /*
  // matchesString(element, index, array, search): (value:string, index:number,array: SidebarToolButton[]) {
  //   return element.toLowerCase().includes(search.toLowerCase());
  // }*/
  //
  //   filter(array: any[], SidebarToolButton: object): void {
  //     array.filter(res => Object.keys(SidebarToolButton).every(k => [].concat(SidebarToolButton[k]).some(v => res[k].includes(v))));
  //   }

  // filterByValue(search : string): void {
  //   const array = this.sidebarToolButtons;
  //   array.filter((item: Event) => item.);
  // }

    ngOnChanges(changes: SimpleChanges): void {
      // const newTool = changes.currentTool.currentValue;
      // const toolTest = this.filterByValue(newTool.toString());
      //
      // console.log(toolTest);

      //console.log(document.getElementById('icon-button-' + toolTest[0].name));

      /*if(newTool ===  ){
      console.log(this.selectedTool.name);
      console.log(document.getElementById('icon-button-' + this.selectedTool.name));
      const iconTool = document.getElementById('icon-button-' + this.selectedTool['name']) as HTMLElement;
      iconTool.style.backgroundColor = '#4682B4';
      iconTool.style.color = '#DDD';*/
          // }
    }

    onSelectTool(tool: SidebarToolButton): void {
        this.currentTool = this.toolManagerService.getTool(tool.keyShortcut);
        this.notifyOnToolSelect.emit(this.currentTool);
        this.selectedTool = tool;
    }

    openSettings(): void {
        this.opened = true;
    }

    closeSettings(): void {
        this.opened = false;
    }

    openNewDrawing(): void {
        this.notifyEditorNewDrawing.emit(this.isNewDrawing);
    }

    /*changeColor(tool: SidebarToolButton) : void {
      this.selectedNewTool = tool;
    }*/
}
