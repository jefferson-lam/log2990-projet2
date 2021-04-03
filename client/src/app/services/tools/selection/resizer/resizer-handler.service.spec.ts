import { CdkDragMove } from '@angular/cdk/drag-drop';
import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { ResizeStrategy } from '@app/classes/resize-strategy';
import { Vec2 } from '@app/classes/vec2';
import { SelectionComponent } from '@app/components/selection/selection.component';
import { ResizerDown } from '@app/constants/resize-constants';
import { BUTTON_OFFSET } from '@app/constants/selection-constants';
import { ResizeBottom } from '@app/services/tools/selection/resizer/resize-strategy/resize-bottom';
import { ResizeBottomLeft } from '@app/services/tools/selection/resizer/resize-strategy/resize-bottom-left';
import { ResizeBottomRight } from '@app/services/tools/selection/resizer/resize-strategy/resize-bottom-right';
import { ResizeLeft } from '@app/services/tools/selection/resizer/resize-strategy/resize-left';
import { ResizeRight } from '@app/services/tools/selection/resizer/resize-strategy/resize-right';
import { ResizeTop } from '@app/services/tools/selection/resizer/resize-strategy/resize-top';
import { ResizeTopLeft } from '@app/services/tools/selection/resizer/resize-strategy/resize-top-left';
import { ResizeTopRight } from '@app/services/tools/selection/resizer/resize-strategy/resize-top-right';
import { ResizerHandlerService } from './resizer-handler.service';

