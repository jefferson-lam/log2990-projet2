import { Injectable } from '@angular/core';
import { DirectionalMovementDirective } from '@app/components/selection/selection-directives/directional-movement.directive';
import { SelectionComponent } from '@app/components/selection/selection.component';
import * as DirectionalMovementConstants from '@app/constants/directional-movement-constants';
import { RECTANGLE_SELECTION_KEY } from '@app/constants/tool-manager-constants';
import { CanvasGridService } from '@app/services/canvas-grid/canvas-grid.service';
import { PopupManagerService } from '@app/services/manager/popup-manager.service';
import { ToolManagerService } from '@app/services/manager/tool-manager-service';
import { ClipboardService } from '@app/services/tools/selection/clipboard/clipboard.service';
import { EllipseSelectionService } from '@app/services/tools/selection/ellipse/ellipse-selection-service';
import { RectangleSelectionService } from '@app/services/tools/selection/rectangle/rectangle-selection-service';
import { TextService } from '@app/services/tools/text/text-service';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';

@Injectable({
    providedIn: 'root',
})
export class ShortcutManagerService {
    isTextInput: boolean;

    constructor(
        public popupManager: PopupManagerService,
        public undoRedoService: UndoRedoService,
        public canvasGridService: CanvasGridService,
        public toolManager: ToolManagerService,
        public clipboardService: ClipboardService,
    ) {
        this.isTextInput = false;
    }

    private isShortcutAllowed(): boolean {
        return !this.isTextInput && !this.popupManager.isPopUpOpen;
    }

    onKeyboardDown(event: KeyboardEvent): void {
        if (!this.isShortcutAllowed()) {
            return;
        }

        if (!this.toolManager.textService.lockKeyboard && event.key.match(/^(1|2|3|a|c|e|i|l|r|s|b|t)$/)) {
            this.toolManager.selectTool(event.key);
        }
    }

    onGKeyDown(): void {
        if (!this.isShortcutAllowed()) {
            return;
        }
        this.canvasGridService.toggleGrid();
    }

    selectionOnShiftKeyDown(selectionComponent: SelectionComponent): void {
        if (!this.isShortcutAllowed()) {
            return;
        }
        if (selectionComponent.resizerHandlerService.inUse) {
            selectionComponent.resizerHandlerService.resizeSquare();
            selectionComponent.resizerHandlerService.setResizerPositions(selectionComponent.previewSelectionCanvas);
            selectionComponent.drawWithScalingFactors(selectionComponent.previewSelectionCtx, selectionComponent.selectionCanvas);
        }
        selectionComponent.resizerHandlerService.isShiftDown = true;
    }

    selectionOnShiftKeyUp(selectionComponent: SelectionComponent): void {
        if (!this.isShortcutAllowed()) {
            return;
        }
        if (selectionComponent.resizerHandlerService.inUse) {
            selectionComponent.resizerHandlerService.restoreLastDimensions();
            selectionComponent.resizerHandlerService.setResizerPositions(selectionComponent.previewSelectionCanvas);
            selectionComponent.drawWithScalingFactors(selectionComponent.previewSelectionCtx, selectionComponent.selectionCanvas);
        }
        selectionComponent.resizerHandlerService.isShiftDown = false;
    }

    onCtrlAKeyDown(event: KeyboardEvent): void {
        event.preventDefault();
        if (!this.isShortcutAllowed()) {
            return;
        }
        this.toolManager.selectTool(RECTANGLE_SELECTION_KEY);
        if (this.toolManager.currentTool instanceof RectangleSelectionService) {
            this.toolManager.currentTool.selectAll();
        }
    }

    onCtrlEKeyDown(event: KeyboardEvent): void {
        event.preventDefault();
        if (!this.isShortcutAllowed()) {
            return;
        }
        this.popupManager.openExportPopUp();
    }

    onCtrlGKeyDown(event: KeyboardEvent): void {
        event.preventDefault();
        if (!this.isShortcutAllowed()) {
            return;
        }
        this.popupManager.openCarrouselPopUp();
    }

    onCtrlOKeyDown(event: KeyboardEvent): void {
        event.preventDefault();
        if (!this.isShortcutAllowed()) {
            return;
        }
        this.popupManager.openNewDrawingPopUp();
    }

    onCtrlSKeyDown(event: KeyboardEvent): void {
        event.preventDefault();
        if (!this.isShortcutAllowed()) {
            return;
        }
        this.popupManager.openSavePopUp();
    }

    onCtrlShiftZKeyDown(event: KeyboardEvent): void {
        event.preventDefault();
        if (!this.isShortcutAllowed()) {
            return;
        }

        if (!this.toolManager.currentTool.inUse) {
            this.undoRedoService.redo();
        }
    }

    onCtrlZKeyDown(event: KeyboardEvent): void {
        event.preventDefault();
        if (!this.isShortcutAllowed()) {
            return;
        }
        if (
            (this.toolManager.currentTool instanceof RectangleSelectionService || this.toolManager.currentTool instanceof EllipseSelectionService) &&
            this.toolManager.currentTool.isManipulating
        ) {
            this.toolManager.currentTool.undoSelection();
        } else if (!this.toolManager.currentTool.inUse) {
            this.undoRedoService.undo();
        }
    }

    onCtrlCKeyDown(event: KeyboardEvent): void {
        event.preventDefault();
        if (!this.isShortcutAllowed()) {
            return;
        }
        this.clipboardService.copySelection();
    }

    onCtrlVKeyDown(event: KeyboardEvent): void {
        event.preventDefault();
        if (!this.isShortcutAllowed()) {
            return;
        }
        this.clipboardService.pasteSelection();
    }

    onCtrlXKeyDown(event: KeyboardEvent): void {
        event.preventDefault();
        if (!this.isShortcutAllowed()) {
            return;
        }
        this.clipboardService.cutSelection();
    }

    onDeleteKeyDown(event: KeyboardEvent): void {
        event.preventDefault();
        if (!this.isShortcutAllowed()) {
            return;
        }
        this.clipboardService.deleteSelection();
    }

    onMinusKeyDown(): void {
        if (!this.isShortcutAllowed()) {
            return;
        }
        this.canvasGridService.reduceGridSize();
    }

    onEqualKeyDown(): void {
        if (!this.isShortcutAllowed()) {
            return;
        }
        this.canvasGridService.increaseGridSize();
    }

    onPlusKeyDown(): void {
        if (!this.isShortcutAllowed()) {
            return;
        }
        this.canvasGridService.increaseGridSize();
    }

    onEscapeKeyDown(): void {
        if (this.toolManager.currentTool instanceof TextService && !this.popupManager.isPopUpOpen) {
            this.toolManager.textService.placeHolderSpan.style.display = 'none';
            this.toolManager.textService.escapeKeyUsed = true;
        }
    }

    async selectionMovementOnArrowDown(event: KeyboardEvent, directive: DirectionalMovementDirective): Promise<void> {
        event.preventDefault();
        if (!this.isShortcutAllowed()) {
            return;
        }
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

    selectionMovementOnKeyboardUp(event: KeyboardEvent, directive: DirectionalMovementDirective): void {
        if (!this.isShortcutAllowed()) {
            return;
        }
        directive.keyPressed.set(event.key, 0);
    }
}
