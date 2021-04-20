import { ElementRef } from '@angular/core';
import { fakeAsync, flush, TestBed } from '@angular/core/testing';
import { Tool } from '@app/classes/tool';
import { DirectionalMovementDirective } from '@app/components/selection/selection-directives/directional-movement.directive';
import { SelectionComponent } from '@app/components/selection/selection.component';
import { CanvasGridService } from '@app/services/canvas-grid/canvas-grid.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { MagnetismService } from '@app/services/magnetism/magnetism.service';
import { PopupManagerService } from '@app/services/manager/popup-manager.service';
import { ToolManagerService } from '@app/services/manager/tool-manager-service';
import { RectangleService } from '@app/services/tools/rectangle/rectangle-service';
import { ClipboardService } from '@app/services/tools/selection/clipboard/clipboard.service';
import { RectangleSelectionService } from '@app/services/tools/selection/rectangle/rectangle-selection-service';
import { ResizerHandlerService } from '@app/services/tools/selection/resizer/resizer-handler.service';
import { StampService } from '@app/services/tools/stamp/stamp-service';
import { TextService } from '@app/services/tools/text/text-service';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';
import { ShortcutManagerService } from './shortcut-manager.service';

// tslint:disable:max-file-line-count
describe('ShortcutManagerService', () => {
    let service: ShortcutManagerService;
    let rectangleSelectionService: RectangleSelectionService;
    let stampService: StampService;
    let textService: TextService;
    let popupManagerSpy: jasmine.SpyObj<PopupManagerService>;
    let toolManagerSpy: jasmine.SpyObj<ToolManagerService>;
    let canvasGridServiceSpy: jasmine.SpyObj<CanvasGridService>;
    let resizerHandlerServiceSpy: jasmine.SpyObj<ResizerHandlerService>;
    let undoRedoServiceSpy: jasmine.SpyObj<UndoRedoService>;
    let undoSelectionSpy: jasmine.Spy;
    let allowShortcutSpy: jasmine.Spy;
    let mockComponent: jasmine.SpyObj<SelectionComponent>;
    let mockEvent: jasmine.SpyObj<KeyboardEvent>;
    let directive: DirectionalMovementDirective;
    let directiveDelaySpy: jasmine.Spy;
    let directiveTranslateSpy: jasmine.Spy;
    let magnetismServiceSpy: jasmine.SpyObj<MagnetismService>;
    let clipboardServiceSpy: jasmine.SpyObj<ClipboardService>;

    beforeEach(() => {
        undoRedoServiceSpy = jasmine.createSpyObj('UndoRedoService', ['undo', 'redo']);
        toolManagerSpy = jasmine.createSpyObj(
            'ToolManagerService',
            ['getTool', 'selectTool', 'setPrimaryColorTools', 'setSecondaryColorTools'],
            ['currentTool', 'textService'],
        );
        textService = new TextService({} as DrawingService, {} as UndoRedoService);
        (Object.getOwnPropertyDescriptor(toolManagerSpy, 'textService')?.get as jasmine.Spy<() => TextService>).and.returnValue(textService);
        popupManagerSpy = jasmine.createSpyObj(
            'PopupManagerService',
            ['openExportPopUp', 'openSavePopUp', 'openNewDrawingPopUp', 'openCarrouselPopUp'],
            ['isPopUpOpen'],
        );
        canvasGridServiceSpy = jasmine.createSpyObj(
            'CanvasGridService',
            ['resize', 'toggleGrid', 'reduceGridSize', 'increaseGridSize'],
            ['squareWidth'],
        );
        // tslint:disable-next-line: no-magic-numbers
        (Object.getOwnPropertyDescriptor(canvasGridServiceSpy, 'squareWidth')?.get as jasmine.Spy<() => number>).and.returnValue(50);

        magnetismServiceSpy = jasmine.createSpyObj('MagnetismService', ['toggleMagnetism', 'magnetizeSelection']);
        clipboardServiceSpy = jasmine.createSpyObj('ClipboardService', ['copySelection', 'cutSelection', 'pasteSelection', 'deleteSelection']);

        TestBed.configureTestingModule({
            providers: [
                { provide: CanvasGridService, useValue: canvasGridServiceSpy },
                { provide: ToolManagerService, useValue: toolManagerSpy },
                { provide: PopupManagerService, useValue: popupManagerSpy },
                { provide: UndoRedoService, useValue: undoRedoServiceSpy },
                { provide: MagnetismService, useValue: magnetismServiceSpy },
                { provide: ClipboardService, useValue: clipboardServiceSpy },
            ],
        });
        service = TestBed.inject(ShortcutManagerService);

        // tslint:disable-next-line:no-any
        allowShortcutSpy = spyOn<any>(service, 'isShortcutAllowed').and.callThrough();
        rectangleSelectionService = new RectangleSelectionService(
            {} as DrawingService,
            {} as UndoRedoService,
            {} as ResizerHandlerService,
            new RectangleService({} as DrawingService, {} as UndoRedoService),
        );
        (Object.getOwnPropertyDescriptor(toolManagerSpy, 'currentTool')?.get as jasmine.Spy<() => Tool>).and.returnValue(rectangleSelectionService);

        stampService = new StampService({} as DrawingService, {} as UndoRedoService);

        resizerHandlerServiceSpy = jasmine.createSpyObj(
            'ResizerHandlerService',
            ['resizeSquare', 'restoreLastDimensions', 'setResizerPositions'],
            ['inUse', 'isShiftDown'],
        );
        mockComponent = jasmine.createSpyObj('SelectionComponent', ['drawWithScalingFactors'], ['resizerHandlerService']);
        (Object.getOwnPropertyDescriptor(mockComponent, 'resizerHandlerService')?.get as jasmine.Spy<() => ResizerHandlerService>).and.returnValue(
            resizerHandlerServiceSpy,
        );

        mockEvent = jasmine.createSpyObj('event', ['preventDefault']);
        undoSelectionSpy = spyOn(rectangleSelectionService, 'undoSelection');

        directive = new DirectionalMovementDirective({} as ElementRef, service);
        directiveDelaySpy = spyOn(directive, 'delay').and.returnValue({} as Promise<void>);
        directiveTranslateSpy = spyOn(directive, 'translateSelection');
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('isShortcutAllowed should return true if isTextInput false,popupManager.isPopOpen false and lockKeyboard false', () => {
        service.isTextInput = false;
        toolManagerSpy.textService.lockKeyboard = false;
        (Object.getOwnPropertyDescriptor(popupManagerSpy, 'isPopUpOpen')?.get as jasmine.Spy<() => boolean>).and.returnValue(false);

        // tslint:disable-next-line:no-string-literal
        const result = service['isShortcutAllowed']();

        expect(result).toBeTrue();
    });

    it('isShortcutAllowed should return true if isTextInput false and popupManager.isPopOpen true', () => {
        service.isTextInput = false;
        (Object.getOwnPropertyDescriptor(popupManagerSpy, 'isPopUpOpen')?.get as jasmine.Spy<() => boolean>).and.returnValue(true);

        // tslint:disable-next-line:no-string-literal
        const result = service['isShortcutAllowed']();

        expect(result).toBeFalse();
    });

    it('isShortcutAllowed should return false if isTextInput true and popupManager.isPopOpen false', () => {
        service.isTextInput = true;
        (Object.getOwnPropertyDescriptor(popupManagerSpy, 'isPopUpOpen')?.get as jasmine.Spy<() => boolean>).and.returnValue(false);

        // tslint:disable-next-line:no-string-literal
        const result = service['isShortcutAllowed']();

        expect(result).toBeFalse();
    });

    it('onKeyboardDown should call toolManager.selectTool if isShortcutAllowed, lockKeyboard and key is associated to tool', () => {
        allowShortcutSpy.and.returnValue(true);
        const event = {
            key: 'e',
        } as KeyboardEvent;

        service.onKeyboardDown(event);

        expect(toolManagerSpy.selectTool).toHaveBeenCalled();
    });

    it('onKeyboardDown should not call toolManager.selectTool if isShortcutAllowed false and key is associated to tool', () => {
        allowShortcutSpy.and.returnValue(false);
        const event = {
            key: 'e',
        } as KeyboardEvent;

        service.onKeyboardDown(event);

        expect(toolManagerSpy.selectTool).not.toHaveBeenCalled();
    });

    it('onKeyboardDown should not call toolManager.selectTool if isShortcutAllowed true and key is not associated to tool', () => {
        allowShortcutSpy.and.returnValue(true);
        const event = {
            key: 'k',
        } as KeyboardEvent;

        service.onKeyboardDown(event);

        expect(toolManagerSpy.selectTool).not.toHaveBeenCalled();
    });

    it('onGKeyDown should call canvasGridService.toggleGrid if isShortcutAllowed true', () => {
        allowShortcutSpy.and.returnValue(true);
        service.onGKeyDown();

        expect(canvasGridServiceSpy.toggleGrid).toHaveBeenCalled();
    });

    it('onGKeyDown should not call canvasGridService.toggleGrid if isShortcutAllowed false', () => {
        toolManagerSpy.textService.lockKeyboard = false;
        allowShortcutSpy.and.returnValue(false);
        service.onGKeyDown();

        expect(canvasGridServiceSpy.toggleGrid).not.toHaveBeenCalled();
    });

    it('onAltDown should call changeRotationAngleOnAlt() from stampService', () => {
        (Object.getOwnPropertyDescriptor(toolManagerSpy, 'currentTool')?.get as jasmine.Spy<() => Tool>).and.returnValue(stampService);
        const eventSpy = jasmine.createSpyObj('event', ['preventDefault'], { key: 'alt' });
        const rotationSpy = spyOn(stampService, 'changeRotationAngleOnAlt').and.callFake(() => {
            return;
        });
        service.onAltDown(eventSpy);
        expect(rotationSpy).toHaveBeenCalled();
    });

    it('onAltUp should call changeRotationAngleNormal() from stampService', () => {
        (Object.getOwnPropertyDescriptor(toolManagerSpy, 'currentTool')?.get as jasmine.Spy<() => Tool>).and.returnValue(stampService);
        const rotationSpy = spyOn(stampService, 'changeRotationAngleNormal').and.callFake(() => {
            return;
        });
        service.onAltUp();

        expect(rotationSpy).toHaveBeenCalled();
    });

    it('onAltDown should not call changeRotationAngleOnAlt() from stampService', () => {
        const eventSpy = jasmine.createSpyObj('event', ['preventDefault'], { key: 'alt' });
        const rotationSpy = spyOn(stampService, 'changeRotationAngleOnAlt').and.callFake(() => {
            return;
        });
        service.onAltDown(eventSpy);
        expect(rotationSpy).not.toHaveBeenCalled();
    });

    it('onAltUp should not call changeRotationAngleNormal() from stampService', () => {
        const rotationSpy = spyOn(stampService, 'changeRotationAngleNormal').and.callFake(() => {
            return;
        });
        service.onAltUp();

        expect(rotationSpy).not.toHaveBeenCalled();
    });

    it('selectionOnShiftKeyDown should not call resizerHandlerService.functions and component.drawWithScalingFactors if isShortcutAllowed false and resizerHandlerService.inUse false', () => {
        allowShortcutSpy.and.returnValue(false);
        (Object.getOwnPropertyDescriptor(resizerHandlerServiceSpy, 'inUse')?.get as jasmine.Spy<() => boolean>).and.returnValue(false);

        service.selectionOnShiftKeyDown(mockComponent);

        expect(mockComponent.drawWithScalingFactors).not.toHaveBeenCalled();
        expect(resizerHandlerServiceSpy.resizeSquare).not.toHaveBeenCalled();
        expect(resizerHandlerServiceSpy.setResizerPositions).not.toHaveBeenCalled();
    });

    it('selectionOnShiftKeyDown should not call resizerHandlerService.functions and component.drawWithScalingFactors if isShortcutAllowed false and resizerHandlerService.inUse true', () => {
        allowShortcutSpy.and.returnValue(false);
        (Object.getOwnPropertyDescriptor(resizerHandlerServiceSpy, 'inUse')?.get as jasmine.Spy<() => boolean>).and.returnValue(true);

        service.selectionOnShiftKeyDown(mockComponent);

        expect(mockComponent.drawWithScalingFactors).not.toHaveBeenCalled();
        expect(resizerHandlerServiceSpy.resizeSquare).not.toHaveBeenCalled();
        expect(resizerHandlerServiceSpy.setResizerPositions).not.toHaveBeenCalled();
    });

    it('selectionOnShiftKeyDown should not call resizerHandlerService.functions and component.drawWithScalingFactors if isShortcutAllowed true and resizerHandlerService.inUse false', () => {
        allowShortcutSpy.and.returnValue(true);
        (Object.getOwnPropertyDescriptor(resizerHandlerServiceSpy, 'inUse')?.get as jasmine.Spy<() => boolean>).and.returnValue(false);

        service.selectionOnShiftKeyDown(mockComponent);

        expect(mockComponent.drawWithScalingFactors).not.toHaveBeenCalled();
        expect(resizerHandlerServiceSpy.resizeSquare).not.toHaveBeenCalled();
        expect(resizerHandlerServiceSpy.setResizerPositions).not.toHaveBeenCalled();
    });

    it('selectionOnShiftKeyDown should call resizerHandlerService.functions and component.drawWithScalingFactors if isShortcutAllowed true and resizerHandlerService.inUse true', () => {
        allowShortcutSpy.and.returnValue(true);
        (Object.getOwnPropertyDescriptor(resizerHandlerServiceSpy, 'inUse')?.get as jasmine.Spy<() => boolean>).and.returnValue(true);

        service.selectionOnShiftKeyDown(mockComponent);

        expect(mockComponent.drawWithScalingFactors).toHaveBeenCalled();
        expect(resizerHandlerServiceSpy.resizeSquare).toHaveBeenCalled();
        expect(resizerHandlerServiceSpy.setResizerPositions).toHaveBeenCalled();
    });

    it('selectionOnShiftKeyUp should not call resizerHandlerService.functions and component.drawWithScalingFactors if isShortcutAllowed false and resizerHandlerService.inUse false', () => {
        allowShortcutSpy.and.returnValue(false);
        (Object.getOwnPropertyDescriptor(resizerHandlerServiceSpy, 'inUse')?.get as jasmine.Spy<() => boolean>).and.returnValue(false);

        service.selectionOnShiftKeyUp(mockComponent);

        expect(mockComponent.drawWithScalingFactors).not.toHaveBeenCalled();
        expect(resizerHandlerServiceSpy.restoreLastDimensions).not.toHaveBeenCalled();
        expect(resizerHandlerServiceSpy.setResizerPositions).not.toHaveBeenCalled();
    });

    it('selectionOnShiftKeyUp should not call resizerHandlerService.functions and component.drawWithScalingFactors if isShortcutAllowed false and resizerHandlerService.inUse true', () => {
        allowShortcutSpy.and.returnValue(false);
        (Object.getOwnPropertyDescriptor(resizerHandlerServiceSpy, 'inUse')?.get as jasmine.Spy<() => boolean>).and.returnValue(true);

        service.selectionOnShiftKeyUp(mockComponent);

        expect(mockComponent.drawWithScalingFactors).not.toHaveBeenCalled();
        expect(resizerHandlerServiceSpy.restoreLastDimensions).not.toHaveBeenCalled();
        expect(resizerHandlerServiceSpy.setResizerPositions).not.toHaveBeenCalled();
    });

    it('selectionOnShiftKeyUp should not call resizerHandlerService.functions and component.drawWithScalingFactors if isShortcutAllowed true and resizerHandlerService.inUse false', () => {
        allowShortcutSpy.and.returnValue(true);
        (Object.getOwnPropertyDescriptor(resizerHandlerServiceSpy, 'inUse')?.get as jasmine.Spy<() => boolean>).and.returnValue(false);

        service.selectionOnShiftKeyUp(mockComponent);

        expect(mockComponent.drawWithScalingFactors).not.toHaveBeenCalled();
        expect(resizerHandlerServiceSpy.restoreLastDimensions).not.toHaveBeenCalled();
        expect(resizerHandlerServiceSpy.setResizerPositions).not.toHaveBeenCalled();
    });

    it('selectionOnShiftKeyUp should call resizerHandlerService.functions and component.drawWithScalingFactors if isShortcutAllowed true and resizerHandlerService.inUse true', () => {
        allowShortcutSpy.and.returnValue(true);
        (Object.getOwnPropertyDescriptor(resizerHandlerServiceSpy, 'inUse')?.get as jasmine.Spy<() => boolean>).and.returnValue(true);

        service.selectionOnShiftKeyUp(mockComponent);

        expect(mockComponent.drawWithScalingFactors).toHaveBeenCalled();
        expect(resizerHandlerServiceSpy.restoreLastDimensions).toHaveBeenCalled();
        expect(resizerHandlerServiceSpy.setResizerPositions).toHaveBeenCalled();
    });

    it('ctrl+a should call toolManager.selectTool if isShortcutAllowed', () => {
        const eventSpy = jasmine.createSpyObj('event', ['preventDefault'], { ctrlKey: true, shiftKey: true, code: '', key: 'a' });
        spyOn(rectangleSelectionService, 'selectAll');
        allowShortcutSpy.and.returnValue(true);
        service.onCtrlAKeyDown(eventSpy);
        expect(toolManagerSpy.selectTool).toHaveBeenCalled();
    });

    it('ctrl+a should call selectAll if isShortcutAllowed and selection tool', () => {
        const eventSpy = jasmine.createSpyObj('event', ['preventDefault'], { ctrlKey: true, shiftKey: true, code: '', key: 'a' });
        allowShortcutSpy.and.returnValue(true);
        const selectAllSpy = spyOn(rectangleSelectionService, 'selectAll').and.callFake(() => {
            return;
        });
        service.onCtrlAKeyDown(eventSpy);
        expect(selectAllSpy).toHaveBeenCalled();
    });

    it('ctrl+a should not call selectAll or selectTool if isShortcutAllowed false', () => {
        const eventSpy = jasmine.createSpyObj('event', ['preventDefault'], { ctrlKey: true, shiftKey: true, code: '', key: 'a' });
        allowShortcutSpy.and.returnValue(false);
        const selectAllSpy = spyOn(rectangleSelectionService, 'selectAll').and.callFake(() => {
            return;
        });
        service.onCtrlAKeyDown(eventSpy);
        expect(eventSpy.preventDefault).toHaveBeenCalled();
        expect(toolManagerSpy.selectTool).not.toHaveBeenCalled();
        expect(selectAllSpy).not.toHaveBeenCalled();
    });

    it('onCtrlEKeyDown should call popupManager.openExportPopUp if isShortcutAllowed true', () => {
        allowShortcutSpy.and.returnValue(true);

        service.onCtrlEKeyDown(mockEvent);

        expect(popupManagerSpy.openExportPopUp).toHaveBeenCalled();
    });

    it('onCtrlEKeyDown should not call popupManager.openExportPopUp if isShortcutAllowed false', () => {
        allowShortcutSpy.and.returnValue(false);

        service.onCtrlEKeyDown(mockEvent);

        expect(popupManagerSpy.openExportPopUp).not.toHaveBeenCalled();
    });

    it('onCtrlGKeyDown should call popupManager.openCarrouselPopUp if isShortcutAllowed true', () => {
        allowShortcutSpy.and.returnValue(true);

        service.onCtrlGKeyDown(mockEvent);

        expect(popupManagerSpy.openCarrouselPopUp).toHaveBeenCalled();
    });

    it('onCtrlGKeyDown should not call popupManager.openCarrouselPopUp if isShortcutAllowed false', () => {
        allowShortcutSpy.and.returnValue(false);

        service.onCtrlGKeyDown(mockEvent);

        expect(popupManagerSpy.openCarrouselPopUp).not.toHaveBeenCalled();
    });

    it('onCtrlOKeyDown should call popupManager.openNewDrawingPopUp if isShortcutAllowed true', () => {
        allowShortcutSpy.and.returnValue(true);

        service.onCtrlOKeyDown(mockEvent);

        expect(popupManagerSpy.openNewDrawingPopUp).toHaveBeenCalled();
    });

    it('onCtrlOKeyDown should not call popupManager.openNewDrawingPopUp if isShortcutAllowed false', () => {
        allowShortcutSpy.and.returnValue(false);

        service.onCtrlOKeyDown(mockEvent);

        expect(popupManagerSpy.openNewDrawingPopUp).not.toHaveBeenCalled();
    });

    it('onCtrlSKeyDown should call popupManager.openSavePopUp if isShortcutAllowed true', () => {
        allowShortcutSpy.and.returnValue(true);

        service.onCtrlSKeyDown(mockEvent);

        expect(popupManagerSpy.openSavePopUp).toHaveBeenCalled();
    });

    it('onCtrlSKeyDown should not call popupManager.openSavePopUp if isShortcutAllowed false', () => {
        allowShortcutSpy.and.returnValue(false);

        service.onCtrlSKeyDown(mockEvent);

        expect(popupManagerSpy.openSavePopUp).not.toHaveBeenCalled();
    });

    it('onCtrlShiftZKeyDown should call undoRedoService.redo if isShortcutAllowed true', () => {
        allowShortcutSpy.and.returnValue(true);

        service.onCtrlShiftZKeyDown(mockEvent);

        expect(undoRedoServiceSpy.redo).toHaveBeenCalled();
    });

    it('onCtrlShiftZKeyDown should not call undoRedoService.redo if isShortcutAllowed false', () => {
        allowShortcutSpy.and.returnValue(false);

        service.onCtrlShiftZKeyDown(mockEvent);

        expect(undoRedoServiceSpy.redo).not.toHaveBeenCalled();
    });

    it('onCtrlZKeyDown should call undoRedoService.undo if isShortcutAllowed true, currentTool not selectionTool and not isManipulating', () => {
        allowShortcutSpy.and.returnValue(true);
        rectangleSelectionService.isManipulating = false;

        service.onCtrlZKeyDown(mockEvent);

        expect(undoRedoServiceSpy.undo).toHaveBeenCalled();
    });

    it('onCtrlZKeyDown should not call undoRedoService.undo if isShortcutAllowed false', () => {
        allowShortcutSpy.and.returnValue(false);
        rectangleSelectionService.isManipulating = false;

        service.onCtrlZKeyDown(mockEvent);

        expect(undoRedoServiceSpy.undo).not.toHaveBeenCalled();
    });

    it('onCtrlZKeyDown should call currentTool.undoSelection if isShortcutAllowed, currentTool is selection and isManipulating', () => {
        allowShortcutSpy.and.returnValue(true);
        rectangleSelectionService.isManipulating = true;

        service.onCtrlZKeyDown(mockEvent);

        expect(undoSelectionSpy).toHaveBeenCalled();
    });

    it('onCtrlZKeyDown should not call toolManager.currentTool.undoSelection if isShortcutAllowed true, currentTool is not selection and isManipulating', () => {
        allowShortcutSpy.and.returnValue(true);
        (Object.getOwnPropertyDescriptor(toolManagerSpy, 'currentTool')?.get as jasmine.Spy<() => Tool>).and.returnValue({} as Tool);
        rectangleSelectionService.isManipulating = true;

        service.onCtrlZKeyDown(mockEvent);

        expect(undoSelectionSpy).not.toHaveBeenCalled();
    });

    it('onCtrlCKeyDown should call copySelection from ClipboardService', () => {
        const eventSpy = jasmine.createSpyObj('event', ['preventDefault'], { ctrlKey: true, code: 'KeyC', key: 'c' });
        service.onCtrlCKeyDown(eventSpy);
        expect(clipboardServiceSpy.copySelection).toHaveBeenCalled();
    });

    it('onCtrlCKeyDown should not call copySelection from ClipboardService if isShortcutAllowed is false', () => {
        allowShortcutSpy.and.returnValue(false);
        const eventSpy = jasmine.createSpyObj('event', ['preventDefault'], { ctrlKey: true, code: 'KeyC', key: 'c' });
        service.onCtrlCKeyDown(eventSpy);
        expect(clipboardServiceSpy.copySelection).not.toHaveBeenCalled();
    });

    it('OnCtrlXKeyDown should call cutSelection from ClipboardService', () => {
        const eventSpy = jasmine.createSpyObj('event', ['preventDefault'], { ctrlKey: true, code: 'KeyX', key: 'x' });
        service.onCtrlXKeyDown(eventSpy);
        expect(clipboardServiceSpy.cutSelection).toHaveBeenCalled();
    });

    it('OnCtrlXKeyDown should not call cutSelection from ClipboardService if isShortcutAlled is false', () => {
        allowShortcutSpy.and.returnValue(false);
        const eventSpy = jasmine.createSpyObj('event', ['preventDefault'], { ctrlKey: true, code: 'KeyX', key: 'x' });
        service.onCtrlXKeyDown(eventSpy);
        expect(clipboardServiceSpy.cutSelection).not.toHaveBeenCalled();
    });

    it('OnCtrlVKeyDown should call pasteSelection from ClipboardService', () => {
        const eventSpy = jasmine.createSpyObj('event', ['preventDefault'], { ctrlKey: true, code: 'KeyV', key: 'v' });
        service.onCtrlVKeyDown(eventSpy);
        expect(clipboardServiceSpy.pasteSelection).toHaveBeenCalled();
    });

    it('OnCtrlVKeyDown should not call cutSelection from ClipboardService if isShortcutAlled is false', () => {
        allowShortcutSpy.and.returnValue(false);
        const eventSpy = jasmine.createSpyObj('event', ['preventDefault'], { ctrlKey: true, code: 'KeyV', key: 'v' });
        service.onCtrlVKeyDown(eventSpy);
        expect(clipboardServiceSpy.pasteSelection).not.toHaveBeenCalled();
    });

    it('onDeleteKeyDown should call deleteSelection from ClipboardService', () => {
        (Object.getOwnPropertyDescriptor(toolManagerSpy, 'currentTool')?.get as jasmine.Spy<() => Tool>).and.returnValue(rectangleSelectionService);
        allowShortcutSpy.and.returnValue(true);
        const eventSpy = jasmine.createSpyObj('event', ['preventDefault'], { ctrlKey: false, code: 'Delete', key: 'delete' });
        service.onDeleteKeyDown(eventSpy);
        expect(clipboardServiceSpy.deleteSelection).toHaveBeenCalled();
    });

    it('onDeleteKeyDown should not call cutSelection from ClipboardService if isShortcutAllowed is false', () => {
        allowShortcutSpy.and.returnValue(false);
        const eventSpy = jasmine.createSpyObj('event', ['preventDefault'], { ctrlKey: false, code: 'Delete', key: 'delete' });
        (Object.getOwnPropertyDescriptor(toolManagerSpy, 'currentTool')?.get as jasmine.Spy<() => Tool>).and.returnValue({} as Tool);
        service.onDeleteKeyDown(eventSpy);
        expect(clipboardServiceSpy.deleteSelection).not.toHaveBeenCalled();
    });

    it('onDeleteKeyDown should call deleteSelection from ClipboardService if current tool is rectangle service', () => {
        (Object.getOwnPropertyDescriptor(toolManagerSpy, 'currentTool')?.get as jasmine.Spy<() => Tool>).and.returnValue(rectangleSelectionService);
        const eventSpy = jasmine.createSpyObj('event', ['preventDefault'], { ctrlKey: false, code: 'Delete', key: 'delete' });
        allowShortcutSpy.and.returnValue(true);

        service.onDeleteKeyDown(eventSpy);
        expect(clipboardServiceSpy.deleteSelection).toHaveBeenCalled();
    });

    it('onDeleteKeyDown should not call deleteSelection from ClipboardService if current tool not rectangle service', () => {
        const eventSpy = jasmine.createSpyObj('event', ['preventDefault'], { ctrlKey: false, code: 'Delete', key: 'delete' });
        allowShortcutSpy.and.returnValue(true);
        (Object.getOwnPropertyDescriptor(toolManagerSpy, 'currentTool')?.get as jasmine.Spy<() => Tool>).and.returnValue({} as Tool);

        service.onDeleteKeyDown(eventSpy);
        expect(clipboardServiceSpy.deleteSelection).not.toHaveBeenCalled();
    });

    it('onMinusKeyDown should call canvasGridService.reduceGridSize if isShortcutAllowed true', () => {
        allowShortcutSpy.and.returnValue(true);

        service.onMinusKeyDown();

        expect(canvasGridServiceSpy.reduceGridSize).toHaveBeenCalled();
    });

    it('onMinusKeyDown should not call canvasGridService.reduceGridSize if isShortcutAllowed false', () => {
        allowShortcutSpy.and.returnValue(false);

        service.onMinusKeyDown();

        expect(canvasGridServiceSpy.reduceGridSize).not.toHaveBeenCalled();
    });

    it('onEqualKeyDown should call canvasGridService.increaseGridSize if isShortcutAllowed true', () => {
        allowShortcutSpy.and.returnValue(true);

        service.onEqualKeyDown();

        expect(canvasGridServiceSpy.increaseGridSize).toHaveBeenCalled();
    });

    it('onEqualKeyDown should not call canvasGridService.increaseGridSize if isShortcutAllowed false', () => {
        allowShortcutSpy.and.returnValue(false);

        service.onEqualKeyDown();

        expect(canvasGridServiceSpy.increaseGridSize).not.toHaveBeenCalled();
    });

    it('onPlusKeyDown should call canvasGridService.increaseGridSize if isShortcutAllowed true', () => {
        allowShortcutSpy.and.returnValue(true);

        service.onPlusKeyDown();

        expect(canvasGridServiceSpy.increaseGridSize).toHaveBeenCalled();
    });

    it('onPlusKeyDown should not call canvasGridService.increaseGridSize if isShortcutAllowed false', () => {
        allowShortcutSpy.and.returnValue(false);

        service.onPlusKeyDown();

        expect(canvasGridServiceSpy.increaseGridSize).not.toHaveBeenCalled();
    });

    it('onEscapeKeyDown should call currentTool.onEscapeKeyDown if not isPopUpOpen', () => {
        const escapeKeySpy = spyOn(service.toolManager.currentTool, 'onEscapeKeyDown');
        service.onEscapeKeyDown();
        expect(escapeKeySpy).toHaveBeenCalled();
    });

    it('onEscapeKeyDown should not call currentTool.onEscapeKeyDown if isPopUpOpen', () => {
        const escapeKeySpy = spyOn(service.toolManager.currentTool, 'onEscapeKeyDown');
        (Object.getOwnPropertyDescriptor(popupManagerSpy, 'isPopUpOpen')?.get as jasmine.Spy<() => boolean>).and.returnValue(true);
        service.onEscapeKeyDown();
        expect(escapeKeySpy).not.toHaveBeenCalled();
    });

    it('selectionMovementOnArrowDown should not call delay and translate selection if key already pressed, directive.hasMovedOnce and isShortcutAllowed true', fakeAsync((): void => {
        const keyEvent = jasmine.createSpyObj('event', ['preventDefault'], { key: 'ArrowLeft', timeStamp: '100' });
        directive.keyPressed.set('ArrowLeft', 1);
        allowShortcutSpy.and.returnValue(true);
        directive.hasMovedOnce = true;

        service.selectionMovementOnArrowDown(keyEvent, directive);

        expect(directiveDelaySpy).not.toHaveBeenCalled();
        expect(directiveTranslateSpy).not.toHaveBeenCalled();
    }));

    it('selectionMovementOnArrowDown should call delay and translate selection once if key already pressed, directive.hasMovedOnce false and isShortcutAllowed true', fakeAsync((): void => {
        const keyEvent = jasmine.createSpyObj('event', ['preventDefault'], { key: 'ArrowLeft', timeStamp: '100' });
        directive.keyPressed.set('ArrowLeft', 1);
        allowShortcutSpy.and.returnValue(true);
        directive.hasMovedOnce = false;

        service.selectionMovementOnArrowDown(keyEvent, directive);
        flush();

        expect(directiveDelaySpy).toHaveBeenCalledTimes(1);
        expect(directiveTranslateSpy).toHaveBeenCalledTimes(1);
    }));

    it('selectionMovementOnArrowDown should call delay and translate selection once if key not already pressed, directive.hasMovedOnce true and isShortcutAllowed true', fakeAsync((): void => {
        const keyEvent = jasmine.createSpyObj('event', ['preventDefault'], { key: 'ArrowLeft', timeStamp: '100' });
        allowShortcutSpy.and.returnValue(true);
        directive.hasMovedOnce = true;

        service.selectionMovementOnArrowDown(keyEvent, directive);
        flush();

        expect(directiveDelaySpy).toHaveBeenCalledTimes(1);
        expect(directiveTranslateSpy).toHaveBeenCalledTimes(1);
    }));

    it('selectionMovementOnArrowDown should call delay and translate selection with canvasGridService.square width once if key not already pressed, directive.hasMovedOnce true, isShortcutAllowed true and isMagnetism is true', fakeAsync((): void => {
        const keyEvent = jasmine.createSpyObj('event', ['preventDefault'], { key: 'ArrowLeft', timeStamp: '100' });
        allowShortcutSpy.and.returnValue(true);
        directive.hasMovedOnce = true;
        service.magnetismService.isMagnetismOn = true;

        service.selectionMovementOnArrowDown(keyEvent, directive);
        flush();

        expect(directiveDelaySpy).toHaveBeenCalledTimes(1);
        expect(directiveTranslateSpy).toHaveBeenCalledTimes(1);
        expect(directiveTranslateSpy).toHaveBeenCalledWith(canvasGridServiceSpy.squareWidth / 2 + 1);
    }));

    it('selectionMovementOnArrowDown should call delay and translate selection twice if key not already pressed, directive.hasMovedOnce false and isShortcutAllowed true', fakeAsync((): void => {
        const keyEvent = jasmine.createSpyObj('event', ['preventDefault'], { key: 'ArrowLeft', timeStamp: '100' });
        allowShortcutSpy.and.returnValue(true);
        directive.hasMovedOnce = false;

        service.selectionMovementOnArrowDown(keyEvent, directive);
        flush();

        expect(directiveDelaySpy).toHaveBeenCalledTimes(2);
        expect(directiveTranslateSpy).toHaveBeenCalledTimes(2);
    }));

    it('selectionMovementOnArrowDown should call delay and translate selection twice with canvasGridService squareWidth if key not already pressed, directive.hasMovedOnce false, isShortcutAllowed true and isMagnetismOn true', fakeAsync((): void => {
        const keyEvent = jasmine.createSpyObj('event', ['preventDefault'], { key: 'ArrowLeft', timeStamp: '100' });
        allowShortcutSpy.and.returnValue(true);
        directive.hasMovedOnce = false;
        service.magnetismService.isMagnetismOn = true;

        service.selectionMovementOnArrowDown(keyEvent, directive);
        flush();

        expect(directiveDelaySpy).toHaveBeenCalledTimes(2);
        expect(directiveTranslateSpy).toHaveBeenCalledTimes(2);
        expect(directiveTranslateSpy).toHaveBeenCalledWith(canvasGridServiceSpy.squareWidth / 2 + 1);
        expect(directiveTranslateSpy).toHaveBeenCalledWith(canvasGridServiceSpy.squareWidth);
    }));

    it('selectionMovementOnArrowDown should not call delay and translate selection if isShortcutAllowed false', fakeAsync((): void => {
        const keyEvent = jasmine.createSpyObj('event', ['preventDefault'], { key: 'ArrowLeft', timeStamp: '100' });
        allowShortcutSpy.and.returnValue(false);
        directive.hasMovedOnce = false;

        service.selectionMovementOnArrowDown(keyEvent, directive);
        flush();

        expect(directiveDelaySpy).not.toHaveBeenCalled();
        expect(directiveTranslateSpy).not.toHaveBeenCalled();
    }));

    it('selectionMovementOnKeyboardUp should call directive.keyPressed.set if isShortcutAllowed true', () => {
        allowShortcutSpy.and.returnValue(true);
        const mockDirective = { keyPressed: new Map<string, number>() } as DirectionalMovementDirective;
        const setSpy = spyOn(mockDirective.keyPressed, 'set');

        service.selectionMovementOnKeyboardUp(mockEvent, mockDirective);

        expect(setSpy).toHaveBeenCalled();
        expect(setSpy).toHaveBeenCalledWith(mockEvent.key, 0);
    });

    it('selectionMovementOnKeyboardUp should not call directive.keyPressed.set if isShortcutAllowed false', () => {
        allowShortcutSpy.and.returnValue(false);
        const mockDirective = { keyPressed: new Map<string, number>() } as DirectionalMovementDirective;
        const setSpy = spyOn(mockDirective.keyPressed, 'set');

        service.selectionMovementOnKeyboardUp(mockEvent, mockDirective);

        expect(setSpy).not.toHaveBeenCalled();
    });

    it('onMKeyDown should call magnetismService.toggleMagnetism', () => {
        service.onMKeyDown();
        expect(magnetismServiceSpy.toggleMagnetism).toHaveBeenCalled();
    });

    it('onMKeyDown should not call magnetismService.toggleMagnetism if isShortcutAllowed false', () => {
        allowShortcutSpy.and.returnValue(false);
        service.onMKeyDown();
        expect(magnetismServiceSpy.toggleMagnetism).not.toHaveBeenCalled();
    });
});
