import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { MIN_HEIGHT_CANVAS } from '@app/constants/canvas-constants';
import { MAX_RGB_VALUE } from '@app/constants/color-constants';
import { MAX_EXPORT_CANVAS_HEIGHT, MAX_EXPORT_CANVAS_WIDTH } from '@app/constants/popup-constants';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ExportDrawingComponent } from './export-drawing.component';
import Spy = jasmine.Spy;

describe('ExportDrawingComponent', () => {
    let component: ExportDrawingComponent;
    let fixture: ComponentFixture<ExportDrawingComponent>;
    let drawServiceMock: jasmine.SpyObj<DrawingService>;

    let canvasTestHelper: CanvasTestHelper;
    let baseCtxStub: CanvasRenderingContext2D;

    let clickSpy: jasmine.Spy;

    beforeEach(async(() => {
        drawServiceMock = jasmine.createSpyObj('DrawingService', [], ['canvas']);
        (Object.getOwnPropertyDescriptor(drawServiceMock, 'canvas')?.get as Spy<() => HTMLCanvasElement>).and.returnValue({} as HTMLCanvasElement);

        TestBed.configureTestingModule({
            declarations: [ExportDrawingComponent],
            providers: [{ provide: DrawingService, useValue: drawServiceMock }],
        }).compileComponents();

        canvasTestHelper = TestBed.inject(CanvasTestHelper);
        baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ExportDrawingComponent);
        component = fixture.componentInstance;
        component.baseCanvas = baseCtxStub.canvas;
        fixture.detectChanges();

        clickSpy = spyOn(component.link, 'click');
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('ngAfterViewInit should call drawImageand toDataUrl', () => {
        const toDataUrlSpy = spyOn(component.exportCanvas, 'toDataURL');
        const drawImageSpy = spyOn(component.exportCtx, 'drawImage');
        component.ngAfterViewInit();

        expect(drawImageSpy).toHaveBeenCalled();
        expect(toDataUrlSpy).toHaveBeenCalled();
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

    it('applyFilter should set filter of both exportImg and exportCanvas', () => {
        component.applyFilter('invert(0%)');

        expect(component.exportCanvas.style.filter).toBe('invert(0%)');
        expect(component.exportImg.nativeElement.style.filter).toBe('invert(0%)');
    });

    it('createBackground should fill background white if not invert filter', () => {
        component.createBackground();

        const imgData = component.exportCtx.getImageData(0, 0, 1, 1);
        for (const rgbValue of imgData.data) {
            expect(rgbValue).toBe(MAX_RGB_VALUE);
        }
    });

    it('createBackground should fill background black if invert filter', () => {
        component.applyFilter('invert(0%)');
        component.createBackground();

        const imgData = component.exportCtx.getImageData(0, 0, 1, 1);
        // tslint:disable-next-line:no-magic-numbers
        for (let i = 0; i < imgData.data.length; i += 4) {
            expect(imgData.data[i]).toBe(0);
            expect(imgData.data[i + 1]).toBe(0);
            expect(imgData.data[i + 2]).toBe(0);
            // tslint:disable-next-line:no-magic-numbers
            expect(imgData.data[i + 3]).toBe(MAX_RGB_VALUE);
        }
    });

    it('saveImage should call createBackground if jpeg type', () => {
        component.type = 'jpeg';
        const backgroundSpy = spyOn(component, 'createBackground');

        component.saveImage();

        expect(backgroundSpy).toHaveBeenCalled();
    });

    it('saveImage should not call createBackground if not jpeg type', () => {
        const backgroundSpy = spyOn(component, 'createBackground');

        component.saveImage();

        expect(backgroundSpy).not.toHaveBeenCalled();
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
});
