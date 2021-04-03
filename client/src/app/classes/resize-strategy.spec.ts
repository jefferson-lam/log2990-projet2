import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { SelectionComponent } from '@app/components/selection/selection.component';
import { ResizeStrategy } from './resize-strategy';

describe('ResizeStrategyService', () => {
    let service: ResizeStrategy;
    let canvasTestHelper: CanvasTestHelper;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [SelectionComponent],
        });
        service = TestBed.inject(ResizeStrategy);
        canvasTestHelper = TestBed.inject(CanvasTestHelper);
        service.selectionComponent = { previewSelectionCanvas: canvasTestHelper.previewSelectionCanvas } as SelectionComponent;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('assignComponent should set selectionComponent', () => {
        const mockComponent = { initialPosition: { x: 1, y: 1 } } as SelectionComponent;
        service.assignComponent(mockComponent);
        expect(service.selectionComponent).toBe(mockComponent);
    });

    it('resizeSquare should set width and height to shortest side', () => {
        service.selectionComponent.previewSelectionCanvas.width = 1;
        service.selectionComponent.previewSelectionCanvas.height = 2;
        service.resizeSquare();
        expect(service.selectionComponent.previewSelectionCanvas.height).toBe(service.selectionComponent.previewSelectionCanvas.width);
    });
});
