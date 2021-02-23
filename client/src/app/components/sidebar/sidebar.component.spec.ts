import { CUSTOM_ELEMENTS_SCHEMA, SimpleChange } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Command } from '@app/classes/command';
import { Tool } from '@app/classes/tool';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ToolManagerService } from '@app/services/manager/tool-manager-service';
import { EllipseService } from '@app/services/tools/ellipse/ellipse-service';
import { EraserService } from '@app/services/tools/eraser/eraser-service';
import { LineService } from '@app/services/tools/line/line-service';
import { PencilCommand } from '@app/services/tools/pencil/pencil-command';
import { PencilService } from '@app/services/tools/pencil/pencil-service';
import { RectangleService } from '@app/services/tools/rectangle/rectangle-service';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';
import { SidebarComponent } from './sidebar.component';

class ToolStub extends Tool {}

describe('SidebarComponent', () => {
    let component: SidebarComponent;
    let pencilStub: ToolStub;
    let eraserStub: ToolStub;
    let lineStub: ToolStub;
    let rectangleStub: ToolStub;
    let ellipseStub: ToolStub;
    let fixture: ComponentFixture<SidebarComponent>;
    let toolManagerServiceSpy: jasmine.SpyObj<ToolManagerService>;
    let undoRedoService: UndoRedoService;
    let mockCommand: Command;
    let commandExecuteSpy: jasmine.Spy;

    // tslint:disable:no-any
    beforeEach(async(() => {
        toolManagerServiceSpy = jasmine.createSpyObj('ToolManagerService', ['getTool']);
        pencilStub = new PencilService({} as DrawingService, {} as UndoRedoService);
        eraserStub = new EraserService({} as DrawingService, {} as UndoRedoService);
        lineStub = new LineService({} as DrawingService, {} as UndoRedoService);
        rectangleStub = new RectangleService({} as DrawingService, {} as UndoRedoService);
        ellipseStub = new EllipseService({} as DrawingService, {} as UndoRedoService);
        TestBed.configureTestingModule({
            declarations: [SidebarComponent],
            providers: [
                { provide: PencilService, useValue: pencilStub },
                { provide: EraserService, useValue: eraserStub },
                { provide: LineService, useValue: lineStub },
                { provide: RectangleService, useValue: rectangleStub },
                { provide: EllipseService, useValue: ellipseStub },
                { provide: ToolManagerService, useValue: toolManagerServiceSpy },
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        })
            .compileComponents()
            .then(() => {
                fixture = TestBed.createComponent(SidebarComponent);
                component = fixture.componentInstance;
                fixture.detectChanges();
            });
        undoRedoService = TestBed.inject(UndoRedoService);
        mockCommand = new PencilCommand({} as CanvasRenderingContext2D, pencilStub as PencilService);
        commandExecuteSpy = spyOn(mockCommand, 'execute');
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('clicking on pencil button should select the pencil tool for user', () => {
        const selectToolEmitterSpy = spyOn(component.notifyOnToolSelect, 'emit');
        const selectToolSpy = spyOn(component, 'onSelectTool').and.callThrough();
        toolManagerServiceSpy.getTool.and.callFake(() => {
            return pencilStub;
        });

        fixture.detectChanges();
        const pencilButton = fixture.debugElement.nativeElement.querySelector('#icon-button-Crayon');
        pencilButton.click();
        fixture.detectChanges();

        expect(selectToolSpy).toHaveBeenCalledWith({ name: 'Crayon', icon: 'create', keyShortcut: 'c', helpShortcut: '(Touche C)' });
        expect(selectToolEmitterSpy).toHaveBeenCalledWith(pencilStub);
    });

    it('clicking on eraser button should select the eraser tool for user', () => {
        const selectToolEmitterSpy = spyOn(component.notifyOnToolSelect, 'emit');
        const selectToolSpy = spyOn<any>(component, 'onSelectTool').and.callThrough();
        toolManagerServiceSpy.getTool.and.callFake(() => {
            return eraserStub;
        });

        fixture.detectChanges();
        const eraserButton = fixture.debugElement.nativeElement.querySelector('#icon-button-Efface');
        eraserButton.click();
        fixture.detectChanges();

        expect(selectToolSpy).toHaveBeenCalledWith({ name: 'Efface', icon: 'settings_cell', keyShortcut: 'e', helpShortcut: '(Touche E)' });
        expect(selectToolEmitterSpy).toHaveBeenCalledWith(eraserStub);
    });

    it('clicking on line button should select the line tool for user', () => {
        const selectToolEmitterSpy = spyOn(component.notifyOnToolSelect, 'emit');
        const selectToolSpy = spyOn<any>(component, 'onSelectTool').and.callThrough();
        toolManagerServiceSpy.getTool.and.callFake(() => {
            return lineStub;
        });

        fixture.detectChanges();
        const lineButton = fixture.debugElement.nativeElement.querySelector('#icon-button-Ligne');
        lineButton.click();
        fixture.detectChanges();

        expect(selectToolSpy).toHaveBeenCalledWith({ name: 'Ligne', icon: 'remove', keyShortcut: 'l', helpShortcut: '(Touche L)' });
        expect(selectToolEmitterSpy).toHaveBeenCalledWith(lineStub);
    });

    it('clicking on rectangle button should select the rectangle tool for user', () => {
        const selectToolEmitterSpy = spyOn(component.notifyOnToolSelect, 'emit');
        const selectToolSpy = spyOn<any>(component, 'onSelectTool').and.callThrough();
        toolManagerServiceSpy.getTool.and.callFake(() => {
            return rectangleStub;
        });

        fixture.detectChanges();
        const rectangleButton = fixture.debugElement.nativeElement.querySelector('#icon-button-Rectangle');
        rectangleButton.click();
        fixture.detectChanges();

        expect(selectToolSpy).toHaveBeenCalledWith({ name: 'Rectangle', icon: 'crop_5_4', keyShortcut: '1', helpShortcut: '(Touche 1)' });
        expect(selectToolEmitterSpy).toHaveBeenCalledWith(rectangleStub);
    });

    it('clicking on ellipse button should select the ellipse tool for user', () => {
        const selectToolEmitterSpy = spyOn(component.notifyOnToolSelect, 'emit');
        const selectToolSpy = spyOn<any>(component, 'onSelectTool').and.callThrough();
        toolManagerServiceSpy.getTool.and.callFake(() => {
            return ellipseStub;
        });

        fixture.detectChanges();
        const ellipseButton = fixture.debugElement.nativeElement.querySelector('#icon-button-Ellipse');
        ellipseButton.click();
        fixture.detectChanges();

        expect(selectToolSpy).toHaveBeenCalledWith({ name: 'Ellipse', icon: 'panorama_fish_eye', keyShortcut: '2', helpShortcut: '(Touche 2)' });
        expect(selectToolEmitterSpy).toHaveBeenCalledWith(ellipseStub);
    });

    it('when changing tool from editor, selected tool should correctly retrieve tool from map', () => {
        component.ngOnChanges({
            currentTool: new SimpleChange(null, eraserStub, false),
        });
        expect(component.selectedTool).toEqual({ name: 'Efface', icon: 'settings_cell', keyShortcut: 'e', helpShortcut: '(Touche E)' });
    });

    it('calling openSettings should set internal attribute opened to true', () => {
        component.openSettings();
        expect(component.opened).toBeTruthy();
    });

    it('calling closeSettings should set internal attribute opened to false', () => {
        component.closeSettings();
        expect(component.opened).toBeFalsy();
    });

    it('pressing on newDrawing should emit to editor', () => {
        const notifyEditorNewDrawingSpy = spyOn<any>(component.notifyEditorNewDrawing, 'emit');
        const newDrawingButton = fixture.debugElement.nativeElement.querySelector('#new-drawing-button');
        newDrawingButton.click();
        fixture.detectChanges();
        expect(notifyEditorNewDrawingSpy).toHaveBeenCalledWith(component.isNewDrawing);
    });

    it('clicking on undo button when undo pile is not empty should call undoRedoService.undo', () => {
        const undoServiceSpy = spyOn(undoRedoService, 'undo');
        undoRedoService.executeCommand(mockCommand);

        fixture.detectChanges();
        const undoButton = fixture.debugElement.nativeElement.querySelector('#undoButton');
        undoButton.click();
        fixture.detectChanges();

        expect(undoButton.classes).toBeUndefined();
        expect(undoServiceSpy).toHaveBeenCalled();
        expect(commandExecuteSpy).toHaveBeenCalled();
    });

    it('clicking on undo button when undo pile is empty should not be possible', () => {
        const undoButton = fixture.debugElement.nativeElement.querySelector('#undoButton');

        expect(undoButton).toHaveClass('unclickable');
    });

    it('clicking on redo button when redo pile is not empty should call undoRedoService.redo', () => {
        const redoServiceSpy = spyOn(undoRedoService, 'redo');
        undoRedoService.executeCommand(mockCommand);

        fixture.detectChanges();
        const redoButton = fixture.debugElement.nativeElement.querySelector('#redoButton');
        redoButton.click();
        fixture.detectChanges();

        expect(redoButton.classes).toBeUndefined();
        expect(redoServiceSpy).toHaveBeenCalled();
        expect(commandExecuteSpy).toHaveBeenCalled();
    });

    it('clicking on redo button when redo pile is empty should not be possible', () => {
        const redoButton = fixture.debugElement.nativeElement.querySelector('#redoButton');

        expect(redoButton).toHaveClass('unclickable');
    });
});
