import { Injectable } from '@angular/core';
import { DirectionalMovementDirective } from '@app/components/selection/selection-directives/directional-movement.directive';
import { SelectionComponent } from '@app/components/selection/selection.component';
import * as DirectionalMovementConstants from '@app/constants/directional-movement-constants';
import { RECTANGLE_SELECTION_KEY } from '@app/constants/tool-manager-constants';
import { CanvasGridService } from '@app/services/canvas-grid/canvas-grid.service';
import { PopupManagerService } from '@app/services/manager/popup-manager.service';
import { ToolManagerService } from '@app/services/manager/tool-manager-service';
import { EllipseSelectionService } from '@app/services/tools/selection/ellipse/ellipse-selection-service';
import { RectangleSelectionService } from '@app/services/tools/selection/rectangle/rectangle-selection-service';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';

@Injectable({
    providedIn: 'root',
})
export class ShortcutManagerService {
    isUndoSelection: boolean;
    isTextInput: boolean;

    constructor(
        public popupManager: PopupManagerService,
        public undoRedoService: UndoRedoService,
        public canvasGridService: CanvasGridService,
        public toolManager: ToolManagerService,
    ) {
        this.isTextInput = false;
        this.isUndoSelection = false;
    }

    isShortcutAllowed(): boolean {
        console.log(!this.isTextInput && !this.popupManager.isPopUpOpen);
        return !this.isTextInput && !this.popupManager.isPopUpOpen;
    }

    onKeyboardDown(event: KeyboardEvent): void {
        if (this.isShortcutAllowed() && event.key.match(/^(1|2|c|l|e|r|s|a|3|i)$/)) {
            this.toolManager.selectTool(event.key);
        }
    }

    onGKeyDown(): void {
        if (this.isShortcutAllowed()) this.canvasGridService.toggleGrid();
    }

    selectionOnShiftKeyDown(selectionComponent: SelectionComponent): void {
        if (this.isShortcutAllowed()) {
            if (selectionComponent.resizerHandlerService.inUse) {
                selectionComponent.resizerHandlerService.resizeSquare();
                selectionComponent.resizerHandlerService.setResizerPositions(selectionComponent.previewSelectionCanvas);
                selectionComponent.drawWithScalingFactors(selectionComponent.previewSelectionCtx, selectionComponent.selectionCanvas);
            }
            selectionComponent.resizerHandlerService.isShiftDown = true;
        }
    }

    selectionOnShiftKeyUp(selectionComponent: SelectionComponent): void {
        if (this.isShortcutAllowed()) {
            if (selectionComponent.resizerHandlerService.inUse) {
                selectionComponent.resizerHandlerService.restoreLastDimensions();
                selectionComponent.resizerHandlerService.setResizerPositions(selectionComponent.previewSelectionCanvas);
                selectionComponent.drawWithScalingFactors(selectionComponent.previewSelectionCtx, selectionComponent.selectionCanvas);
            }
            selectionComponent.resizerHandlerService.isShiftDown = false;
        }
    }

    onCtrlAKeyDown(event: KeyboardEvent): void {
        event.preventDefault();
        if (this.isShortcutAllowed()) {
            this.toolManager.selectTool(RECTANGLE_SELECTION_KEY);
            if (this.toolManager.currentTool instanceof RectangleSelectionService) {
                this.toolManager.currentTool.selectAll();
            }
        }
    }

    onCtrlEKeyDown(event: KeyboardEvent): void {
        event.preventDefault();
        if (this.isShortcutAllowed()) this.popupManager.openExportPopUp();
    }

    onCtrlGKeyDown(event: KeyboardEvent): void {
        event.preventDefault();
        if (this.isShortcutAllowed()) this.popupManager.openCarouselPopUp();
    }

    onCtrlOKeyDown(event: KeyboardEvent): void {
        event.preventDefault();
        if (this.isShortcutAllowed()) {
            this.popupManager.openNewDrawingPopUp();
        }
    }

    onCtrlSKeyDown(event: KeyboardEvent): void {
        event.preventDefault();
        if (this.isShortcutAllowed()) {
            this.popupManager.openSavePopUp();
        }
    }

    onCtrlShiftZKeyDown(event: KeyboardEvent): void {
        event.preventDefault();
        if (this.isShortcutAllowed()) {
            if (!this.popupManager.isPopUpOpen && !this.toolManager.currentTool.inUse) {
                this.undoRedoService.redo();
            }
        }
    }

    onCtrlZKeyDown(event: KeyboardEvent): void {
        event.preventDefault();
        if (this.isShortcutAllowed()) {
            if (
                this.toolManager.currentTool instanceof RectangleSelectionService ||
                this.toolManager.currentTool instanceof EllipseSelectionService
            ) {
                if (this.toolManager.currentTool.isManipulating) {
                    this.toolManager.currentTool.undoSelection();
                    this.isUndoSelection = true;
                }
            }
            if (!this.popupManager.isPopUpOpen && !this.toolManager.currentTool.inUse && !this.isUndoSelection) {
                this.undoRedoService.undo();
            }
            this.isUndoSelection = false;
        }
    }

    onMinusKeyDown(): void {
        if (this.isShortcutAllowed()) {
            this.canvasGridService.reduceGridSize();
        }
    }

    onEqualKeyDown(): void {
        if (this.isShortcutAllowed()) {
            this.canvasGridService.increaseGridSize();
        }
    }

    onPlusKeyDown(): void {
        if (this.isShortcutAllowed()) {
            this.canvasGridService.increaseGridSize();
        }
    }

    async selectionMovementOnArrowDown(event: KeyboardEvent, directive: DirectionalMovementDirective): Promise<void> {
        if (this.isShortcutAllowed()) {
            event.preventDefault();
            if (!directive.keyPressed.get(event.key)) {
                directive.keyPressed.set(event.key, event.timeStamp);
                directive.translateSelection();
                await directive.delay(DirectionalMovementConstants.FIRST_PRESS_DELAY_MS);
            }

            if (directive.hasMovedOnce) {
                return;
            }

            directive.hasMovedOnce = true;
            await directive.delay(DirectionalMovementConstants.CONTINUOUS_PRESS_DELAY_MS);
            directive.translateSelection();
            directive.hasMovedOnce = false;
        }
    }

    selectionMovementOnKeyboardUp(event: KeyboardEvent, directive: DirectionalMovementDirective): void {
        if (this.isShortcutAllowed()) {
            directive.keyPressed.set(event.key, 0);
        }
    }
}
