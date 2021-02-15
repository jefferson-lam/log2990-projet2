import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
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

describe('SidebarComponent', () => {
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

        expect(selectToolSpy).toHaveBeenCalledWith('c');
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

        expect(selectToolSpy).toHaveBeenCalledWith('e');
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

        expect(selectToolSpy).toHaveBeenCalledWith('l');
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

        expect(selectToolSpy).toHaveBeenCalledWith('1');
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

        expect(selectToolSpy).toHaveBeenCalledWith('2');
        expect(selectToolEmitterSpy).toHaveBeenCalledWith(ellipseStub);
    });

    it('on click, return button should return to main page', () => {
        const backSpy = spyOn<any>(component, 'backClick').and.callThrough();
        fixture.detectChanges();
        const btn = fixture.debugElement.nativeElement.querySelector('#return-button');
        btn.click();
        fixture.detectChanges();
        expect(backSpy).toHaveBeenCalledWith();
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

    it('click on return button should return to main page', () => {
        const backSpy = spyOn<any>(component, 'backClick').and.callThrough();

        fixture.detectChanges();
        const btn = fixture.debugElement.nativeElement.querySelector('#return-button');
        btn.click();
        fixture.detectChanges();

        expect(backSpy).toHaveBeenCalled();
    });
});
