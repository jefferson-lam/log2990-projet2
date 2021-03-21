import { Directive, HostListener } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { ToolManagerService } from '@app/services/manager/tool-manager-service';
import { EllipseSelectionService } from '@app/services/tools/selection/ellipse/ellipse-selection-service';
import { RectangleSelectionService } from '@app/services/tools/selection/rectangle/rectangle-selection-service';
import { Subscription } from 'rxjs';

@Directive({
    selector: '[appKeyboardListener]',
})
export class KeyboardListenerDirective {
    currentTool: Tool; // Have this as an observable to editor's current tool to keep track of currentTool?
    currentToolSubscriber: Subscription;

    constructor(public toolManager: ToolManagerService) {
        this.currentToolSubscriber = this.toolManager.currentToolSubject.asObservable().subscribe((currentTool) => {
            this.currentTool = currentTool;
        });
    }

    @HostListener('keydown.control.z', ['$event'])
    onCtrlZKeyDown(event: KeyboardEvent): void {
        event.stopPropagation();
        if (this.currentTool instanceof RectangleSelectionService || this.currentTool instanceof EllipseSelectionService) {
            this.currentTool.undoSelection();
        }
    }

    @HostListener('keydown.escape', ['$event'])
    onEscapeDown(event: KeyboardEvent): void {
        this.currentTool.onKeyboardDown(event);
    }

    @HostListener('keyup.escape', ['$event'])
    onEscapeUp(event: KeyboardEvent): void {
        this.currentTool.onKeyboardUp(event);
    }
}
