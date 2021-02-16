import { CUSTOM_ELEMENTS_SCHEMA, SimpleChange } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Tool } from '@app/classes/tool';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ToolManagerService } from '@app/services/manager/tool-manager-service';
import { EllipseService } from '@app/services/tools/ellipse-service';
import { EraserService } from '@app/services/tools/eraser-service';
import { LineService } from '@app/services/tools/line-service';
import { PencilService } from '@app/services/tools/pencil-service';
import { RectangleService } from '@app/services/tools/rectangle-service';
import { SidebarComponent } from './sidebar.component';

class ToolStub extends Tool {}

fdescribe('SidebarComponent', () => {
    let component: SidebarComponent;
    let pencilStub: ToolStub;
    let eraserStub: ToolStub;
    let lineStub: ToolStub;
    let rectangleStub: ToolStub;
    let ellipseStub: ToolStub;
    let fixture: ComponentFixture<SidebarComponent>;
    let toolManagerServiceSpy: jasmine.SpyObj<ToolManagerService>;

    // tslint:disable:no-any
    beforeEach(async(() => {
        toolManagerServiceSpy = jasmine.createSpyObj('ToolManagerService', ['getTool']);
        pencilStub = new ToolStub({} as DrawingService);
        eraserStub = new ToolStub({} as DrawingService);
        lineStub = new ToolStub({} as DrawingService);
        rectangleStub = new ToolStub({} as DrawingService);
        ellipseStub = new ToolStub({} as DrawingService);
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

        expect(selectToolSpy).toHaveBeenCalledWith({ name: 'Efface', icon: 'delete_outline', keyShortcut: 'e', helpShortcut: '(Touche E)' });
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

        expect(selectToolSpy).toHaveBeenCalledWith({ name: 'Ligne', icon: 'trending_flat', keyShortcut: 'l', helpShortcut: '(Touche L)' });
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

        expect(selectToolSpy).toHaveBeenCalledWith({ name: 'Rectangle', icon: 'crop_portrait', keyShortcut: '1', helpShortcut: '(Touche 1)' });
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

        expect(selectToolSpy).toHaveBeenCalledWith({ name: 'Ellipse', icon: 'vignette', keyShortcut: '2', helpShortcut: '(Touche 2)' });
        expect(selectToolEmitterSpy).toHaveBeenCalledWith(ellipseStub);
    });

    it('when changing tool from editor, selected tool should correctly retrieve tool from map', () => {
        component.ngOnChanges({
            currentTool: new SimpleChange(null, pencilStub, true),
        });
        console.log(component.selectedTool);
        expect(component.selectedTool).toEqual({ name: 'Efface', icon: 'delete_outline', keyShortcut: 'e', helpShortcut: '(Touche E)' });
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
});
