import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ColorService } from '@app/services/color/color.service';
import { ColorSliderComponent } from './color-slider.component';

describe('ColorSliderComponent', () => {
    let component: ColorSliderComponent;
    let fixture: ComponentFixture<ColorSliderComponent>;
    let colorService: ColorService;
    let mouseEventDown: MouseEvent;
    let mouseEventMove: MouseEvent;
    const placeholderY = 25;

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
        const drawSliderSpy = spyOn(component, 'drawSlider');
        component.ngAfterViewInit();
        expect(drawSliderSpy).toHaveBeenCalled();
    });

    it('drawSlider should call clearRect()', () => {
        const clearRectSpy = spyOn(component.ctx, 'clearRect');
        component.drawSlider();
        expect(clearRectSpy).toHaveBeenCalled();
    });

    it('drawSlider should call createLinearGradient()', () => {
        const createLinearGradientSpy = spyOn(component.ctx, 'createLinearGradient').and.callThrough();
        component.drawSlider();
        expect(createLinearGradientSpy).toHaveBeenCalled();
    });

    it('drawSlider should call beginPath()', () => {
        const beginPathSpy = spyOn(component.ctx, 'beginPath');
        component.drawSlider();
        expect(beginPathSpy).toHaveBeenCalled();
    });

    it('drawSlider should call rect()', () => {
        const rectSpy = spyOn(component.ctx, 'rect');
        component.drawSlider();
        expect(rectSpy).toHaveBeenCalled();
    });

    it('drawSlider should call fill()', () => {
        const fillSpy = spyOn(component.ctx, 'fill');
        component.drawSlider();
        expect(fillSpy).toHaveBeenCalled();
    });

    it('drawSlider should call closePath()', () => {
        const closePathSpy = spyOn(component.ctx, 'closePath');
        component.drawSlider();
        expect(closePathSpy).toHaveBeenCalled();
    });

    it('drawSelection should call always drawSlider()', () => {
        component.selectedHeight = placeholderY;
        const drawSlider = spyOn(component, 'drawSlider');
        component.drawSelection();
        expect(drawSlider).toHaveBeenCalled();
    });

    it('drawSelection should call stroke() if (this.selectedPosition) is true', () => {
        component.selectedHeight = placeholderY;
        const strokeSpy = spyOn(component.ctx, 'stroke');
        component.drawSelection();
        expect(strokeSpy).toHaveBeenCalled();
    });

    it('drawSelection should not call stroke() if (this.selectedPosition) is false', () => {
        const strokeSpy = spyOn(component.ctx, 'stroke');
        component.drawSelection();
        expect(strokeSpy).not.toHaveBeenCalled();
    });

    it('onMouseUp should set mousedown to false', () => {
        const event = {} as MouseEvent;
        const mouseEventSpy = spyOn(component, 'onMouseUp').and.callThrough();
        component.onMouseUp(event);
        expect(mouseEventSpy).toHaveBeenCalled();
        expect(mouseEventSpy).toHaveBeenCalledWith(event);
        expect(component.mousedown).toEqual(false);
    });

    it('onMouseDown should set mousedown to true', () => {
        component.onMouseDown(mouseEventDown);
        expect(component.mousedown).toEqual(true);
    });

    it('onMouseDown should call drawSelection()', () => {
        const drawSelectionSpy = spyOn(component, 'drawSelection');
        component.onMouseDown(mouseEventDown);
        expect(drawSelectionSpy).toHaveBeenCalled();
    });

    it('onMouseDown should set selectedHeight to offSet.Y', () => {
        component.onMouseDown(mouseEventDown);
        expect(component.selectedHeight).toEqual(mouseEventDown.offsetY);
    });

    it('onMouseDown should call emitHue()', () => {
        const emitHueSpy = spyOn(component, 'emitHue');
        component.onMouseDown(mouseEventDown);
        expect(emitHueSpy).toHaveBeenCalled();
    });

    it('onMouseMove should set selectedHeight to offSetY if mouseDown is true within the bounds of the canvas', () => {
        component.mousedown = true;
        component.onMouseMove(mouseEventMove);
        expect(component.selectedHeight).toEqual(mouseEventMove.offsetY);
    });

    it('onMouseMove should call drawSelection() if mouseDown is true', () => {
        component.mousedown = true;
        const drawSelectionSpy = spyOn(component, 'drawSelection');
        component.onMouseMove(mouseEventMove);
        expect(drawSelectionSpy).toHaveBeenCalled();
    });

    it('onMouseMove should call emitHue() if mouseDown is true', () => {
        component.mousedown = true;
        const emitHueSpy = spyOn(component, 'emitHue');
        component.onMouseMove(mouseEventMove);
        expect(emitHueSpy).toHaveBeenCalled();
    });

    it('onMouseMove should not set selectedHeight to offSet.Y if mouseDown is false', () => {
        component.mousedown = false;
        component.onMouseMove(mouseEventMove);
        expect(component.selectedHeight).not.toEqual(mouseEventMove.offsetY);
    });

    it('onMouseMove should not call drawSelection() mouseDown is false', () => {
        component.mousedown = false;
        const drawSelectionSpy = spyOn(component, 'drawSelection');
        component.onMouseMove(mouseEventMove);
        expect(drawSelectionSpy).not.toHaveBeenCalled();
    });

    it('onMouseMove should not call emitHue() mouseDown is false', () => {
        component.mousedown = false;
        const emitHueSpy = spyOn(component, 'emitHue');
        component.onMouseMove(mouseEventMove);
        expect(emitHueSpy).not.toHaveBeenCalled();
    });

    it('emitHue should call color service method getColorAtPosition()', () => {
        const getColorSpy = spyOn(colorService, 'getColorAtPosition');
        component.emitHue(placeholderY);
        expect(getColorSpy).toHaveBeenCalled();
    });
});
