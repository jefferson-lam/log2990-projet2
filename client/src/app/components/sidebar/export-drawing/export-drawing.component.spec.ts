import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { MIN_HEIGHT_CANVAS } from '@app/constants/canvas-constants';
import { MAX_EXPORT_CANVAS_HEIGHT, MAX_EXPORT_CANVAS_WIDTH } from '@app/constants/popup-constants';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ExportDrawingComponent } from './export-drawing.component';

describe('ExportDrawingComponent', () => {
    let component: ExportDrawingComponent;
    let fixture: ComponentFixture<ExportDrawingComponent>;
    let drawingStub: DrawingService;
    //let imgurService: ImgurService;

    let testCanvas: HTMLCanvasElement;
    let testCtx: CanvasRenderingContext2D;

    let clickSpy: jasmine.Spy;

    beforeEach(async(() => {
        drawingStub = new DrawingService();

        TestBed.configureTestingModule({
            imports: [FormsModule],
            declarations: [ExportDrawingComponent],
            providers: [{ provide: DrawingService, useValue: drawingStub }],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();

        //imgurService = TestBed.inject(ImgurService);
        drawingStub.canvas = TestBed.inject(CanvasTestHelper).canvas;

        testCanvas = document.createElement('canvas');
        testCtx = testCanvas.getContext('2d') as CanvasRenderingContext2D;
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ExportDrawingComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();

        clickSpy = spyOn(component.link, 'click');
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('ngAfterViewInit should call refreshCanvas', () => {
        const refreshSpy = spyOn(component, 'refreshCanvas');
        component.ngAfterViewInit();

        expect(refreshSpy).toHaveBeenCalled();
    });

    it('changeWhiteToAlpha should set white pixels to rgba(0,0,0,0)', () => {
        testCtx.fillStyle = 'white';
        testCtx.fillRect(0, 0, 1, 1);
        let imgData = testCtx.getImageData(0, 0, testCanvas.width, testCanvas.height);

        component.changeWhiteToAlpha(imgData);

        imgData = component.exportCtx.getImageData(0, 0, 1, 1);
        for (const rgbValue of imgData.data) {
            expect(rgbValue).toBe(0);
        }
    });

    it('refreshCanvas should get baseCtx imageData and draw on exportCtx', () => {
        const baseSpy = spyOn(component.baseCtx, 'getImageData').and.callThrough();
        const exportSpy = spyOn(component.exportCtx, 'drawImage');

        component.refreshCanvas();

        expect(baseSpy).toHaveBeenCalled();
        expect(baseSpy).toHaveBeenCalledWith(0, 0, component.baseCanvas.width, component.baseCanvas.height);
        expect(exportSpy).toHaveBeenCalled();
    });

    it('refreshCanvas should call changeWhiteToAlpha if passed argument true', () => {
        const changeWhiteToAlphaSpy = spyOn(component, 'changeWhiteToAlpha');

        component.refreshCanvas(true);

        expect(changeWhiteToAlphaSpy).toHaveBeenCalled();
    });

    it('refreshCanvas should call putImageData with exportCtx if no argument passed', () => {
        const exportSpy = spyOn(component.exportCtx, 'putImageData');

        component.refreshCanvas();

        expect(exportSpy).toHaveBeenCalled();
    });

    it("setPopupSizes should set canvasStyleHeight to MAX_EXPORT_CANVAS_HEIGHT+'px' if height bigger than width", () => {
        component.baseCanvas.height = MIN_HEIGHT_CANVAS + 1;
        component.baseCanvas.width = MIN_HEIGHT_CANVAS;
        component.setPopupSizes();

        expect(component.canvasStyleHeight).toBe(MAX_EXPORT_CANVAS_HEIGHT + 'px');
    });

    it("setPopupSizes should set canvasStyleWidth to (canvas.width/canvas.height)*MAX_EXPORT_CANVAS_WIDTH+'px' if height bigger than width", () => {
        component.baseCanvas.height = MIN_HEIGHT_CANVAS + 1;
        component.baseCanvas.width = MIN_HEIGHT_CANVAS;
        component.setPopupSizes();

        expect(component.canvasStyleWidth).toBe((component.baseCanvas.width / component.baseCanvas.height) * MAX_EXPORT_CANVAS_WIDTH + 'px');
    });

    it("setPopupSizes should set canvasStyleWidth to MAX_EXPORT_CANVAS_WIDTH+'px' if width bigger than height", () => {
        component.baseCanvas.height = MIN_HEIGHT_CANVAS;
        component.baseCanvas.width = MIN_HEIGHT_CANVAS + 1;
        component.setPopupSizes();

        expect(component.canvasStyleWidth).toBe(MAX_EXPORT_CANVAS_WIDTH + 'px');
    });

    it("setPopupSizes should set canvasStyleWidth to (canvas.height/canvas.width)*MAX_EXPORT_CANVAS_HEIGHT+'px' if width bigger than height", () => {
        component.baseCanvas.height = MIN_HEIGHT_CANVAS;
        component.baseCanvas.width = MIN_HEIGHT_CANVAS + 1;
        component.setPopupSizes();

        expect(component.canvasStyleHeight).toBe((component.baseCanvas.height / component.baseCanvas.width) * MAX_EXPORT_CANVAS_HEIGHT + 'px');
    });

    it('applyFilter should set filter of exportCtx', () => {
        component.applyFilter('invert(100%)');

        expect(component.exportCtx.filter).toBe('invert(100%)');
    });

    it('applyFilter should call refreshCanvas with true if not invert filter', () => {
        const refreshSpy = spyOn(component, 'refreshCanvas');

        component.applyFilter('sepia(100%)');

        expect(refreshSpy).toHaveBeenCalled();
        expect(refreshSpy).toHaveBeenCalledWith(true);
    });

    it('applyFilter should call refreshCanvas without arguments if invert filter', () => {
        const refreshSpy = spyOn(component, 'refreshCanvas');

        component.applyFilter('invert(100%)');

        expect(refreshSpy).toHaveBeenCalled();
        expect(refreshSpy).toHaveBeenCalledWith();
    });

    it('saveImage should set link href with image data and click it', () => {
        const imgDataSpy = spyOn(component.exportCanvas, 'toDataURL').and.callThrough();

        component.saveImage();

        expect(component.link.download).toBe(component.name + '.' + component.type);
        expect(imgDataSpy).toHaveBeenCalled();
        expect(imgDataSpy).toHaveBeenCalledWith('image/' + component.type);
        expect(component.link.href).not.toBeUndefined();
        expect(clickSpy).toHaveBeenCalled();
    });

    // it('exportToImgur should set link href with image data and call imgurService.exportDrawing', () => {
    //     const imgDataSpy = spyOn(component.exportCanvas, 'toDataURL').and.callThrough();
    //     const exportDrawingSpy = spyOn(imgurService, 'exportDrawing');

    //     component.exportToImgur();

    //     expect(imgDataSpy).toHaveBeenCalled();
    //     expect(imgDataSpy).toHaveBeenCalledWith('image/' + component.type, component.name);
    //     expect(exportDrawingSpy).toHaveBeenCalledWith(component.exportCanvas.toDataURL('image/' + component.type), component.name);
    // });

    // it('openPopUp should call openErrorPopUp if url is none', () => {
    //     const openErrorPopUpSpy = spyOn(component, 'openErrorPopUp');
    //     component.url = 'none';

    //     component.openPopUp();
    //     expect(openErrorPopUpSpy).toHaveBeenCalled();
    // });

    // it('openPopUp should call openCompletePopUp if url is not none', () => {
    //     const openCompletePopUpSpy = spyOn(component, 'openCompletePopUp');
    //     component.url = 'notnone';

    //     component.openPopUp();
    //     expect(openCompletePopUpSpy).toHaveBeenCalled();
    // });

    // it('openErrorPopUp should open ExportErrorPageComponent dialog if popUpToggle = ExportDrawingConstants.PopUpToggle.ERROR', () => {
    //     const openSpy = spyOn(component.newDialog, 'open');
    //     component.popUpToggle = ExportDrawingConstants.PopUpToggle.ERROR;

    //     component.openErrorPopUp();
    //     expect(openSpy).toHaveBeenCalled();
    //     expect(openSpy).toHaveBeenCalledWith(ExportErrorPageComponent);
    // });

    // it('openErrorPopUp should not open ExportErrorPageComponent dialog if popUpToggle != ExportDrawingConstants.PopUpToggle.ERROR', () => {
    //     const openSpy = spyOn(component.newDialog, 'open');
    //     component.popUpToggle = 0;

    //     component.openErrorPopUp();
    //     expect(openSpy).not.toHaveBeenCalled();
    //     expect(openSpy).not.toHaveBeenCalledWith(ExportErrorPageComponent);
    // });

    // it('openCompletePopUp should open ExportCompletePageComponent dialog if popUpToggle = ExportDrawingConstants.PopUpToggle.COMPLETE', () => {
    //     const openSpy = spyOn(component.newDialog, 'open');
    //     component.popUpToggle = ExportDrawingConstants.PopUpToggle.COMPLETE;

    //     component.openErrorPopUp();
    //     expect(openSpy).toHaveBeenCalled();
    //     expect(openSpy).toHaveBeenCalledWith(ExportCompletePageComponent);
    // });

    // it('openCompletePopUp should not open ExportCompletePageComponent dialog if popUpToggle != ExportDrawingConstants.PopUpToggle.COMPLETE', () => {
    //     const openSpy = spyOn(component.newDialog, 'open');
    //     component.popUpToggle = 0;

    //     component.openErrorPopUp();
    //     expect(openSpy).not.toHaveBeenCalled();
    //     expect(openSpy).not.toHaveBeenCalledWith(ExportCompletePageComponent);
    // });
});
