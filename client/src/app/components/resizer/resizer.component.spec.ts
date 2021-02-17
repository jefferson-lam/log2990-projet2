import { CdkDragEnd, CdkDragMove } from '@angular/cdk/drag-drop';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { ResizerComponent } from '@app/components/resizer/resizer.component';
import * as CanvasConstants from '@app/constants/canvas-constants';

// tslint:disable:no-any
// tslint:disable:max-file-line-count

describe('DrawingComponent', () => {
    let component: ResizerComponent;
    let fixture: ComponentFixture<ResizerComponent>;
    let canvasTestHelper: CanvasTestHelper;
    let baseCtxStub: CanvasRenderingContext2D;
    let previewCtxStub: CanvasRenderingContext2D;
    let baseCtxDrawImageSpy: jasmine.Spy<any>;
    let previewCtxDrawImageSpy: jasmine.Spy<any>;
    let drawPreviewSpy: jasmine.Spy<any>;

    const cdkDragEndEvent: CdkDragEnd = {} as CdkDragEnd;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ResizerComponent],
            providers: [],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ResizerComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();

        canvasTestHelper = TestBed.inject(CanvasTestHelper);
        baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        previewCtxStub = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;

        component.baseCtx = baseCtxStub;
        component.previewCtx = previewCtxStub;
        component.previewCanvas = canvasTestHelper.drawCanvas;
        component.baseCanvas = canvasTestHelper.canvas;
        component.baseCtx.canvas.width = CanvasConstants.MIN_LENGTH_CANVAS;
        component.baseCtx.canvas.height = CanvasConstants.MIN_HEIGHT_CANVAS;
        component.previewCtx.canvas.width = CanvasConstants.MIN_LENGTH_CANVAS;
        component.previewCtx.canvas.height = CanvasConstants.MIN_HEIGHT_CANVAS;

        baseCtxDrawImageSpy = spyOn<any>(component.baseCtx, 'drawImage').and.callThrough();
        previewCtxDrawImageSpy = spyOn<any>(component.previewCtx, 'drawImage').and.callThrough();
        drawPreviewSpy = spyOn<any>(component, 'drawPreviewOfNewSize').and.callThrough();
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

    // Test: expandCanvas() with sideResizer
    // Cases:
    // 1. Resize left
    // 2. Resize right

    it('should change canvas width bigger on expandCanvas call', () => {
        const oldCanvasWidth = 300;
        const newCanvasWidth = 400;
        component.isSideResizerDown = true;
        component.baseCtx.canvas.width = oldCanvasWidth;
        component.previewCtx.canvas.width = newCanvasWidth;

        component.expandCanvas(cdkDragEndEvent);

        expect(component.baseCtx.canvas.width).toEqual(newCanvasWidth);
        expect(component.sideResizer.nativeElement.style.left).toEqual(newCanvasWidth + 'px');
        expect(component.isSideResizerDown).toEqual(false);
    });

    it('should make canvas width smaller on expandCanvas call', () => {
        const oldCanvasWidth = 400;
        const newCanvasWidth = 300;
        component.isSideResizerDown = true;
        component.baseCtx.canvas.width = oldCanvasWidth;
        component.previewCtx.canvas.width = newCanvasWidth;

        component.expandCanvas(cdkDragEndEvent);

        expect(component.baseCtx.canvas.width).toEqual(newCanvasWidth);
        expect(component.sideResizer.nativeElement.style.left).toEqual(newCanvasWidth + 'px');
        expect(component.isSideResizerDown).toBeFalsy();
    });

    // Test: expandCanvas() on height
    // Cases:
    // 1. Making canvas smaller by resizing upwards
    // 2. Making canvas larger by resizing downwards

    it('should make canvas height bigger on expandCanvas call', () => {
        const oldCanvasHeight = 400;
        const newCanvasHeight = 650;
        component.isBottomResizerDown = true;
        component.baseCtx.canvas.height = oldCanvasHeight;
        component.previewCtx.canvas.height = newCanvasHeight;

        component.expandCanvas(cdkDragEndEvent);

        expect(component.baseCtx.canvas.height).toEqual(newCanvasHeight);
        expect(component.bottomResizer.nativeElement.style.top).toEqual(newCanvasHeight + 'px');
        expect(component.isBottomResizerDown).toBeFalsy();
    });

    it('should make canvas height smaller on expandCanvas call', () => {
        const oldCanvasHeight = 400;
        const newCanvasHeight = 250;
        component.isBottomResizerDown = true;
        component.baseCtx.canvas.height = oldCanvasHeight;
        component.previewCtx.canvas.height = newCanvasHeight;

        component.expandCanvas(cdkDragEndEvent);

        expect(component.baseCtx.canvas.height).toEqual(newCanvasHeight);
        expect(component.bottomResizer.nativeElement.style.top).toEqual(newCanvasHeight + 'px');
        expect(component.isBottomResizerDown).toEqual(false);
    });

    // Test: expandCanvas() on CornerResizer
    // Cases:
    // 1. +dx, +dy
    // 2. +dx, -dy
    // 3. -dx, +dy
    // 4. -dx, -dy

    it('should make canvas height and width bigger on expandCanvas call', () => {
        const oldCanvasWidth = 500;
        const oldCanvasHeight = 500;
        const newCanvasWidth = 750;
        const newCanvasHeight = 800;

        component.isCornerResizerDown = true;
        component.baseCtx.canvas.width = oldCanvasWidth;
        component.baseCtx.canvas.height = oldCanvasHeight;
        component.previewCtx.canvas.width = newCanvasWidth;
        component.previewCtx.canvas.height = newCanvasHeight;

        component.expandCanvas(cdkDragEndEvent);

        expect(component.cornerResizer.nativeElement.style.left).toEqual(newCanvasWidth + 'px');
        expect(component.cornerResizer.nativeElement.style.top).toEqual(newCanvasHeight + 'px');
        expect(component.baseCtx.canvas.width).toEqual(newCanvasWidth);
        expect(component.baseCtx.canvas.height).toEqual(newCanvasHeight);
        expect(component.isCornerResizerDown).toBeFalsy();
    });

    it('should make canvas height bigger and width smaller on expandCanvas call', () => {
        const oldCanvasWidth = 500;
        const oldCanvasHeight = 500;
        const newCanvasWidth = 750;
        const newCanvasHeight = 350;

        component.isCornerResizerDown = true;
        component.baseCtx.canvas.width = oldCanvasWidth;
        component.baseCtx.canvas.height = oldCanvasHeight;
        component.previewCtx.canvas.width = newCanvasWidth;
        component.previewCtx.canvas.height = newCanvasHeight;

        component.expandCanvas(cdkDragEndEvent);

        expect(component.cornerResizer.nativeElement.style.left).toEqual(newCanvasWidth + 'px');
        expect(component.cornerResizer.nativeElement.style.top).toEqual(newCanvasHeight + 'px');
        expect(component.baseCtx.canvas.width).toEqual(newCanvasWidth);
        expect(component.baseCtx.canvas.height).toEqual(newCanvasHeight);
        expect(component.isCornerResizerDown).toBeFalsy();
    });

    it('should make canvas height smaller and width bigger on expandCanvas call', () => {
        const oldCanvasWidth = 500;
        const oldCanvasHeight = 500;
        const newCanvasWidth = 350;
        const newCanvasHeight = 850;

        component.isCornerResizerDown = true;
        component.baseCtx.canvas.width = oldCanvasWidth;
        component.baseCtx.canvas.height = oldCanvasHeight;
        component.previewCtx.canvas.width = newCanvasWidth;
        component.previewCtx.canvas.height = newCanvasHeight;

        component.expandCanvas(cdkDragEndEvent);

        expect(component.cornerResizer.nativeElement.style.left).toEqual(newCanvasWidth + 'px');
        expect(component.cornerResizer.nativeElement.style.top).toEqual(newCanvasHeight + 'px');
        expect(component.baseCtx.canvas.width).toEqual(newCanvasWidth);
        expect(component.baseCtx.canvas.height).toEqual(newCanvasHeight);
        expect(component.isCornerResizerDown).toBeFalsy();
    });

    it('should make canvas height smaller and width smaller on expandCanvas call', () => {
        const oldCanvasWidth = 500;
        const oldCanvasHeight = 500;
        const newCanvasWidth = 350;
        const newCanvasHeight = 280;

        component.isCornerResizerDown = true;
        component.baseCtx.canvas.width = oldCanvasWidth;
        component.baseCtx.canvas.height = oldCanvasHeight;
        component.previewCtx.canvas.width = newCanvasWidth;
        component.previewCtx.canvas.height = newCanvasHeight;

        component.expandCanvas(cdkDragEndEvent);

        expect(component.cornerResizer.nativeElement.style.left).toEqual(newCanvasWidth + 'px');
        expect(component.cornerResizer.nativeElement.style.top).toEqual(newCanvasHeight + 'px');
        expect(component.baseCtx.canvas.width).toEqual(newCanvasWidth);
        expect(component.baseCtx.canvas.height).toEqual(newCanvasHeight);
        expect(component.isCornerResizerDown).toBeFalsy();
    });

    it('when expanding canvas, full drawing that was on old canvas should be saved', () => {
        const oldCanvasWidth = 500;
        const oldCanvasHeight = 500;
        const newCanvasWidth = 950;
        const newCanvasHeight = 750;

        component.isCornerResizerDown = true;
        component.baseCtx.canvas.width = oldCanvasWidth;
        component.baseCtx.canvas.height = oldCanvasHeight;
        component.previewCtx.canvas.width = newCanvasWidth;
        component.previewCtx.canvas.height = newCanvasHeight;

        component.expandCanvas(cdkDragEndEvent);

        expect(previewCtxDrawImageSpy).toHaveBeenCalledWith(component.baseCtx.canvas, 0, 0);
        expect(baseCtxDrawImageSpy).toHaveBeenCalledWith(component.previewCtx.canvas, 0, 0);
    });

    it('when making canvas smaller, drawing on old canvas should be saved', () => {
        const oldCanvasWidth = 500;
        const oldCanvasHeight = 500;
        const newCanvasWidth = 350;
        const newCanvasHeight = 350;

        component.isCornerResizerDown = true;
        component.baseCtx.canvas.width = oldCanvasWidth;
        component.baseCtx.canvas.height = oldCanvasHeight;
        component.previewCtx.canvas.width = newCanvasWidth;
        component.previewCtx.canvas.height = newCanvasHeight;

        component.expandCanvas(cdkDragEndEvent);

        expect(previewCtxDrawImageSpy).toHaveBeenCalledWith(component.baseCtx.canvas, 0, 0);
        expect(baseCtxDrawImageSpy).toHaveBeenCalledWith(component.previewCtx.canvas, 0, 0);
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
        component.drawPreviewOfNewSize(newCanvasWidth, mousePositionY);
        expect(component.previewCtx.canvas.width).toEqual(newCanvasWidth);
        expect(component.cornerResizer.nativeElement.style.left).toEqual(newCanvasWidth + 'px');
        expect(component.sideResizer.nativeElement.style.left).toEqual(newCanvasWidth + 'px');
        expect(component.bottomResizer.nativeElement.style.left).toEqual(newCanvasWidth / 2 + 'px');
        expect(component.sideResizer.nativeElement.style.transform).toEqual('');
    });

    it('drawPreviewOfNewSize of smaller canvas on sideResizer sets buttons and previewCanvas to correct size', () => {
        component.isSideResizerDown = true;
        const newCanvasWidth = 600;
        const mousePositionY = 400;
        component.drawPreviewOfNewSize(newCanvasWidth, mousePositionY);
        expect(component.previewCtx.canvas.width).toEqual(newCanvasWidth);
        expect(component.cornerResizer.nativeElement.style.left).toEqual(newCanvasWidth + 'px');
        expect(component.sideResizer.nativeElement.style.left).toEqual(newCanvasWidth + 'px');
        expect(component.bottomResizer.nativeElement.style.left).toEqual(newCanvasWidth / 2 + 'px');
        expect(component.sideResizer.nativeElement.style.transform).toEqual('');
    });

    it('drawPreviewOfNewSize of bigger canvas on bottomResizer sets buttons and previewCanvas to correct size', () => {
        component.isBottomResizerDown = true;
        const mousePositionX = 500;
        const newCanvasHeight = 1200;
        component.drawPreviewOfNewSize(mousePositionX, newCanvasHeight);
        expect(component.previewCtx.canvas.height).toEqual(newCanvasHeight);
        expect(component.cornerResizer.nativeElement.style.top).toEqual(newCanvasHeight + 'px');
        expect(component.sideResizer.nativeElement.style.top).toEqual(newCanvasHeight / 2 + 'px');
        expect(component.bottomResizer.nativeElement.style.top).toEqual(newCanvasHeight + 'px');
        expect(component.bottomResizer.nativeElement.style.transform).toEqual('');
    });

    it('drawPreviewOfNewSize of smaller canvas on bottomResizer sets buttons and previewCanvas to correct size', () => {
        component.isBottomResizerDown = true;
        const mousePositionX = 500;
        const newCanvasHeight = 300;
        component.drawPreviewOfNewSize(mousePositionX, newCanvasHeight);
        expect(component.previewCtx.canvas.height).toEqual(newCanvasHeight);
        expect(component.cornerResizer.nativeElement.style.top).toEqual(newCanvasHeight + 'px');
        expect(component.sideResizer.nativeElement.style.top).toEqual(newCanvasHeight / 2 + 'px');
        expect(component.bottomResizer.nativeElement.style.top).toEqual(newCanvasHeight + 'px');
        expect(component.bottomResizer.nativeElement.style.transform).toEqual('');
    });

    it('drawPreviewOfNewSize of +dx, +dy canvas on cornerResizer sets buttons and previewCanvas to correct size', () => {
        component.isCornerResizerDown = true;
        const newCanvasWidth = 1500;
        const newCanvasHeight = 1050;

        component.drawPreviewOfNewSize(newCanvasWidth, newCanvasHeight);

        expect(component.previewCtx.canvas.width).toEqual(newCanvasWidth);
        expect(component.previewCtx.canvas.height).toEqual(newCanvasHeight);
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

        component.drawPreviewOfNewSize(newCanvasWidth, newCanvasHeight);

        expect(component.previewCtx.canvas.width).toEqual(newCanvasWidth);
        expect(component.previewCtx.canvas.height).toEqual(newCanvasHeight);
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

        component.drawPreviewOfNewSize(newCanvasWidth, newCanvasHeight);

        expect(component.previewCtx.canvas.width).toEqual(newCanvasWidth);
        expect(component.previewCtx.canvas.height).toEqual(newCanvasHeight);
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

        component.drawPreviewOfNewSize(newCanvasWidth, newCanvasHeight);

        expect(component.previewCtx.canvas.width).toEqual(newCanvasWidth);
        expect(component.previewCtx.canvas.height).toEqual(newCanvasHeight);
        expect(component.cornerResizer.nativeElement.style.left).toEqual(newCanvasWidth + 'px');
        expect(component.cornerResizer.nativeElement.style.top).toEqual(newCanvasHeight + 'px');
        expect(component.sideResizer.nativeElement.style.left).toEqual(newCanvasWidth + 'px');
        expect(component.sideResizer.nativeElement.style.top).toEqual(newCanvasHeight / 2 + 'px');
        expect(component.bottomResizer.nativeElement.style.left).toEqual(newCanvasWidth / 2 + 'px');
        expect(component.bottomResizer.nativeElement.style.top).toEqual(newCanvasHeight + 'px');
        expect(component.cornerResizer.nativeElement.style.transform).toEqual('');
    });

    it('if cdkDragMove is triggered, with no resizer button clicked, drawPreviewOfNewSize should do nothing', () => {
        const mousePositionX = 25;
        const mousePositionY = 25;
        expect((): void => {
            component.drawPreviewOfNewSize(mousePositionX, mousePositionY);
        }).not.toThrow();
    });

    it('if expandCanvas is triggered with no buttons, function should not throw', () => {
        expect((): void => {
            component.expandCanvas(cdkDragEndEvent);
        }).not.toThrow();
    });

    it('should return true if bottomSlider clicked', () => {
        component.onBottomResizerDown();
        expect(component.isBottomResizerDown).toEqual(true);
    });

    it('should return true if sideSlider clicked', () => {
        component.onSideResizerDown();
        expect(component.isSideResizerDown).toEqual(true);
    });

    it('should return true if cornerSlider clicked', () => {
        component.onCornerResizerDown();
        expect(component.isCornerResizerDown).toEqual(true);
    });

    it('ngAfterViewInit should change baseCtx if baseCanvas is not null', () => {
        const spyViewInit = spyOn(component, 'ngAfterViewInit').and.callThrough();

        component.ngAfterViewInit();

        expect(spyViewInit).toHaveBeenCalled();
        expect(component.sideResizer).toBeDefined();
    });

    it('ngAfterViewInit should not change baseCtx if baseCanvas is null', () => {
        const spyViewInit = spyOn(component, 'ngAfterViewInit').and.callThrough();

        component.baseCanvas = null;

        component.ngAfterViewInit();

        expect(spyViewInit).toHaveBeenCalled();
        expect(component.sideResizer.nativeElement.style.left).toBe('');
    });

    it('setPreviewSize should call drawPreviewOfNewSize with min sizes if under', () => {
        const cdkDragMove = {
            pointerPosition: {
                x: 100,
                y: 130,
            },
        } as CdkDragMove;
        component.setPreviewSize(cdkDragMove);
        expect(drawPreviewSpy).toHaveBeenCalledWith(CanvasConstants.MIN_LENGTH_CANVAS, CanvasConstants.MIN_HEIGHT_CANVAS);
    });

    it('setPreviewSize should call drawPreviewOfNewSize with min size for height if under', () => {
        const cdkDragMove = {
            pointerPosition: {
                x: 300,
                y: 130,
            },
        } as CdkDragMove;
        component.setPreviewSize(cdkDragMove);
        expect(drawPreviewSpy).toHaveBeenCalledWith(cdkDragMove.pointerPosition.x, CanvasConstants.MIN_HEIGHT_CANVAS);
    });

    it('setPreviewSize should call drawPreviewOfNewSize with min size for length if under', () => {
        const cdkDragMove = {
            pointerPosition: {
                x: 130,
                y: 300,
            },
        } as CdkDragMove;
        component.setPreviewSize(cdkDragMove);
        expect(drawPreviewSpy).toHaveBeenCalledWith(CanvasConstants.MIN_LENGTH_CANVAS, cdkDragMove.pointerPosition.y);
    });
});
