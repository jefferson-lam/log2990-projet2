import { CdkDragEnd, CdkDragMove } from '@angular/cdk/drag-drop';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ResizerHandlerService } from '@app/services/resizer/resizer-handler.service';
import { SelectionComponent } from './selection.component';

fdescribe('SelectionComponent', () => {
    let component: SelectionComponent;
    let fixture: ComponentFixture<SelectionComponent>;

    let resizerHandlerService: ResizerHandlerService;
    let setResizerPositionSpy: jasmine.Spy;
    let getTransformValuesSpy: jasmine.Spy;
    let repositionResizersSpy: jasmine.Spy;
    let componentSetResizerPositionSpy: jasmine.Spy;
    const drawingService: DrawingService = new DrawingService();

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [SelectionComponent],
            providers: [{ provide: DrawingService, useValue: drawingService }],
        }).compileComponents();
    }));

    beforeEach(() => {
        resizerHandlerService = TestBed.inject(ResizerHandlerService);
        fixture = TestBed.createComponent(SelectionComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        setResizerPositionSpy = spyOn(resizerHandlerService, 'setResizerPosition').and.callFake(() => {
            return;
        });
        getTransformValuesSpy = spyOn(component, 'getTransformValues').and.callThrough();
        componentSetResizerPositionSpy = spyOn(component, 'setResizerPosition').and.callThrough();
        repositionResizersSpy = spyOn(component, 'repositionResizers').and.callThrough();
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

    it('onCanvasMove should call repositionResizers if emittedValue is true', () => {
        component.onCanvasMove(true);
        expect(repositionResizersSpy).toHaveBeenCalled();
    });

    it('onCanvasMove should call repositionResizers if emittedValue is false', () => {
        component.onCanvasMove(false);
        expect(repositionResizersSpy).not.toHaveBeenCalled();
    });

    it('repositionResizers should call transformValues and setResizerPosition', () => {
        component.repositionResizers({} as CdkDragMove);
        expect(getTransformValuesSpy).toHaveBeenCalled();
        expect(componentSetResizerPositionSpy).toHaveBeenCalled();
    });

    it('repositionResizers should call transformValues and setResizerPosition', () => {
        component.repositionPreviewResizers({} as CdkDragMove);
        expect(getTransformValuesSpy).toHaveBeenCalled();
        expect(componentSetResizerPositionSpy).toHaveBeenCalled();
    });

    it('setCanvasPosition should correctly set selectionCanvas new position', () => {
        const mouseEvent = {
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
        } as CdkDragEnd;
        const expectedTop = '800px';
        const expectedLeft = '700px';
        component.selectionCanvas.style.top = '500px';
        component.selectionCanvas.style.left = '500px';
        component.setSelectionCanvasPosition(mouseEvent);
        expect(component.selectionCanvas.style.top).toEqual(expectedTop);
        expect(component.selectionCanvas.style.left).toEqual(expectedLeft);
    });

    it('setPreviewCanvasPosition should correctly set selectionCanvas new position', () => {
        const mouseEvent = {
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
        } as CdkDragEnd;
        const expectedTop = '800px';
        const expectedLeft = '700px';
        component.previewSelectionCanvas.style.top = '500px';
        component.previewSelectionCanvas.style.left = '500px';
        component.setPreviewSelectionCanvasPosition(mouseEvent);
        expect(component.selectionCanvas.style.top).toEqual(expectedTop);
        expect(component.selectionCanvas.style.left).toEqual(expectedLeft);
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

    it('setResizersPosition should correctly calculate new canvas position, and call service function', () => {
        const selHeight = 250;
        const selWidth = 500;
        component.selectionCanvas.height = selHeight;
        component.selectionCanvas.width = selWidth;
        component.selectionCanvas.style.top = '350px';
        component.selectionCanvas.style.left = '650px';
        component.selectionCanvas.style.transform = 'translate3d(100px, 50px, 0px)';
        const transformValues = component.getTransformValues(component.selectionCanvas);
        component.setResizerPosition(transformValues, component.selectionCanvas, component.previewSelectionCanvas);
        expect(setResizerPositionSpy).toHaveBeenCalledWith({ x: 750, y: 400 }, selWidth, selHeight);
    });
});
