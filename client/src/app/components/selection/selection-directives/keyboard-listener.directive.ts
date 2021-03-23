import { Directive, HostListener } from '@angular/core';
import { ToolManagerService } from '@app/services/manager/tool-manager-service';
import { EllipseSelectionService } from '@app/services/tools/selection/ellipse/ellipse-selection-service';
import { RectangleSelectionService } from '@app/services/tools/selection/rectangle/rectangle-selection-service';
import { ToolSelectionService } from '@app/services/tools/selection/tool-selection-service';
import { Subscription } from 'rxjs';

@Directive({
    selector: '[appKeyboardListener]',
})
export class KeyboardListenerDirective {
    currentTool: ToolSelectionService;
    currentToolSubscriber: Subscription;

    constructor(public toolManager: ToolManagerService) {
        this.currentToolSubscriber = this.toolManager.currentToolSubject.asObservable().subscribe((currentTool) => {
            if (currentTool instanceof RectangleSelectionService || currentTool instanceof EllipseSelectionService) {
                this.currentTool = currentTool;
            }
        });
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
