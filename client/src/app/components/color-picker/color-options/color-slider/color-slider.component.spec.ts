import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ColorService } from '@app/services/color/color.service';
import { ColorSliderComponent } from './color-slider.component';

// tslint:disable: no-string-literal
describe('ColorSliderComponent', () => {
    let component: ColorSliderComponent;
    let fixture: ComponentFixture<ColorSliderComponent>;
    let colorService: ColorService;
    let mouseEventDown: MouseEvent;
    let mouseEventMove: MouseEvent;
    let noOffsetMouseEventDown: MouseEvent;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ColorSliderComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ColorSliderComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();

        colorService = TestBed.inject(ColorService);
        mouseEventDown = {
            offsetX: 25,
            offsetY: 25,
            button: 0,
        } as MouseEvent;

        noOffsetMouseEventDown = {
            offsetX: 25,
            offsetY: 0,
            button: 0,
        } as MouseEvent;

        mouseEventMove = {
            button: 0,
            clientX: 50,
            clientY: 50,
            offsetX: 25,
            offsetY: 25,
        } as MouseEvent;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('AfterViewInit should call drawSlider()', () => {
        const fillSpy = spyOn(component['ctx'], 'fill');
        component.ngAfterViewInit();
        expect(fillSpy).toHaveBeenCalled();
    });

    it('drawSlider should call clearRect()', () => {
        const clearRectSpy = spyOn(component['ctx'], 'clearRect');
        component.ngAfterViewInit();
        expect(clearRectSpy).toHaveBeenCalled();
    });

    it('drawSlider should call createLinearGradient()', () => {
        const createLinearGradientSpy = spyOn(component['ctx'], 'createLinearGradient').and.callThrough();
        component.ngAfterViewInit();
        expect(createLinearGradientSpy).toHaveBeenCalled();
    });

    it('drawSlider should call beginPath()', () => {
        const beginPathSpy = spyOn(component['ctx'], 'beginPath');
        component.ngAfterViewInit();
        expect(beginPathSpy).toHaveBeenCalled();
    });

    it('drawSlider should call rect()', () => {
        const rectSpy = spyOn(component['ctx'], 'rect');
        component.ngAfterViewInit();
        expect(rectSpy).toHaveBeenCalled();
    });

    it('drawSlider should call fill()', () => {
        const fillSpy = spyOn(component['ctx'], 'fill');
        component.ngAfterViewInit();
        expect(fillSpy).toHaveBeenCalled();
    });

    it('drawSlider should call closePath()', () => {
        const closePathSpy = spyOn(component['ctx'], 'closePath');
        component.ngAfterViewInit();
        expect(closePathSpy).toHaveBeenCalled();
    });

    it('drawSelection should call stroke() if (this.selectedPosition) is true', () => {
        const strokeSpy = spyOn(component['ctx'], 'stroke');
        component.onMouseDown(mouseEventDown);
        expect(strokeSpy).toHaveBeenCalled();
    });

    it('drawSelection should not call stroke() if (this.selectedPosition) is false', () => {
        const strokeSpy = spyOn(component['ctx'], 'stroke');
        component.onMouseDown(noOffsetMouseEventDown);
        expect(strokeSpy).not.toHaveBeenCalled();
    });

    it('onMouseUp should set mousedown to false', () => {
        const event = {} as MouseEvent;
        const mouseEventSpy = spyOn(component, 'onMouseUp').and.callThrough();
        component.onMouseUp(event);
        expect(mouseEventSpy).toHaveBeenCalled();
        expect(mouseEventSpy).toHaveBeenCalledWith(event);
        expect(component['mousedown']).toEqual(false);
    });

    it('onMouseDown should set mousedown to true', () => {
        component.onMouseDown(mouseEventDown);
        expect(component['mousedown']).toEqual(true);
    });

    it('onMouseDown should call drawSelection()', () => {
        const fillSpy = spyOn(component['ctx'], 'fill');
        component.onMouseDown(mouseEventDown);
        expect(fillSpy).toHaveBeenCalled();
    });

    it('onMouseDown should set selectedHeight to offSet.Y', () => {
        component.onMouseDown(mouseEventDown);
        expect(component['selectedHeight']).toEqual(mouseEventDown.offsetY);
    });

    it('onMouseDown should call emitHue()', () => {
        const emitHueSpy = spyOn(colorService, 'getColorAtPosition');
        component.onMouseDown(mouseEventDown);
        expect(emitHueSpy).toHaveBeenCalled();
    });

    it('onMouseMove should set selectedHeight to offSetY if mouseDown is true within the bounds of the canvas', () => {
        component['mousedown'] = true;
        component.onMouseMove(mouseEventMove);
        expect(component['selectedHeight']).toEqual(mouseEventMove.offsetY);
    });

    it('onMouseMove should call drawSelection() if mouseDown is true', () => {
        component['mousedown'] = true;
        const fillSpy = spyOn(component['ctx'], 'fill');
        component.onMouseMove(mouseEventMove);
        expect(fillSpy).toHaveBeenCalled();
    });

    it('onMouseMove should call emitHue() if mouseDown is true', () => {
        component['mousedown'] = true;
        const emitHueSpy = spyOn(colorService, 'getColorAtPosition');
        component.onMouseMove(mouseEventMove);
        expect(emitHueSpy).toHaveBeenCalled();
    });

    it('onMouseMove should not set selectedHeight to offSet.Y if mouseDown is false', () => {
        component['mousedown'] = false;
        component.onMouseMove(mouseEventMove);
        expect(component['selectedHeight']).not.toEqual(mouseEventMove.offsetY);
    });

    it('onMouseMove should not call drawSelection() mouseDown is false', () => {
        component['mousedown'] = false;
        const fillSpy = spyOn(component['ctx'], 'fill');
        component.onMouseMove(mouseEventMove);
        expect(fillSpy).not.toHaveBeenCalled();
    });

    it('onMouseMove should not call emitHue() mouseDown is false', () => {
        component['mousedown'] = false;
        const emitHueSpy = spyOn(colorService, 'getColorAtPosition');
        component.onMouseMove(mouseEventMove);
        expect(emitHueSpy).not.toHaveBeenCalled();
    });
});
