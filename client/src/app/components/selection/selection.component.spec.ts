import { CdkDragEnd, CdkDragMove } from '@angular/cdk/drag-drop';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ResizerHandlerService } from '@app/services/resizer/resizer-handler.service';
import { SelectionComponent } from './selection.component';

describe('SelectionComponent', () => {
    let component: SelectionComponent;
    let fixture: ComponentFixture<SelectionComponent>;

    let resizerHandlerService: ResizerHandlerService;
    let setResizerPositionSpy: jasmine.Spy;
    let getTransformValuesSpy: jasmine.Spy;
    let componentSetResizerPositionSpy: jasmine.Spy;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [SelectionComponent],
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
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('repositionResizers should call transformValues and setResizerPosition', () => {
        component.repositionResizers({} as CdkDragMove);
        expect(getTransformValuesSpy).toHaveBeenCalled();
        expect(componentSetResizerPositionSpy).toHaveBeenCalled();
    });

    it('setCanvasPosition should correctly set selectionCanvas new position', () => {
        const mouseEvent = {
            distance: {
                x: 200,
                y: 300,
            },
        } as CdkDragEnd;
        const expectedTop = '800px';
        const expectedLeft = '700px';
        component.selectionCanvas.nativeElement.style.top = '500px';
        component.selectionCanvas.nativeElement.style.left = '500px';
        component.setCanvasPosition(mouseEvent);
        expect(component.selectionCanvas.nativeElement.style.top).toEqual(expectedTop);
        expect(component.selectionCanvas.nativeElement.style.left).toEqual(expectedLeft);
    });

    it('setCanvasPosition, if newTop and newLeft are < 0, should set = 0', () => {
        const mouseEvent = {
            distance: {
                x: -205,
                y: -205,
            },
        } as CdkDragEnd;
        const expectedTop = '0px';
        const expectedLeft = '0px';
        component.selectionCanvas.nativeElement.style.top = '200px';
        component.selectionCanvas.nativeElement.style.left = '200px';
        component.setCanvasPosition(mouseEvent);
        expect(component.selectionCanvas.nativeElement.style.top).toEqual(expectedTop);
        expect(component.selectionCanvas.nativeElement.style.left).toEqual(expectedLeft);
    });

    it('getTransformValues returns the correct transform values', () => {
        const expectedResult = {
            x: 0,
            y: 0,
        };
        const result = component.getTransformValues(component.selectionCanvas.nativeElement);
        expect(result).toEqual(expectedResult);
    });

    it('getTransformValues returns the correct transform values (+, +)', () => {
        const expectedResult = {
            x: 100,
            y: 50,
        };
        component.selectionCanvas.nativeElement.style.transform = 'translate3d(100px, 50px, 0px)';
        const result = component.getTransformValues(component.selectionCanvas.nativeElement);
        expect(result).toEqual(expectedResult);
    });

    it('getTransformValues returns the correct transform values (-, +)', () => {
        const expectedResult = {
            x: -250,
            y: 50,
        };
        component.selectionCanvas.nativeElement.style.transform = 'translate3d(-250px, 50px, 0px)';
        const result = component.getTransformValues(component.selectionCanvas.nativeElement);
        expect(result).toEqual(expectedResult);
    });

    it('getTransformValues returns the correct transform values (-, -)', () => {
        const expectedResult = {
            x: -250,
            y: -50,
        };
        component.selectionCanvas.nativeElement.style.transform = 'translate3d(-250px, -50px, 0px)';
        const result = component.getTransformValues(component.selectionCanvas.nativeElement);
        expect(result).toEqual(expectedResult);
    });

    it('getTransformValues returns the correct transform values (+, -)', () => {
        const expectedResult = {
            x: 250,
            y: -50,
        };
        component.selectionCanvas.nativeElement.style.transform = 'translate3d(250px, -50px, 0px)';
        const result = component.getTransformValues(component.selectionCanvas.nativeElement);
        expect(result).toEqual(expectedResult);
    });

    it('setResizersPosition should correctly calculate new canvas position, and call service function', () => {
        const selHeight = 250;
        const selWidth = 500;
        component.selectionCanvas.nativeElement.height = selHeight;
        component.selectionCanvas.nativeElement.width = selWidth;
        component.selectionCanvas.nativeElement.style.top = '350px';
        component.selectionCanvas.nativeElement.style.left = '650px';
        component.selectionCanvas.nativeElement.style.transform = 'translate3d(100px, 50px, 0px)';
        const transformValues = component.getTransformValues(component.selectionCanvas.nativeElement);
        component.setResizerPosition(transformValues);
        expect(setResizerPositionSpy).toHaveBeenCalledWith({ x: 750, y: 400 }, selHeight, selWidth);
    });
});
