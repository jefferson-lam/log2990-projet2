import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sidebar-tools-options',
  templateUrl: './sidebar-tools-options.component.html',
  styleUrls: ['./sidebar-tools-options.component.scss']
})
export class SidebarToolsOptionsComponent implements OnInit {
  currentTool: boolean = true;
  name: string = 'outils selectionné';

  constructor() { }

  ngOnInit(): void {
  }
  setMax(muberInput: number) {
    if (muberInput >= 100) {
      return Math.round(muberInput / 100) + 'k';
    }
    return muberInput;
  }
}
