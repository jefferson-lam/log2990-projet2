import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Command } from '@app/classes/command';
import { Tool } from '@app/classes/tool';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { PopupManagerService } from '@app/services/manager/popup-manager.service';
import { ToolManagerService } from '@app/services/manager/tool-manager-service';
import { EllipseService } from '@app/services/tools/ellipse/ellipse-service';
import { EraserService } from '@app/services/tools/eraser/eraser-service';
import { LineService } from '@app/services/tools/line/line-service';
import { PencilCommand } from '@app/services/tools/pencil/pencil-command';
import { PencilService } from '@app/services/tools/pencil/pencil-service';
import { RectangleService } from '@app/services/tools/rectangle/rectangle-service';
import { ClipboardService } from '@app/services/tools/selection/clipboard/clipboard.service';
import { RectangleSelectionService } from '@app/services/tools/selection/rectangle/rectangle-selection-service';
import { ResizerHandlerService } from '@app/services/tools/selection/resizer/resizer-handler.service';
import { TextService } from '@app/services/tools/text/text-service';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';
import { BehaviorSubject } from 'rxjs';
import { SidebarComponent } from './sidebar.component';

class ToolStub extends Tool {}

describe('SidebarComponent', () => {
    let component: SidebarComponent;
    let pencilStub: ToolStub;
    let eraserStub: ToolStub;
    let lineStub: ToolStub;
    let rectangleStub: ToolStub;
    let ellipseStub: ToolStub;
    let textStub: ToolStub;
    let textService: TextService;
    let rectangleSelectionServiceStub: RectangleSelectionService;
    let clipboardServiceStub: jasmine.SpyObj<ClipboardService>;
    let fixture: ComponentFixture<SidebarComponent>;
    let toolManagerServiceSpy: jasmine.SpyObj<ToolManagerService>;
    let popupManagerSpy: jasmine.SpyObj<PopupManagerService>;
    let undoRedoService: UndoRedoService;
    let mockCommand: Command;
    let commandExecuteSpy: jasmine.Spy;
    let selectToolSpy: jasmine.Spy;
    let undoServiceSpy: jasmine.Spy;
    let redoServiceSpy: jasmine.Spy;
    let selectionUndoSelectionSpy: jasmine.Spy;
    let refreshSpy: jasmine.Spy;
    let redoButton: HTMLElement;
    let undoButton: HTMLElement;

    // tslint:disable:no-any
    // tslint:disable:max-file-line-count
    beforeEach(async(() => {
        popupManagerSpy = jasmine.createSpyObj('PopupManagerService', ['openExportPopUp', 'openSavePopUp', 'openNewDrawingPopUp'], ['isPopupOpen']);
        pencilStub = new PencilService({} as DrawingService, {} as UndoRedoService);
        eraserStub = new EraserService({} as DrawingService, {} as UndoRedoService);
        lineStub = new LineService({} as DrawingService, {} as UndoRedoService);
        rectangleStub = new RectangleService({} as DrawingService, {} as UndoRedoService);
        ellipseStub = new EllipseService({} as DrawingService, {} as UndoRedoService);
        textStub = new TextService({} as DrawingService, {} as UndoRedoService);
        rectangleSelectionServiceStub = new RectangleSelectionService(
            {} as DrawingService,
            {} as UndoRedoService,
            {} as ResizerHandlerService,
            rectangleStub as RectangleService,
        );
        clipboardServiceStub = jasmine.createSpyObj('ClipboardService', ['copySelection', 'cutSelection', 'deleteSelection', 'pasteSelection']);
        toolManagerServiceSpy = jasmine.createSpyObj('ToolManagerService', ['selectTool'], ['currentTool', 'currentToolSubject', 'textService']);
        (Object.getOwnPropertyDescriptor(toolManagerServiceSpy, 'currentTool')?.get as jasmine.Spy<() => Tool>).and.returnValue(pencilStub);
        (Object.getOwnPropertyDescriptor(toolManagerServiceSpy, 'currentToolSubject')?.get as jasmine.Spy<
            () => BehaviorSubject<Tool>
        >).and.returnValue(new BehaviorSubject<Tool>(toolManagerServiceSpy.currentTool));

        textService = new TextService({} as DrawingService, {} as UndoRedoService);
        (Object.getOwnPropertyDescriptor(toolManagerServiceSpy, 'textService')?.get as jasmine.Spy<() => TextService>).and.returnValue(textService);

        TestBed.configureTestingModule({
            declarations: [SidebarComponent],
            providers: [
                { provide: PencilService, useValue: pencilStub },
                { provide: EraserService, useValue: eraserStub },
                { provide: LineService, useValue: lineStub },
                { provide: RectangleService, useValue: rectangleStub },
                { provide: EllipseService, useValue: ellipseStub },
                { provide: ToolManagerService, useValue: toolManagerServiceSpy },
                { provide: PopupManagerService, useValue: popupManagerSpy },
                { provide: ClipboardService, useValue: clipboardServiceStub },
                { provide: ToolStub, useValue: toolManagerServiceSpy },
                { provide: TextService, useValue: textStub },
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SidebarComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();

        undoRedoService = TestBed.inject(UndoRedoService);
        mockCommand = new PencilCommand({} as CanvasRenderingContext2D, pencilStub as PencilService);
        commandExecuteSpy = spyOn(mockCommand, 'execute');
        selectToolSpy = spyOn(component, 'onSelectTool').and.callThrough();
        component.toolManager.currentTool = pencilStub;
        undoServiceSpy = spyOn(undoRedoService, 'undo').and.callThrough();
        redoServiceSpy = spyOn(undoRedoService, 'redo').and.callThrough();
        refreshSpy = spyOn(undoRedoService, 'refresh');
        redoButton = fixture.debugElement.nativeElement.querySelector('#redoButton');
        undoButton = fixture.debugElement.nativeElement.querySelector('#undoButton');
        selectionUndoSelectionSpy = spyOn(rectangleSelectionServiceStub, 'undoSelection').and.callFake(() => {
            return;
        });
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('clicking on pencil button should select the pencil tool for user', () => {
        toolManagerServiceSpy.selectTool.and.callFake(() => {
            return pencilStub;
        });

        fixture.detectChanges();
        const pencilButton = fixture.debugElement.nativeElement.querySelector('#icon-button-Crayon');
        pencilButton.click();
        fixture.detectChanges();

        expect(selectToolSpy).toHaveBeenCalledWith({
            service: 'PencilService',
            name: 'Crayon',
            icon: 'create',
            keyShortcut: 'c',
            helpShortcut: '(Touche C)',
        });
    });

    it('clicking on eraser button should select the eraser tool for user', () => {
        toolManagerServiceSpy.selectTool.and.callFake(() => {
            return eraserStub;
        });

        fixture.detectChanges();
        const eraserButton = fixture.debugElement.nativeElement.querySelector('#icon-button-Efface');
        eraserButton.click();
        fixture.detectChanges();

        expect(selectToolSpy).toHaveBeenCalledWith({
            service: 'EraserService',
            name: 'Efface',
            icon: 'settings_cell',
            keyShortcut: 'e',
            helpShortcut: '(Touche E)',
        });
    });

    it('clicking on line button should select the line tool for user', () => {
        toolManagerServiceSpy.selectTool.and.callFake(() => {
            return lineStub;
        });

        fixture.detectChanges();
        const lineButton = fixture.debugElement.nativeElement.querySelector('#icon-button-Ligne');
        lineButton.click();
        fixture.detectChanges();

        expect(selectToolSpy).toHaveBeenCalledWith({
            service: 'LineService',
            name: 'Ligne',
            icon: 'remove',
            keyShortcut: 'l',
            helpShortcut: '(Touche L)',
        });
    });

    it('clicking on rectangle button should select the rectangle tool for user', () => {
        toolManagerServiceSpy.selectTool.and.callFake(() => {
            return rectangleStub;
        });

        fixture.detectChanges();
        const rectangleButton = fixture.debugElement.nativeElement.querySelector('#icon-button-Rectangle');
        rectangleButton.click();
        fixture.detectChanges();

        expect(selectToolSpy).toHaveBeenCalledWith({
            service: 'RectangleService',
            name: 'Rectangle',
            icon: 'crop_5_4',
            keyShortcut: '1',
            helpShortcut: '(Touche 1)',
        });
    });

    it('clicking on ellipse button should select the ellipse tool for user', () => {
        toolManagerServiceSpy.selectTool.and.callFake(() => {
            return ellipseStub;
        });

        fixture.detectChanges();
        const ellipseButton = fixture.debugElement.nativeElement.querySelector('#icon-button-Ellipse');
        ellipseButton.click();
        fixture.detectChanges();

        expect(selectToolSpy).toHaveBeenCalledWith({
            service: 'EllipseService',
            name: 'Ellipse',
            icon: 'panorama_fish_eye',
            keyShortcut: '2',
            helpShortcut: '(Touche 2)',
        });
    });

    it('when changing tool from editor, selected tool should correctly retrieve tool', () => {
        component.toolManager.currentToolSubject.next(eraserStub);
        expect(component.selectedTool).toEqual({
            service: 'EraserService',
            name: 'Efface',
            icon: 'settings_cell',
            keyShortcut: 'e',
            helpShortcut: '(Touche E)',
        });
    });

    it('pressing on newDrawing should emit to editor', () => {
        const newDrawingButton = fixture.debugElement.nativeElement.querySelector('#new-drawing-button');
        newDrawingButton.click();
        fixture.detectChanges();
        expect(popupManagerSpy.openNewDrawingPopUp).toHaveBeenCalled();
    });

    it('pressing on exportDrawing should emit to editor', () => {
        const exportDrawingButton = fixture.debugElement.nativeElement.querySelector('#export-drawing-button');
        exportDrawingButton.click();
        fixture.detectChanges();
        expect(popupManagerSpy.openExportPopUp).toHaveBeenCalled();
    });

    it('pressing on saveDrawing should emit to editor', () => {
        const saveDrawingButton = fixture.debugElement.nativeElement.querySelector('#save-drawing-button');
        saveDrawingButton.click();
        fixture.detectChanges();
        expect(popupManagerSpy.openSavePopUp).toHaveBeenCalled();
    });

    it('clicking on undo button when undo pile is not empty and tool is not used should call undoRedoService.undo', () => {
        undoRedoService.executeCommand(mockCommand);
        component.toolManager.currentTool.inUse = false;

        fixture.detectChanges();
        expect(undoButton).not.toHaveClass('unclickable');

        undoButton.click();
        fixture.detectChanges();

        expect(commandExecuteSpy).toHaveBeenCalled();
        expect(undoServiceSpy).toHaveBeenCalled();
    });

    it('clicking on undo button when undo pile is empty should not be possible', () => {
        expect(undoButton).toHaveClass('unclickable');
    });

    it('clicking on undo button when undo pile is not empty and tool is used should not call undoRedoService.undo', () => {
        undoRedoService.executeCommand(mockCommand);
        component.toolManager.currentTool.inUse = true;

        fixture.detectChanges();
        expect(undoButton).not.toHaveClass('unclickable');

        undoButton.click();
        fixture.detectChanges();

        expect(commandExecuteSpy).toHaveBeenCalled();
        expect(undoServiceSpy).not.toHaveBeenCalled();
    });

    it('clicking on undo button if currentTool is of SelectionService while is manipulating is false should call the undo pile', () => {
        rectangleSelectionServiceStub.isManipulating = false;
        (Object.getOwnPropertyDescriptor(toolManagerServiceSpy, 'currentTool')?.get as jasmine.Spy<() => Tool>).and.returnValue(
            rectangleSelectionServiceStub,
        );
        component.undo();
        expect(undoServiceSpy).toHaveBeenCalled();
    });

    it('clicking on undo button if currentTool is of SelectionService while is manipulating is true should not call the undo pile', () => {
        rectangleSelectionServiceStub.isManipulating = true;
        (Object.getOwnPropertyDescriptor(toolManagerServiceSpy, 'currentTool')?.get as jasmine.Spy<() => Tool>).and.returnValue(
            rectangleSelectionServiceStub,
        );
        component.undo();
        expect(selectionUndoSelectionSpy).toHaveBeenCalled();
        expect(component.isUndoSelection).toBeFalsy();
        expect(undoServiceSpy).not.toHaveBeenCalled();
    });

    it('clicking on redo button when redo pile is not empty and tool is not used should call undoRedoService.redo', () => {
        refreshSpy.and.callFake(() => {
            component.isRedoPossible = undoRedoService.redoPile.length !== 0;
        });
        undoRedoService.executeCommand(mockCommand);
        undoRedoService.undo();
        component.toolManager.currentTool.inUse = false;

        fixture.detectChanges();
        expect(redoButton).not.toHaveClass('unclickable');

        redoButton.click();
        fixture.detectChanges();

        expect(commandExecuteSpy).toHaveBeenCalled();
        expect(redoServiceSpy).toHaveBeenCalled();
    });

    it('clicking on redo button when redo pile is empty should not be possible', () => {
        expect(redoButton).toHaveClass('unclickable');
    });

    it('clicking on redo button when redo pile is not empty and tool is used should not call undoRedoService.redo', () => {
        refreshSpy.and.callFake(() => {
            component.isRedoPossible = undoRedoService.redoPile.length !== 0;
        });
        undoRedoService.executeCommand(mockCommand);
        undoRedoService.undo();
        component.toolManager.currentTool.inUse = true;

        fixture.detectChanges();
        expect(redoButton).not.toHaveClass('unclickable');

        redoButton.click();
        fixture.detectChanges();

        expect(commandExecuteSpy).toHaveBeenCalled();
        expect(redoServiceSpy).not.toHaveBeenCalled();
    });

    it('clicking on selectAll should change the currentTool to rectangleSelectionService and call its selectAll method', () => {
        toolManagerServiceSpy.selectTool.and.callFake(() => {
            (Object.getOwnPropertyDescriptor(toolManagerServiceSpy, 'currentTool')?.get as jasmine.Spy<() => Tool>).and.returnValue(
                rectangleSelectionServiceStub,
            );
            return rectangleSelectionServiceStub;
        });
        const selectAllSpy = spyOn(rectangleSelectionServiceStub, 'selectAll').and.callFake(() => {
            return;
        });
        component.selectAll();
        expect(selectAllSpy).toHaveBeenCalled();
    });

    it('clicking on selectAll should not call selectAll if the tool is not rectangleSelectionService', () => {
        toolManagerServiceSpy.selectTool.and.callFake(() => {
            return ellipseStub;
        });
        const selectAllSpy = spyOn(rectangleSelectionServiceStub, 'selectAll').and.callFake(() => {
            return;
        });
        component.selectAll();
        expect(selectAllSpy).not.toHaveBeenCalled();
    });

    it('openGridOptions should set isGridOptionsDisplayed to false if initially true', () => {
        component.toolManager.textService.lockKeyboard = true;
        component.isGridOptionsDisplayed = true;
        component.openGridOptions();
        expect(component.isGridOptionsDisplayed).toBeFalse();
    });

    it('openGridOptions should set isGridOptionsDisplayed to true if initially false', () => {
        component.toolManager.textService.lockKeyboard = false;
        component.isGridOptionsDisplayed = false;
        component.openGridOptions();
        expect(component.isGridOptionsDisplayed).toBeTrue();
    });

    it('clicking on copySelection should only copy if currentTool is one of the tool selection (rectangle)', () => {
        component.copySelection();
        expect(clipboardServiceStub.copySelection).toHaveBeenCalled();
    });

    it('clicking on cutSelection should only copy if currentTool is one of the tool selection (rectangle)', () => {
        component.cutSelection();
        expect(clipboardServiceStub.cutSelection).toHaveBeenCalled();
    });

    it('clicking on deleteSelection should only copy if currentTool is one of the tool selection (rectangle)', () => {
        component.deleteSelection();
        expect(clipboardServiceStub.deleteSelection).toHaveBeenCalled();
    });

    it('clicking on pasteSelection should call clipboardService method', () => {
        component.pasteSelection();
        expect(clipboardServiceStub.pasteSelection).toHaveBeenCalled();
    });
});
