import { CdkDragEnd, CdkDragMove } from '@angular/cdk/drag-drop';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { ResizerComponent } from '@app/components/resizer/resizer.component';
import * as CanvasConstants from '@app/constants/canvas-constants';
import { DrawingService } from '@app/services/drawing/drawing.service';

describe('ResizerComponent', () => {
    let component: ResizerComponent;
    let fixture: ComponentFixture<ResizerComponent>;
    let canvasTestHelper: CanvasTestHelper;
    let baseCtxStub: CanvasRenderingContext2D;
    let previewCtxStub: CanvasRenderingContext2D;
    let drawPreviewSpy: jasmine.Spy;
    let baseCanvas: HTMLCanvasElement;
    let previewLayer: HTMLCanvasElement;
    let sideResizer: HTMLElement;
    let cornerResizer: HTMLElement;
    let bottomResizer: HTMLElement;
    const drawingService: DrawingService = new DrawingService();

    const cdkDragEndEvent: CdkDragEnd = {} as CdkDragEnd;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ResizerComponent],
            providers: [{ provide: DrawingService, useValue: drawingService }],
        }).compileComponents();
    }));

    beforeEach(() => {
        sideResizer = document.createElement('div');
        sideResizer.id = 'sideResizer';
        bottomResizer = document.createElement('div');
        bottomResizer.id = 'bottomResizer';
        cornerResizer = document.createElement('div');
        cornerResizer.id = 'cornerResizer';
        baseCanvas = document.createElement('canvas');
        baseCanvas.id = 'canvas';
        previewLayer = document.createElement('canvas');
        previewLayer.id = 'previewLayer';

        document.body.append(baseCanvas);
        document.body.append(previewLayer);
        document.body.append(sideResizer);
        document.body.append(bottomResizer);
        document.body.append(cornerResizer);

        fixture = TestBed.createComponent(ResizerComponent);
        component = fixture.componentInstance;

        canvasTestHelper = TestBed.inject(CanvasTestHelper);
        baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        previewCtxStub = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;

        drawingService.previewCtx = previewCtxStub;
        drawingService.baseCtx = baseCtxStub;

        component.baseCtx = baseCtxStub;
        component.previewCtx = previewCtxStub;
        component.baseCtx.canvas.width = CanvasConstants.MIN_LENGTH_CANVAS;
        component.baseCtx.canvas.height = CanvasConstants.MIN_HEIGHT_CANVAS;
        component.previewCtx.canvas.width = CanvasConstants.MIN_LENGTH_CANVAS;
        component.previewCtx.canvas.height = CanvasConstants.MIN_HEIGHT_CANVAS;

        drawPreviewSpy = spyOn(component, 'drawPreviewOfNewSize').and.callThrough();

        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('lockMinCanvasValue should set canvas height and width to minimum 250px', () => {
        component.previewCtx.canvas.width = CanvasConstants.MIN_LENGTH_CANVAS - 1;
        component.previewCtx.canvas.height = CanvasConstants.MIN_HEIGHT_CANVAS - 1;
        component.lockMinCanvasValue();
        expect(component.sideResizer.nativeElement.style.left).toEqual(CanvasConstants.MIN_LENGTH_CANVAS + 'px');
        expect(component.cornerResizer.nativeElement.style.left).toEqual(CanvasConstants.MIN_LENGTH_CANVAS + 'px');
        expect(component.cornerResizer.nativeElement.style.top).toEqual(CanvasConstants.MIN_HEIGHT_CANVAS + 'px');
        expect(component.bottomResizer.nativeElement.style.top).toEqual(CanvasConstants.MIN_HEIGHT_CANVAS + 'px');
    });

    it('lockMinCanvasValue should set canvas width to minimum 250px', () => {
        const oldCanvasHeight = 400;
        component.previewCtx.canvas.width = CanvasConstants.MIN_LENGTH_CANVAS - 1;
        component.previewCtx.canvas.height = oldCanvasHeight;
        component.lockMinCanvasValue();
        expect(component.sideResizer.nativeElement.style.left).toEqual(CanvasConstants.MIN_LENGTH_CANVAS + 'px');
        expect(component.cornerResizer.nativeElement.style.left).toEqual(CanvasConstants.MIN_LENGTH_CANVAS + 'px');
        expect(component.bottomResizer.nativeElement.style.left).toEqual(CanvasConstants.MIN_LENGTH_CANVAS / 2 + 'px');
    });

    it('lockMinCanvasValue should set canvas height to minimum 250px', () => {
        const oldCanvasWidth = 400;
        component.previewCtx.canvas.width = oldCanvasWidth;
        component.previewCtx.canvas.height = CanvasConstants.MIN_HEIGHT_CANVAS - 1;
        component.lockMinCanvasValue();
        expect(component.sideResizer.nativeElement.style.top).toEqual(CanvasConstants.MIN_HEIGHT_CANVAS / 2 + 'px');
        expect(component.cornerResizer.nativeElement.style.top).toEqual(CanvasConstants.MIN_HEIGHT_CANVAS + 'px');
        expect(component.bottomResizer.nativeElement.style.top).toEqual(CanvasConstants.MIN_HEIGHT_CANVAS + 'px');
    });

    // Test: drawPreviewOfNewSize()
    // Cases:
    // 1. SideResizer: expanding sizes correctly and adjusts button correctly
    // 2. SideResizer: reducing sizes correctly and adjusts buttons correctly
    // 3. BottomResizer: expanding ...
    // 4. BottomResizer: reducing ...
    // 5. CornerResizer: +dx, +dy
    // 6. CornerResizer: +dx, -dy
    // 7. CornerResizer: -dx, +dy
    // 7. CornerResizer: -dx, -dy

    it('drawPreviewOfNewSize of bigger canvas on sideResizer sets buttons and previewCanvas to correct size', () => {
        component.isSideResizerDown = true;
        const newCanvasWidth = 1500;
        const mousePositionY = 400;
        component.previewCtx.canvas.width = newCanvasWidth;
        component.previewCtx.canvas.height = mousePositionY;

        component.drawPreviewOfNewSize();

        expect(component.cornerResizer.nativeElement.style.left).toEqual(newCanvasWidth + 'px');
        expect(component.sideResizer.nativeElement.style.left).toEqual(newCanvasWidth + 'px');
        expect(component.bottomResizer.nativeElement.style.left).toEqual(newCanvasWidth / 2 + 'px');
        expect(component.sideResizer.nativeElement.style.transform).toEqual('');
    });

    it('drawPreviewOfNewSize of smaller canvas on sideResizer sets buttons and previewCanvas to correct size', () => {
        component.isSideResizerDown = true;
        const newCanvasWidth = 600;
        const mousePositionY = 400;
        component.previewCtx.canvas.width = newCanvasWidth;
        component.previewCtx.canvas.height = mousePositionY;

        component.drawPreviewOfNewSize();

        expect(component.cornerResizer.nativeElement.style.left).toEqual(newCanvasWidth + 'px');
        expect(component.sideResizer.nativeElement.style.left).toEqual(newCanvasWidth + 'px');
        expect(component.bottomResizer.nativeElement.style.left).toEqual(newCanvasWidth / 2 + 'px');
        expect(component.sideResizer.nativeElement.style.transform).toEqual('');
    });

    it('drawPreviewOfNewSize of bigger canvas on bottomResizer sets buttons and previewCanvas to correct size', () => {
        component.isBottomResizerDown = true;
        const mousePositionX = 500;
        const newCanvasHeight = 1200;
        component.previewCtx.canvas.width = mousePositionX;
        component.previewCtx.canvas.height = newCanvasHeight;

        component.drawPreviewOfNewSize();

        expect(component.cornerResizer.nativeElement.style.top).toEqual(newCanvasHeight + 'px');
        expect(component.sideResizer.nativeElement.style.top).toEqual(newCanvasHeight / 2 + 'px');
        expect(component.bottomResizer.nativeElement.style.top).toEqual(newCanvasHeight + 'px');
        expect(component.bottomResizer.nativeElement.style.transform).toEqual('');
    });

    it('drawPreviewOfNewSize of smaller canvas on bottomResizer sets buttons and previewCanvas to correct size', () => {
        component.isBottomResizerDown = true;
        const mousePositionX = 500;
        const newCanvasHeight = 300;
        component.previewCtx.canvas.width = mousePositionX;
        component.previewCtx.canvas.height = newCanvasHeight;

        component.drawPreviewOfNewSize();

        expect(component.cornerResizer.nativeElement.style.top).toEqual(newCanvasHeight + 'px');
        expect(component.sideResizer.nativeElement.style.top).toEqual(newCanvasHeight / 2 + 'px');
        expect(component.bottomResizer.nativeElement.style.top).toEqual(newCanvasHeight + 'px');
        expect(component.bottomResizer.nativeElement.style.transform).toEqual('');
    });

    it('drawPreviewOfNewSize of +dx, +dy canvas on cornerResizer sets buttons and previewCanvas to correct size', () => {
        component.isCornerResizerDown = true;
        const newCanvasWidth = 1500;
        const newCanvasHeight = 1050;
        component.previewCtx.canvas.width = newCanvasWidth;
        component.previewCtx.canvas.height = newCanvasHeight;

        component.drawPreviewOfNewSize();

        expect(component.cornerResizer.nativeElement.style.left).toEqual(newCanvasWidth + 'px');
        expect(component.cornerResizer.nativeElement.style.top).toEqual(newCanvasHeight + 'px');
        expect(component.sideResizer.nativeElement.style.left).toEqual(newCanvasWidth + 'px');
        expect(component.sideResizer.nativeElement.style.top).toEqual(newCanvasHeight / 2 + 'px');
        expect(component.bottomResizer.nativeElement.style.left).toEqual(newCanvasWidth / 2 + 'px');
        expect(component.bottomResizer.nativeElement.style.top).toEqual(newCanvasHeight + 'px');
        expect(component.cornerResizer.nativeElement.style.transform).toEqual('');
    });

    it('drawPreviewOfNewSize of +dx, -dy canvas on cornerResizer sets buttons and previewCanvas to correct size', () => {
        component.isCornerResizerDown = true;
        const newCanvasWidth = 1500;
        const newCanvasHeight = 400;
        component.previewCtx.canvas.width = newCanvasWidth;
        component.previewCtx.canvas.height = newCanvasHeight;

        component.drawPreviewOfNewSize();

        expect(component.cornerResizer.nativeElement.style.left).toEqual(newCanvasWidth + 'px');
        expect(component.cornerResizer.nativeElement.style.top).toEqual(newCanvasHeight + 'px');
        expect(component.sideResizer.nativeElement.style.left).toEqual(newCanvasWidth + 'px');
        expect(component.sideResizer.nativeElement.style.top).toEqual(newCanvasHeight / 2 + 'px');
        expect(component.bottomResizer.nativeElement.style.left).toEqual(newCanvasWidth / 2 + 'px');
        expect(component.bottomResizer.nativeElement.style.top).toEqual(newCanvasHeight + 'px');
        expect(component.cornerResizer.nativeElement.style.transform).toEqual('');
    });

    it('drawPreviewOfNewSize of -dx, +dy canvas on cornerResizer sets buttons and previewCanvas to correct size', () => {
        component.isCornerResizerDown = true;
        const newCanvasWidth = 500;
        const newCanvasHeight = 1200;
        component.previewCtx.canvas.width = newCanvasWidth;
        component.previewCtx.canvas.height = newCanvasHeight;

        component.drawPreviewOfNewSize();

        expect(component.cornerResizer.nativeElement.style.left).toEqual(newCanvasWidth + 'px');
        expect(component.cornerResizer.nativeElement.style.top).toEqual(newCanvasHeight + 'px');
        expect(component.sideResizer.nativeElement.style.left).toEqual(newCanvasWidth + 'px');
        expect(component.sideResizer.nativeElement.style.top).toEqual(newCanvasHeight / 2 + 'px');
        expect(component.bottomResizer.nativeElement.style.left).toEqual(newCanvasWidth / 2 + 'px');
        expect(component.bottomResizer.nativeElement.style.top).toEqual(newCanvasHeight + 'px');
        expect(component.cornerResizer.nativeElement.style.transform).toEqual('');
    });

    it('drawPreviewOfNewSize of -dx, -dy canvas on cornerResizer sets buttons and previewCanvas to correct size', () => {
        component.isCornerResizerDown = true;
        const newCanvasWidth = 500;
        const newCanvasHeight = 400;
        component.previewCtx.canvas.width = newCanvasWidth;
        component.previewCtx.canvas.height = newCanvasHeight;

        component.drawPreviewOfNewSize();

        expect(component.cornerResizer.nativeElement.style.left).toEqual(newCanvasWidth + 'px');
        expect(component.cornerResizer.nativeElement.style.top).toEqual(newCanvasHeight + 'px');
        expect(component.sideResizer.nativeElement.style.left).toEqual(newCanvasWidth + 'px');
        expect(component.sideResizer.nativeElement.style.top).toEqual(newCanvasHeight / 2 + 'px');
        expect(component.bottomResizer.nativeElement.style.left).toEqual(newCanvasWidth / 2 + 'px');
        expect(component.bottomResizer.nativeElement.style.top).toEqual(newCanvasHeight + 'px');
        expect(component.cornerResizer.nativeElement.style.transform).toEqual('');
    });

    it('if cdkDragMove is triggered, with no resizer button clicked, drawPreviewOfNewSize should do nothing', () => {
        expect((): void => {
            component.drawPreviewOfNewSize();
        }).not.toThrow();
    });

    it('if expandCanvas is triggered with no buttons, function should not throw', () => {
        expect((): void => {
            component.expandCanvas(cdkDragEndEvent);
        }).not.toThrow();
    });

    it('should return true if bottomResizer clicked', () => {
        component.onBottomResizerDown();
        expect(component.isBottomResizerDown).toEqual(true);
    });

    it('should return true if sideResizer clicked', () => {
        component.onSideResizerDown();
        expect(component.isSideResizerDown).toEqual(true);
    });

    it('should return true if cornerResizer clicked', () => {
        component.onCornerResizerDown();
        expect(component.isCornerResizerDown).toEqual(true);
    });

    it('ngAfterViewInit should change baseCtx if baseCanvas is not null', () => {
        const spyViewInit = spyOn(component, 'ngAfterViewInit').and.callThrough();

        component.ngAfterViewInit();

        expect(spyViewInit).toHaveBeenCalled();
        expect(component.sideResizer).toBeDefined();
    });

    it('setPreviewSize should call lockMinCanvasValue', () => {
        const lockMinSpy = spyOn(component, 'lockMinCanvasValue');
        const cdkDragMove = {
            pointerPosition: {
                x: 100,
                y: 130,
            },
        } as CdkDragMove;
        component.setPreviewSize(cdkDragMove);
        expect(lockMinSpy).toHaveBeenCalled();
    });

    it('setPreviewSize should call drawPreviewOfNewSize', () => {
        const cdkDragMove = {
            pointerPosition: {
                x: 100,
                y: 130,
            },
        } as CdkDragMove;
        component.setPreviewSize(cdkDragMove);
        expect(drawPreviewSpy).toHaveBeenCalled();
    });
});
