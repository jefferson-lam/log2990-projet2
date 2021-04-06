import { CdkDragEnd, CdkDragMove } from '@angular/cdk/drag-drop';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import * as CanvasConstants from '@app/constants/canvas-constants';
import { ResizerDown } from '@app/constants/resize-constants';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ResizerHandlerService } from '@app/services/tools/selection/resizer/resizer-handler.service';
import { SelectionComponent } from './selection.component';

// tslint:disable:max-file-line-count
describe('SelectionComponent', () => {
    let component: SelectionComponent;
    let fixture: ComponentFixture<SelectionComponent>;

    let resizerHandlerService: ResizerHandlerService;
    let setResizerPositionsSpy: jasmine.Spy;
    let getTransformValuesSpy: jasmine.Spy;
    let setCanvasPositionSpy: jasmine.Spy;
    let drawScaledSpy: jasmine.Spy;
    let drawSelectionSpy: jasmine.Spy;
    let drawImagePreviewSpy: jasmine.Spy;
    let resizeSpy: jasmine.Spy;
    let resetDragSpy: jasmine.Spy;
    const drawingService: DrawingService = new DrawingService();
    let moveEvent: CdkDragMove;
    let endEvent: CdkDragEnd;

    const MOCK_POSITION = { x: 10, y: 10 };

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [SelectionComponent],
            providers: [{ provide: DrawingService, useValue: drawingService }],
        }).compileComponents();
    }));

    beforeEach(() => {
        resizerHandlerService = TestBed.inject(ResizerHandlerService);
        resizerHandlerService.inUse = true;
        fixture = TestBed.createComponent(SelectionComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        setResizerPositionsSpy = spyOn(resizerHandlerService, 'setResizerPositions').and.callFake(() => {
            return;
        });
        resizeSpy = spyOn(resizerHandlerService, 'resize');
        getTransformValuesSpy = spyOn(component, 'getTransformValues').and.callThrough();
        setCanvasPositionSpy = spyOn(component, 'setCanvasPosition').and.callThrough();
        drawScaledSpy = spyOn(component, 'drawWithScalingFactors');
        drawSelectionSpy = spyOn(component.selectionCtx, 'drawImage');
        drawImagePreviewSpy = spyOn(component.previewSelectionCtx, 'drawImage');
        moveEvent = {
            distance: {
                x: 200,
                y: 300,
            },
            source: {
                _dragRef: {
                    reset(): void {
                        return;
                    },
                },
            },
        } as CdkDragMove;
        endEvent = moveEvent as CdkDragEnd;
        resetDragSpy = spyOn(endEvent.source._dragRef, 'reset');
        component.previewSelectionCanvas.width = CanvasConstants.MIN_WIDTH_CANVAS;
        component.previewSelectionCanvas.height = CanvasConstants.MIN_HEIGHT_CANVAS;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('subscribers should correctly update values', () => {
        const expectedHeight = 100;
        const expectedWidth = 500;
        drawingService.canvasHeightObservable.next(expectedHeight);
        drawingService.canvasWidthObservable.next(expectedWidth);
        expect(component.selectionContainer.nativeElement.style.height).toEqual('100px');
        expect(component.selectionContainer.nativeElement.style.width).toEqual('500px');
    });

    it('onCanvasMove should call setCanvasPosition if emittedValue is true', () => {
        component.onCanvasMove(true);
        expect(setCanvasPositionSpy).toHaveBeenCalled();
    });

    it('onCanvasMove should not call setCanvasPosition if emittedValue is false', () => {
        component.onCanvasMove(false);
        expect(setCanvasPositionSpy).not.toHaveBeenCalled();
    });

    it('setCanvasPosition should call transformValues and setResizerPositions', () => {
        getTransformValuesSpy.and.callFake(() => {
            return { x: 0, y: 0 };
        });
        component.setCanvasPosition();
        expect(getTransformValuesSpy).toHaveBeenCalled();
        expect(setResizerPositionsSpy).toHaveBeenCalled();
        expect(setResizerPositionsSpy).toHaveBeenCalledWith(component.selectionCanvas);
    });

    it('setCanvasPosition should correctly set selectionCanvas new position', () => {
        component.previewSelectionCanvas.style.left = '500px';
        component.previewSelectionCanvas.style.top = '500px';
        component.previewSelectionCanvas.style.transform = 'translate3d(200px, 300px, 0px)';
        const expectedLeft = '700px';
        const expectedTop = '800px';
        component.selectionCanvas.style.top = '500px';
        component.selectionCanvas.style.left = '500px';
        component.setCanvasPosition();
        expect(component.selectionCanvas.style.top).toEqual(expectedTop);
        expect(component.selectionCanvas.style.left).toEqual(expectedLeft);
    });

    it('resetPreviewSelectionCanvas should correctly set previewSelectionCanvas new position and reset CdkDragEnd event', () => {
        component.previewSelectionCanvas.style.left = '500px';
        component.previewSelectionCanvas.style.top = '500px';
        component.selectionCanvas.style.top = '700px';
        component.selectionCanvas.style.left = '800px';
        component.resetPreviewSelectionCanvas(endEvent);
        expect(component.previewSelectionCanvas.style.top).toEqual(component.selectionCanvas.style.top);
        expect(component.previewSelectionCanvas.style.left).toEqual(component.selectionCanvas.style.left);
        expect(resetDragSpy).toHaveBeenCalled();
    });

    it('getTransformValues returns the correct transform values', () => {
        const expectedResult = {
            x: 0,
            y: 0,
        };
        const result = component.getTransformValues(component.selectionCanvas);
        expect(result).toEqual(expectedResult);
    });

    it('getTransformValues returns the correct transform values (+, +)', () => {
        const expectedResult = {
            x: 100,
            y: 50,
        };
        component.selectionCanvas.style.transform = 'translate3d(100px, 50px, 0px)';
        const result = component.getTransformValues(component.selectionCanvas);
        expect(result).toEqual(expectedResult);
    });

    it('getTransformValues returns the correct transform values (-, +)', () => {
        const expectedResult = {
            x: -250,
            y: 50,
        };
        component.selectionCanvas.style.transform = 'translate3d(-250px, 50px, 0px)';
        const result = component.getTransformValues(component.selectionCanvas);
        expect(result).toEqual(expectedResult);
    });

    it('getTransformValues returns the correct transform values (-, -)', () => {
        const expectedResult = {
            x: -250,
            y: -50,
        };
        component.selectionCanvas.style.transform = 'translate3d(-250px, -50px, 0px)';
        const result = component.getTransformValues(component.selectionCanvas);
        expect(result).toEqual(expectedResult);
    });

    it('getTransformValues returns the correct transform values (+, -)', () => {
        const expectedResult = {
            x: 250,
            y: -50,
        };
        component.selectionCanvas.style.transform = 'translate3d(250px, -50px, 0px)';
        const result = component.getTransformValues(component.selectionCanvas);
        expect(result).toEqual(expectedResult);
    });

    it('drawPreview should do nothing if resizerHandlerService.inUse', () => {
        component.resizerHandlerService.inUse = false;
        component.drawPreview(moveEvent);
        expect(resizeSpy).not.toHaveBeenCalled();
        expect(setResizerPositionsSpy).not.toHaveBeenCalled();
        expect(drawScaledSpy).not.toHaveBeenCalled();
    });

    it('drawPreview should call resizerHandlerService resize and setResizerPositions if resizerHandlerService.inUse', () => {
        component.drawPreview(moveEvent);
        expect(resizeSpy).toHaveBeenCalled();
        expect(resizeSpy).toHaveBeenCalledWith(moveEvent);
        expect(setResizerPositionsSpy).toHaveBeenCalled();
        expect(setResizerPositionsSpy).toHaveBeenCalledWith(component.previewSelectionCanvas);
    });

    it('drawPreview should call drawWithScalingFactors and hide selectionCanvas if resizerHandlerService.inUse', () => {
        component.drawPreview(moveEvent);
        expect(drawScaledSpy).toHaveBeenCalled();
        expect(drawScaledSpy).toHaveBeenCalledWith(component.previewSelectionCtx, component.selectionCanvas);
        expect(component.selectionCanvas.style.visibility).toBe('hidden');
    });

    it('resizeSelectionCanvas should do nothing if resizerHandlerService.inUse', () => {
        component.resizerHandlerService.inUse = false;
        component.resizeSelectionCanvas(endEvent);
        expect(resizerHandlerService.inUse).toBeFalse();
        expect(resetDragSpy).not.toHaveBeenCalled();
        expect(drawScaledSpy).not.toHaveBeenCalled();
        expect(drawScaledSpy).not.toHaveBeenCalledWith(component.previewSelectionCtx, component.selectionCanvas);
        expect(drawSelectionSpy).not.toHaveBeenCalled();
        expect(drawSelectionSpy).not.toHaveBeenCalledWith(component.previewSelectionCanvas, 0, 0);
    });

    it('resizeSelectionCanvas should set resizerHandlerService.inUse to false, reset drag event and show selectionCanvas if resizerHandlerService.inUse', () => {
        component.resizeSelectionCanvas(endEvent);
        expect(resizerHandlerService.inUse).toBeFalse();
        expect(resetDragSpy).toHaveBeenCalled();
        expect(component.selectionCanvas.style.visibility).toBe('visible');
    });

    it('resizeSelectionCanvas should call drawWithScalingFactors and drawImage if resizerHandlerService.inUse', () => {
        component.resizeSelectionCanvas(endEvent);
        expect(drawScaledSpy).toHaveBeenCalled();
        expect(drawScaledSpy).toHaveBeenCalledWith(component.previewSelectionCtx, component.selectionCanvas);
        expect(drawSelectionSpy).toHaveBeenCalled();
        expect(drawSelectionSpy).toHaveBeenCalledWith(component.previewSelectionCanvas, 0, 0);
    });

    it('resizeSelectionCanvas should reposition and resize selectionCanvas if resizerHandlerService.inUse', () => {
        component.previewSelectionCanvas.style.top = '100px';
        component.previewSelectionCanvas.style.left = '100px';
        component.resizeSelectionCanvas(endEvent);
        expect(component.selectionCanvas.style.top).toBe(component.previewSelectionCanvas.style.top);
        expect(component.selectionCanvas.style.left).toBe(component.previewSelectionCanvas.style.left);
        expect(component.selectionCanvas.width).toBe(component.previewSelectionCanvas.width);
        expect(component.selectionCanvas.height).toBe(component.previewSelectionCanvas.height);
    });

    it('resizeSelectionCanvas should fill selectionCtx with white if resizerHandlerService.inUse', () => {
        const clearSelectionSpy = spyOn(component.selectionCtx, 'clearRect');
        const clearPreviewSpy = spyOn(component.previewSelectionCtx, 'clearRect');
        component.resizeSelectionCanvas(endEvent);
        expect(component.selectionCtx.fillStyle).toBe('#000000');
        expect(clearSelectionSpy).toHaveBeenCalled();
        expect(clearPreviewSpy).toHaveBeenCalled();
    });

    it('drawWithScalingFactors should call getScalingFactors', () => {
        drawScaledSpy.and.callThrough();
        const getScalingSpy = spyOn(component, 'getScalingFactors').and.callThrough();
        component.drawWithScalingFactors(component.previewSelectionCtx, component.selectionCanvas);
        expect(getScalingSpy).toHaveBeenCalled();
    });

    it('drawWithScalingFactors should call scale and drawImage', () => {
        drawScaledSpy.and.callThrough();
        const scaleSpy = spyOn(component.previewSelectionCtx, 'scale');
        component.drawWithScalingFactors(component.previewSelectionCtx, component.selectionCanvas);
        expect(scaleSpy).toHaveBeenCalled();
        expect(drawImagePreviewSpy).toHaveBeenCalled();
    });

    it('getScalingFactors should call getWidthScalingFactor and getHeightScalingFactor', () => {
        const widthScalingFactorSpy = spyOn(component, 'getWidthScalingFactor');
        const heightScalingFactorSpy = spyOn(component, 'getHeightScalingFactor');
        component.getScalingFactors();
        expect(widthScalingFactorSpy).toHaveBeenCalled();
        expect(heightScalingFactorSpy).toHaveBeenCalled();
    });

    it('getWidthScalingFactor should return -1 if resizerDown is on right side and left border has changed', () => {
        component.resizerDown = ResizerDown.TopRight;
        component.previewSelectionCanvas.style.left = MOCK_POSITION.x + 'px';
        component.initialPosition.x = MOCK_POSITION.x + 1;
        const result = component.getWidthScalingFactor();
        // tslint:disable-next-line:no-magic-numbers
        expect(result).toBe(-1);
    });

    it('getWidthScalingFactor should return 1 if resizerDown is on right side and left border has not changed', () => {
        component.resizerDown = ResizerDown.TopRight;
        component.previewSelectionCanvas.style.left = MOCK_POSITION.x + 'px';
        component.initialPosition.x = MOCK_POSITION.x;
        const result = component.getWidthScalingFactor();
        expect(result).toBe(1);
    });

    it('getWidthScalingFactor should return -1 if resizerDown is on left side and left border is equal to initial right side', () => {
        component.resizerDown = ResizerDown.TopLeft;
        component.previewSelectionCanvas.style.left = MOCK_POSITION.x + 'px';
        component.bottomRight.x = MOCK_POSITION.x;
        const result = component.getWidthScalingFactor();
        // tslint:disable-next-line:no-magic-numbers
        expect(result).toBe(-1);
    });

    it('getWidthScalingFactor should return 1 if resizerDown is on left side and left border is not equal to initial right side', () => {
        component.resizerDown = ResizerDown.TopLeft;
        component.previewSelectionCanvas.style.left = MOCK_POSITION.x + 'px';
        component.bottomRight.x = MOCK_POSITION.x + 1;
        const result = component.getWidthScalingFactor();
        expect(result).toBe(1);
    });

    it('getHeightScalingFactor should return -1 if resizerDown is on bottom side and top border is not equal to initial top', () => {
        component.resizerDown = ResizerDown.Bottom;
        component.previewSelectionCanvas.style.top = MOCK_POSITION.y + 'px';
        component.initialPosition.y = MOCK_POSITION.y + 1;
        const result = component.getHeightScalingFactor();
        // tslint:disable-next-line:no-magic-numbers
        expect(result).toBe(-1);
    });

    it('getHeightScalingFactor should return 1 if resizerDown is on bottom side and top border is equal to initial top', () => {
        component.resizerDown = ResizerDown.Bottom;
        component.previewSelectionCanvas.style.top = MOCK_POSITION.y + 'px';
        component.initialPosition.y = MOCK_POSITION.y;
        const result = component.getHeightScalingFactor();
        expect(result).toBe(1);
    });

    it('getHeightScalingFactor should return -1 if resizerDown is on top side and top border is equal to initial bottom', () => {
        component.resizerDown = ResizerDown.TopLeft;
        component.previewSelectionCanvas.style.top = MOCK_POSITION.y + 'px';
        component.bottomRight.y = MOCK_POSITION.y;
        const result = component.getHeightScalingFactor();
        // tslint:disable-next-line:no-magic-numbers
        expect(result).toBe(-1);
    });

    it('getHeightScalingFactor should return 1 if resizerDown is on top side and top border is not equal to initial bottom', () => {
        component.resizerDown = ResizerDown.TopLeft;
        component.previewSelectionCanvas.style.top = MOCK_POSITION.y + 'px';
        component.bottomRight.y = MOCK_POSITION.y + 1;
        const result = component.getHeightScalingFactor();
        expect(result).toBe(1);
    });

    it('setInitialValues should set initialPosition, bottomRight, resizerDown and resizerHandlerService.inUse', () => {
        component.resizerHandlerService.inUse = false;
        component.resizerDown = ResizerDown.Bottom;
        component.previewSelectionCanvas.style.left = MOCK_POSITION.x + 'px';
        component.previewSelectionCanvas.style.top = MOCK_POSITION.y + 'px';
        const expectedInitial = {
            x: parseInt(component.previewSelectionCanvas.style.left, 10),
            y: parseInt(component.previewSelectionCanvas.style.top, 10),
        };
        const expectBottomRight = {
            x: expectedInitial.x + component.previewSelectionCanvas.width,
            y: expectedInitial.y + component.previewSelectionCanvas.height,
        };
        component.setInitialValues(ResizerDown.TopLeft);
        expect(component.resizerHandlerService.inUse).toBeTrue();
        expect(component.resizerDown).toBe(0);
        expect(component.initialPosition).toEqual(expectedInitial);
        expect(component.bottomRight).toEqual(expectBottomRight);
    });

    it('setInitialValues should call resizerHandlerService.setResizeStrategy', () => {
        const setResizeStrategySpy = spyOn(component.resizerHandlerService, 'setResizeStrategy');
        component.setInitialValues(ResizerDown.TopLeft);
        expect(setResizeStrategySpy).toHaveBeenCalled();
        expect(setResizeStrategySpy).toHaveBeenCalledWith(ResizerDown.TopLeft);
    });

    it('onShiftKeyDown should set resizerHandlerService.isShiftDown to true', () => {
        component.resizerHandlerService.inUse = false;
        component.resizerHandlerService.isShiftDown = false;
        const keyEvent = {
            shiftKey: true,
        } as KeyboardEvent;
        component.onShiftKeyDown(keyEvent);
        expect(component.resizerHandlerService.isShiftDown).toBeTrue();
    });

    it('onShiftKeyDown should call resizerHandlerService.resizeSquare, setResizerPositions if resizerHandlerService.inUse', () => {
        const resizeSquareSpy = spyOn(component.resizerHandlerService, 'resizeSquare');
        component.resizerHandlerService.inUse = true;
        const keyEvent = {
            shiftKey: true,
        } as KeyboardEvent;
        component.onShiftKeyDown(keyEvent);
        expect(resizeSquareSpy).toHaveBeenCalled();
        expect(setResizerPositionsSpy).toHaveBeenCalled();
        expect(setResizerPositionsSpy).toHaveBeenCalledWith(component.previewSelectionCanvas);
    });

    it('onShiftKeyDown should call drawWithScalingFactors if resizerHandlerService.inUse', () => {
        spyOn(component.resizerHandlerService, 'resizeSquare');
        component.resizerHandlerService.inUse = true;
        const keyEvent = {
            shiftKey: true,
        } as KeyboardEvent;
        component.onShiftKeyDown(keyEvent);
        expect(drawScaledSpy).toHaveBeenCalled();
        expect(drawScaledSpy).toHaveBeenCalledWith(component.previewSelectionCtx, component.selectionCanvas);
    });

    it('onShiftKeyUp should set resizerHandlerService.isShiftDown to false', () => {
        component.resizerHandlerService.inUse = false;
        component.resizerHandlerService.isShiftDown = true;
        const keyEvent = {
            shiftKey: true,
        } as KeyboardEvent;
        component.onShiftKeyUp(keyEvent);
        expect(component.resizerHandlerService.isShiftDown).toBeFalse();
    });

    it('onShiftKeyUp should call resizerHandlerService.restoreLastDimension, setResizerPositions if resizerHandlerService.inUse', () => {
        const restoreDimensionsSpy = spyOn(component.resizerHandlerService, 'restoreLastDimensions');
        component.resizerHandlerService.inUse = true;
        const keyEvent = {
            shiftKey: true,
        } as KeyboardEvent;
        component.onShiftKeyUp(keyEvent);
        expect(restoreDimensionsSpy).toHaveBeenCalled();
        expect(setResizerPositionsSpy).toHaveBeenCalled();
        expect(setResizerPositionsSpy).toHaveBeenCalledWith(component.previewSelectionCanvas);
    });

    it('onShiftKeyUp should call drawWithScalingFactors if resizerHandlerService.inUse', () => {
        spyOn(component.resizerHandlerService, 'restoreLastDimensions');
        component.resizerHandlerService.inUse = true;
        const keyEvent = {
            shiftKey: true,
        } as KeyboardEvent;
        component.onShiftKeyUp(keyEvent);
        expect(drawScaledSpy).toHaveBeenCalled();
        expect(drawScaledSpy).toHaveBeenCalledWith(component.previewSelectionCtx, component.selectionCanvas);
    });
});
