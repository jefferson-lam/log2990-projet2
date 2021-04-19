import { CdkDragEnd, CdkDragMove } from '@angular/cdk/drag-drop';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import * as CanvasConstants from '@app/constants/canvas-constants';
import { ResizerDown } from '@app/constants/resize-constants';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { MagnetismService } from '@app/services/magnetism/magnetism.service';
import { ShortcutManagerService } from '@app/services/manager/shortcut-manager.service';
import { ResizerHandlerService } from '@app/services/tools/selection/resizer/resizer-handler.service';
import { SelectionComponent } from './selection.component';

// tslint:disable:max-file-line-count
// tslint:disable:no-string-literal
// tslint:disable:no-any
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
    let magnetismServiceSpy: jasmine.SpyObj<MagnetismService>;
    let resizeSpy: jasmine.Spy;
    let resetDragSpy: jasmine.Spy;
    const drawingService: DrawingService = new DrawingService();
    let moveEvent: CdkDragMove;
    let endEvent: CdkDragEnd;
    let shortcutManagerSpy: jasmine.SpyObj<ShortcutManagerService>;

    const MOCK_POSITION = { x: 10, y: 10 };

    beforeEach(async(() => {
        magnetismServiceSpy = jasmine.createSpyObj('MagnetismService', ['magnetizeSelection'], ['isMagnetismOn']);
        magnetismServiceSpy.magnetizeSelection.and.returnValue({ x: 0, y: 0 });
        (Object.getOwnPropertyDescriptor(magnetismServiceSpy, 'isMagnetismOn')?.get as jasmine.Spy<() => boolean>).and.returnValue(false);
        shortcutManagerSpy = jasmine.createSpyObj('ShortcutManagerService', ['selectionOnShiftKeyDown', 'selectionOnShiftKeyUp']);
        TestBed.configureTestingModule({
            declarations: [SelectionComponent],
            providers: [
                { provide: DrawingService, useValue: drawingService },
                { provide: MagnetismService, useValue: magnetismServiceSpy },
                { provide: ShortcutManagerService, useValue: shortcutManagerSpy },
            ],
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
        getTransformValuesSpy = spyOn<any>(component, 'getTransformValues').and.callThrough();
        setCanvasPositionSpy = spyOn(component, 'setCanvasPosition').and.callThrough();
        drawScaledSpy = spyOn(component, 'drawWithScalingFactors');
        drawSelectionSpy = spyOn(component['selectionCtx'], 'drawImage');
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
        drawingService.canvasSizeSubject.next([expectedWidth, expectedHeight]);
        expect(component['selectionContainer'].nativeElement.style.height).toEqual('100px');
        expect(component['selectionContainer'].nativeElement.style.width).toEqual('500px');
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
        expect(component.borderCanvas.style.top).toEqual(component.selectionCanvas.style.top);
        expect(component.borderCanvas.style.left).toEqual(component.selectionCanvas.style.left);
    });

    it('resetPreviewSelectionCanvas should correctly set previewSelectionCanvas new position and reset CdkDragEnd event', () => {
        component.previewSelectionCanvas.style.left = '500px';
        component.previewSelectionCanvas.style.top = '500px';
        component.selectionCanvas.style.top = '700px';
        component.selectionCanvas.style.left = '800px';
        component.borderCanvas.style.left = '900px';
        component.borderCanvas.style.top = '250px';
        component.resetPreviewSelectionCanvas(endEvent);
        expect(component.previewSelectionCanvas.style.top).toEqual(component.selectionCanvas.style.top);
        expect(component.previewSelectionCanvas.style.left).toEqual(component.selectionCanvas.style.left);
        expect(component.borderCanvas.style.top).toEqual(component.selectionCanvas.style.top);
        expect(component.borderCanvas.style.left).toEqual(component.selectionCanvas.style.left);
        expect(resetDragSpy).toHaveBeenCalled();
    });

    it('setCanvasPosition should call magnetismService.magnetizeSelection if magnetismService.isMagnetisOn is true', () => {
        (Object.getOwnPropertyDescriptor(magnetismServiceSpy, 'isMagnetismOn')?.get as jasmine.Spy<() => boolean>).and.returnValue(true);
        component.setCanvasPosition();
        expect(magnetismServiceSpy.magnetizeSelection).toHaveBeenCalled();
        expect(setResizerPositionsSpy).toHaveBeenCalled();
    });

    it('getTransformValues returns the correct transform values', () => {
        const expectedResult = {
            x: 0,
            y: 0,
        };
        const result = component['getTransformValues'](component.selectionCanvas);
        expect(result).toEqual(expectedResult);
    });

    it('getTransformValues returns the correct transform values (+, +)', () => {
        const expectedResult = {
            x: 100,
            y: 50,
        };
        component.selectionCanvas.style.transform = 'translate3d(100px, 50px, 0px)';
        const result = component['getTransformValues'](component.selectionCanvas);
        expect(result).toEqual(expectedResult);
    });

    it('getTransformValues returns the correct transform values (-, +)', () => {
        const expectedResult = {
            x: -250,
            y: 50,
        };
        component.selectionCanvas.style.transform = 'translate3d(-250px, 50px, 0px)';
        const result = component['getTransformValues'](component.selectionCanvas);
        expect(result).toEqual(expectedResult);
    });

    it('getTransformValues returns the correct transform values (-, -)', () => {
        const expectedResult = {
            x: -250,
            y: -50,
        };
        component.selectionCanvas.style.transform = 'translate3d(-250px, -50px, 0px)';
        const result = component['getTransformValues'](component.selectionCanvas);
        expect(result).toEqual(expectedResult);
    });

    it('getTransformValues returns the correct transform values (+, -)', () => {
        const expectedResult = {
            x: 250,
            y: -50,
        };
        component.selectionCanvas.style.transform = 'translate3d(250px, -50px, 0px)';
        const result = component['getTransformValues'](component.selectionCanvas);
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
        expect(drawScaledSpy).toHaveBeenCalledWith(component['borderCtx'], component['outlineSelectionCanvas']);
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
        expect(component.borderCanvas.style.top).toEqual(component.selectionCanvas.style.top);
        expect(component.borderCanvas.style.left).toEqual(component.selectionCanvas.style.left);
        expect(component.borderCanvas.width).toEqual(component.selectionCanvas.width);
        expect(component.borderCanvas.height).toEqual(component.selectionCanvas.height);
    });

    it('resizeSelectionCanvas should call drawWithScalingFactors and drawImage if resizerHandlerService.inUse', () => {
        component.resizeSelectionCanvas(endEvent);
        expect(drawScaledSpy).toHaveBeenCalled();
        expect(drawScaledSpy).toHaveBeenCalledWith(component['borderCtx'], component['outlineSelectionCanvas']);
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
        expect(component.borderCanvas.style.top).toEqual(component.selectionCanvas.style.top);
        expect(component.borderCanvas.style.left).toEqual(component.selectionCanvas.style.left);
        expect(component.borderCanvas.width).toEqual(component.selectionCanvas.width);
        expect(component.borderCanvas.height).toEqual(component.selectionCanvas.height);
    });

    it('resizeSelectionCanvas should fill selectionCtx with white if resizerHandlerService.inUse', () => {
        const clearSelectionSpy = spyOn(component['selectionCtx'], 'clearRect');
        const clearPreviewSpy = spyOn(component.previewSelectionCtx, 'clearRect');
        component.resizeSelectionCanvas(endEvent);
        expect(component['selectionCtx'].fillStyle).toBe('#000000');
        expect(clearSelectionSpy).toHaveBeenCalled();
        expect(clearPreviewSpy).toHaveBeenCalled();
    });

    it('drawWithScalingFactors should call getScalingFactors', () => {
        drawScaledSpy.and.callThrough();
        const getScalingSpy = spyOn<any>(component, 'getScalingFactors').and.callThrough();
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
        const widthScalingFactorSpy = spyOn<any>(component, 'getWidthScalingFactor');
        const heightScalingFactorSpy = spyOn<any>(component, 'getHeightScalingFactor');
        component['getScalingFactors']();
        expect(widthScalingFactorSpy).toHaveBeenCalled();
        expect(heightScalingFactorSpy).toHaveBeenCalled();
    });

    it('getWidthScalingFactor should return -1 if resizerDown is on right side and left border has changed', () => {
        component['resizerDown'] = ResizerDown.TopRight;
        component.previewSelectionCanvas.style.left = MOCK_POSITION.x + 'px';
        component.initialPosition.x = MOCK_POSITION.x + 1;
        const result = component['getWidthScalingFactor']();
        // tslint:disable-next-line:no-magic-numbers
        expect(result).toBe(-1);
    });

    it('getWidthScalingFactor should return 1 if resizerDown is on right side and left border has not changed', () => {
        component['resizerDown'] = ResizerDown.TopRight;
        component.previewSelectionCanvas.style.left = MOCK_POSITION.x + 'px';
        component.initialPosition.x = MOCK_POSITION.x;
        const result = component['getWidthScalingFactor']();
        expect(result).toBe(1);
    });

    it('getWidthScalingFactor should return -1 if resizerDown is on left side and left border is equal to initial right side', () => {
        component['resizerDown'] = ResizerDown.TopLeft;
        component.previewSelectionCanvas.style.left = MOCK_POSITION.x + 'px';
        component.bottomRight.x = MOCK_POSITION.x;
        const result = component['getWidthScalingFactor']();
        // tslint:disable-next-line:no-magic-numbers
        expect(result).toBe(-1);
    });

    it('getWidthScalingFactor should return 1 if resizerDown is on left side and left border is not equal to initial right side', () => {
        component['resizerDown'] = ResizerDown.TopLeft;
        component.previewSelectionCanvas.style.left = MOCK_POSITION.x + 'px';
        component.bottomRight.x = MOCK_POSITION.x + 1;
        const result = component['getWidthScalingFactor']();
        expect(result).toBe(1);
    });

    it('getHeightScalingFactor should return -1 if resizerDown is on bottom side and top border is not equal to initial top', () => {
        component['resizerDown'] = ResizerDown.Bottom;
        component.previewSelectionCanvas.style.top = MOCK_POSITION.y + 'px';
        component.initialPosition.y = MOCK_POSITION.y + 1;
        const result = component['getHeightScalingFactor']();
        // tslint:disable-next-line:no-magic-numbers
        expect(result).toBe(-1);
    });

    it('getHeightScalingFactor should return 1 if resizerDown is on bottom side and top border is equal to initial top', () => {
        component['resizerDown'] = ResizerDown.Bottom;
        component.previewSelectionCanvas.style.top = MOCK_POSITION.y + 'px';
        component.initialPosition.y = MOCK_POSITION.y;
        const result = component['getHeightScalingFactor']();
        expect(result).toBe(1);
    });

    it('getHeightScalingFactor should return -1 if resizerDown is on top side and top border is equal to initial bottom', () => {
        component['resizerDown'] = ResizerDown.TopLeft;
        component.previewSelectionCanvas.style.top = MOCK_POSITION.y + 'px';
        component.bottomRight.y = MOCK_POSITION.y;
        const result = component['getHeightScalingFactor']();
        // tslint:disable-next-line:no-magic-numbers
        expect(result).toBe(-1);
    });

    it('getHeightScalingFactor should return 1 if resizerDown is on top side and top border is not equal to initial bottom', () => {
        component['resizerDown'] = ResizerDown.TopLeft;
        component.previewSelectionCanvas.style.top = MOCK_POSITION.y + 'px';
        component.bottomRight.y = MOCK_POSITION.y + 1;
        const result = component['getHeightScalingFactor']();
        expect(result).toBe(1);
    });

    it('setInitialValues should set initialPosition, bottomRight, resizerDown and resizerHandlerService.inUse', () => {
        const canvasWidth = 50;
        const canvasHeight = 50;
        component.resizerHandlerService.inUse = false;
        component['resizerDown'] = ResizerDown.Bottom;
        component.previewSelectionCanvas.style.left = MOCK_POSITION.x + 'px';
        component.previewSelectionCanvas.style.top = MOCK_POSITION.y + 'px';
        component.borderCanvas.width = canvasWidth;
        component.borderCanvas.height = canvasHeight;
        const expectedInitial = {
            x: parseInt(component.previewSelectionCanvas.style.left, 10),
            y: parseInt(component.previewSelectionCanvas.style.top, 10),
        };
        const expectBottomRight = {
            x: expectedInitial.x + component.previewSelectionCanvas.width,
            y: expectedInitial.y + component.previewSelectionCanvas.height,
        };
        component.setInitialValues(ResizerDown.TopLeft);
        expect(component['outlineSelectionCanvas'].width).toEqual(component.borderCanvas.width);
        expect(component['outlineSelectionCanvas'].height).toEqual(component.borderCanvas.height);
        expect(component.resizerHandlerService.inUse).toBeTrue();
        expect(component['resizerDown']).toBe(0);
        expect(component.initialPosition).toEqual(expectedInitial);
        expect(component.bottomRight).toEqual(expectBottomRight);
    });

    it('setInitialValues should call resizerHandlerService.setResizeStrategy', () => {
        const canvasWidth = 50;
        const canvasHeight = 50;
        const setResizeStrategySpy = spyOn(component.resizerHandlerService, 'setResizeStrategy');
        component.borderCanvas.width = canvasWidth;
        component.borderCanvas.height = canvasHeight;
        component.setInitialValues(ResizerDown.TopLeft);
        expect(component['outlineSelectionCanvas'].width).toEqual(component.borderCanvas.width);
        expect(component['outlineSelectionCanvas'].height).toEqual(component.borderCanvas.height);
        expect(setResizeStrategySpy).toHaveBeenCalled();
        expect(setResizeStrategySpy).toHaveBeenCalledWith(ResizerDown.TopLeft);
    });

    it('applyFocusOutlineStyle should apply correct css changes to borderCanvas', () => {
        component.applyFocusOutlineStyle();
        expect(component.borderCanvas.style.outline).toEqual('black solid 1px');
    });

    it('applyfocusOutOutlineStyle should apply correct css change to previewSelectionCanvas', () => {
        component.applyFocusOutOutlineStyle();
        expect(component.borderCanvas.style.outline).toEqual('black dashed 1px');
    });

    it('onShiftKeyDown should call shortcutManager.selectionOnShiftKeyDown', () => {
        component.onShiftKeyDown();
        expect(shortcutManagerSpy.selectionOnShiftKeyDown).toHaveBeenCalled();
        expect(shortcutManagerSpy.selectionOnShiftKeyDown).toHaveBeenCalledWith(component);
    });

    it('onShiftKeyUp should call shortcutManager.selectionOnShiftKeyUp', () => {
        component.onShiftKeyUp();
        expect(shortcutManagerSpy.selectionOnShiftKeyUp).toHaveBeenCalled();
        expect(shortcutManagerSpy.selectionOnShiftKeyUp).toHaveBeenCalledWith(component);
    });

    it('correctPreviewCanvasPosition should set previewCanvas and borderCanvas left and top styles to those of selectionCanvas.', () => {
        component.selectionCanvas.style.left = '100px';
        component.selectionCanvas.style.top = '150px';
        component.borderCanvas.style.left = '300px';
        component.borderCanvas.style.top = '225px';
        component.previewSelectionCanvas.style.top = '400px';
        component.previewSelectionCanvas.style.left = '405px';
        component.correctPreviewCanvasPosition();
        expect(component.previewSelectionCanvas.style.left).toEqual(component.selectionCanvas.style.left);
        expect(component.previewSelectionCanvas.style.top).toEqual(component.selectionCanvas.style.top);
        expect(component.borderCanvas.style.left).toEqual(component.selectionCanvas.style.left);
        expect(component.borderCanvas.style.top).toEqual(component.selectionCanvas.style.top);
    });
});