describe('ResizerHandlerService', () => {
    let service: ResizerHandlerService;
    let canvasTestHelper: CanvasTestHelper;
    let canvas: HTMLCanvasElement;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [ResizeTopLeft, ResizeLeft, ResizeBottomLeft, ResizeBottom, ResizeBottomRight, ResizeRight, ResizeTopRight, ResizeTop],
        });
        service = TestBed.inject(ResizerHandlerService);
        console.log(service.resizerStrategies);
        canvasTestHelper = TestBed.inject(CanvasTestHelper);
        canvas = canvasTestHelper.canvas;

        service.resizers
            .set(ResizerDown.TopLeft, document.createElement('div'))
            .set(ResizerDown.Left, document.createElement('div'))
            .set(ResizerDown.BottomLeft, document.createElement('div'))
            .set(ResizerDown.Bottom, document.createElement('div'))
            .set(ResizerDown.BottomRight, document.createElement('div'))
            .set(ResizerDown.Right, document.createElement('div'))
            .set(ResizerDown.TopRight, document.createElement('div'))
            .set(ResizerDown.Top, document.createElement('div'));

        service.resizerStrategies
            .set(ResizerDown.TopLeft, new ResizeTopLeft())
            .set(ResizerDown.Left, new ResizeLeft())
            .set(ResizerDown.BottomLeft, new ResizeBottomLeft())
            .set(ResizerDown.Bottom, new ResizeBottom())
            .set(ResizerDown.BottomRight, new ResizeBottomRight())
            .set(ResizerDown.Right, new ResizeRight())
            .set(ResizerDown.TopRight, new ResizeTopRight())
            .set(ResizerDown.Top, new ResizeTop());

        service.resizeStrategy = service.resizerStrategies.get(ResizerDown.TopLeft) as ResizeStrategy;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('assignComponent should call assignComponent for all strategies', () => {
        const topLeftStrategyAssignSpy = spyOn(service.resizerStrategies.get(ResizerDown.TopLeft) as ResizeStrategy, 'assignComponent');
        const leftStrategyAssignSpy = spyOn(service.resizerStrategies.get(ResizerDown.Left) as ResizeStrategy, 'assignComponent');
        const bottomLeftStrategyAssignSpy = spyOn(service.resizerStrategies.get(ResizerDown.BottomLeft) as ResizeStrategy, 'assignComponent');
        const bottomStrategyAssignSpy = spyOn(service.resizerStrategies.get(ResizerDown.Bottom) as ResizeStrategy, 'assignComponent');
        const bottomRightStrategyAssignSpy = spyOn(service.resizerStrategies.get(ResizerDown.BottomRight) as ResizeStrategy, 'assignComponent');
        const rightStrategyAssignSpy = spyOn(service.resizerStrategies.get(ResizerDown.Right) as ResizeStrategy, 'assignComponent');
        const topRightStrategyAssignSpy = spyOn(service.resizerStrategies.get(ResizerDown.TopRight) as ResizeStrategy, 'assignComponent');
        const topStrategyAssignSpy = spyOn(service.resizerStrategies.get(ResizerDown.Top) as ResizeStrategy, 'assignComponent');

        service.assignComponent({} as SelectionComponent);

        expect(topLeftStrategyAssignSpy).toHaveBeenCalled();
        expect(leftStrategyAssignSpy).toHaveBeenCalled();
        expect(bottomLeftStrategyAssignSpy).toHaveBeenCalled();
        expect(bottomStrategyAssignSpy).toHaveBeenCalled();
        expect(bottomRightStrategyAssignSpy).toHaveBeenCalled();
        expect(rightStrategyAssignSpy).toHaveBeenCalled();
        expect(topRightStrategyAssignSpy).toHaveBeenCalled();
        expect(topStrategyAssignSpy).toHaveBeenCalled();
    });

    it('resize should call resize method of resizeStrategy', () => {
        const resizeSpy = spyOn(service.resizeStrategy, 'resize');
        service.resize({} as CdkDragMove);
        expect(resizeSpy).toHaveBeenCalled();
        expect(resizeSpy).toHaveBeenCalledWith({} as CdkDragMove, service.isShiftDown);
    });

    it('resizeSquare should call resizeSquare method of resizeStrategy', () => {
        const resizeSquareSpy = spyOn(service.resizeStrategy, 'resizeSquare');
        service.resizeSquare();
        expect(resizeSquareSpy).toHaveBeenCalled();
    });

    it('restoreLastDimensions should call restoreLastDimensions method of resizeStrategy', () => {
        const restoreDimensionsSpy = spyOn(service.resizeStrategy, 'restoreLastDimensions');
        service.restoreLastDimensions();
        expect(restoreDimensionsSpy).toHaveBeenCalled();
    });

    it('resetResizers should set all resizers top and left to 0px', () => {
        service.resetResizers();

        service.resizers.forEach((resizer) => {
            expect(resizer.style.top).toEqual('0px');
            expect(resizer.style.left).toEqual('0px');
            expect(resizer.style.visibility).toEqual('hidden');
        });
    });

    it('setResizerPositions should correct set all resizers to new canvas position', () => {
        const canvasPosition: Vec2 = {
            x: 750,
            y: 750,
        };
        const canvasWidth = 450;
        const canvasHeight = 750;

        canvas.style.left = canvasPosition.x + 'px';
        canvas.style.top = canvasPosition.y + 'px';
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;

        const xOrigin = '750px';
        const yOrigin = '750px';
        const expectedVisibility = 'visible';

        const xMean = canvasPosition.x + canvasWidth / 2 - BUTTON_OFFSET / 2 + 'px';
        const xMax = canvasPosition.x + canvasWidth - BUTTON_OFFSET + 'px';
        const yMax = canvasPosition.y + canvasHeight - BUTTON_OFFSET + 'px';
        const yMean = canvasPosition.y + canvasHeight / 2 - BUTTON_OFFSET / 2 + 'px';

        service.setResizerPositions(canvas);
        const topLeftResizer = service.resizers.get(ResizerDown.TopLeft) as HTMLElement;
        expect(topLeftResizer.style.left).toEqual(xOrigin);
        expect(topLeftResizer.style.top).toEqual(yOrigin);
        expect(topLeftResizer.style.visibility).toEqual(expectedVisibility);
        expect(topLeftResizer.style.transform).toBe('');

        const leftResizer = service.resizers.get(ResizerDown.Left) as HTMLElement;
        expect(leftResizer.style.left).toEqual(xOrigin);
        expect(leftResizer.style.top).toEqual(yMean);
        expect(leftResizer.style.visibility).toEqual(expectedVisibility);
        expect(leftResizer.style.transform).toBe('');

        const bottomLeftResizer = service.resizers.get(ResizerDown.BottomLeft) as HTMLElement;
        expect(bottomLeftResizer.style.left).toEqual(xOrigin);
        expect(bottomLeftResizer.style.top).toEqual(yMax);
        expect(bottomLeftResizer.style.visibility).toEqual(expectedVisibility);
        expect(bottomLeftResizer.style.transform).toBe('');

        const bottomResizer = service.resizers.get(ResizerDown.Bottom) as HTMLElement;
        expect(bottomResizer.style.left).toEqual(xMean);
        expect(bottomResizer.style.top).toEqual(yMax);
        expect(bottomResizer.style.visibility).toEqual(expectedVisibility);
        expect(bottomResizer.style.transform).toBe('');

        const bottomRightResizer = service.resizers.get(ResizerDown.BottomRight) as HTMLElement;
        expect(bottomRightResizer.style.left).toEqual(xMax);
        expect(bottomRightResizer.style.top).toEqual(yMax);
        expect(bottomRightResizer.style.visibility).toEqual(expectedVisibility);
        expect(bottomRightResizer.style.transform).toBe('');

        const rightResizer = service.resizers.get(ResizerDown.Right) as HTMLElement;
        expect(rightResizer.style.left).toEqual(xMax);
        expect(rightResizer.style.top).toEqual(yMean);
        expect(rightResizer.style.visibility).toEqual(expectedVisibility);
        expect(rightResizer.style.transform).toBe('');

        const topRightResizer = service.resizers.get(ResizerDown.TopRight) as HTMLElement;
        expect(topRightResizer.style.left).toEqual(xMax);
        expect(topRightResizer.style.top).toEqual(yOrigin);
        expect(topRightResizer.style.visibility).toEqual(expectedVisibility);
        expect(topRightResizer.style.transform).toBe('');

        const topResizer = service.resizers.get(ResizerDown.Top) as HTMLElement;
        expect(topResizer.style.left).toEqual(xMean);
        expect(topResizer.style.top).toEqual(yOrigin);
        expect(topResizer.style.visibility).toEqual(expectedVisibility);
        expect(topResizer.style.transform).toBe('');
    });

    it('setResizeStrategy should set resizeStrategy to number passed', () => {
        service.setResizeStrategy(ResizerDown.BottomLeft);

        expect(service.resizeStrategy).toBe(service.resizerStrategies.get(ResizerDown.BottomLeft) as ResizeStrategy);
    });
});
