import { SimpleChange } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { Rgba } from '@app/classes/rgba';
import { ColorService } from '@app/services/color/color.service';
import { ColorPaletteComponent } from './color-palette.component';

// tslint:disable: no-string-literal
describe('ColorPaletteComponent', () => {
    let component: ColorPaletteComponent;
    let fixture: ComponentFixture<ColorPaletteComponent>;
    let colorService: ColorService;
    let mouseEventDown: MouseEvent;
    let mouseEventMove: MouseEvent;
    let canvasTestHelper: CanvasTestHelper;
    const placeholderX = 1;
    const placeholderY = 2;
    const colorPlaceholderBlack: Rgba = { red: 0, green: 0, blue: 0, alpha: 1 };

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ColorPaletteComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ColorPaletteComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();

        canvasTestHelper = TestBed.inject(CanvasTestHelper);
        colorService = TestBed.inject(ColorService);
        component['ctx'] = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
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

    it('AfterViewInit should call draw', () => {
        const fillRectSpy = spyOn(component['ctx'], 'fillRect');
        component.ngAfterViewInit();
        expect(fillRectSpy).toHaveBeenCalled();
    });

    it('draw should call convertRgbaToString() if hue isnt undefined', () => {
        component.hue = colorPlaceholderBlack;
        const convertRgbaToStringSpy = spyOn(colorService, 'convertRgbaToString');
        component.ngAfterViewInit();
        expect(convertRgbaToStringSpy).toHaveBeenCalled();
    });

    it('draw should not call convertRgbaToString() if hue is undefined', () => {
        component.ngAfterViewInit();
        const convertRgbaToStringSpy = spyOn(colorService, 'convertRgbaToString');
        expect(convertRgbaToStringSpy).not.toHaveBeenCalled();
    });

    it('draw should call fillRect()', () => {
        const fillRectSpy = spyOn(component['ctx'], 'fillRect');
        component.ngAfterViewInit();
        expect(fillRectSpy).toHaveBeenCalled();
    });

    it('draw should call createLinearGradient()', () => {
        const createLinearGradientSpy = spyOn(component['ctx'], 'createLinearGradient').and.callThrough();
        component.ngAfterViewInit();
        expect(createLinearGradientSpy).toHaveBeenCalled();
    });

    it('draw should call beginPath() if (this.selectedPosition) is true', () => {
        const beginPathSpy = spyOn(component['ctx'], 'beginPath');
        component['selectedPosition'] = { x: placeholderX, y: placeholderY };
        component.ngAfterViewInit();
        expect(beginPathSpy).toHaveBeenCalled();
    });

    it('draw should call arc() if (this.selectedPosition) is true', () => {
        const arcSpy = spyOn(component['ctx'], 'arc');
        component['selectedPosition'] = { x: placeholderX, y: placeholderY };
        component.ngAfterViewInit();
        expect(arcSpy).toHaveBeenCalled();
    });

    it('draw should call stroke() if (this.selectedPosition) is true', () => {
        const strokeSpy = spyOn(component['ctx'], 'stroke');
        component['selectedPosition'] = { x: placeholderX, y: placeholderY };
        component.ngAfterViewInit();
        expect(strokeSpy).toHaveBeenCalled();
    });

    it('draw should not call stroke() if (this.selectedPosition) is false', () => {
        const strokeSpy = spyOn(component['ctx'], 'stroke');
        component.ngAfterViewInit();
        expect(strokeSpy).not.toHaveBeenCalled();
    });

    it('should call draw() if hue changes', () => {
        const fillRectSpy = spyOn(component['ctx'], 'fillRect');
        component.ngOnChanges({
            hue: new SimpleChange(null, colorPlaceholderBlack, false),
        });
        fixture.detectChanges();
        expect(fillRectSpy).toHaveBeenCalled();
    });

    it('should not call draw() if hue doesnt change', () => {
        const fillRectSpy = spyOn(component['ctx'], 'fillRect');
        component.ngOnChanges({});
        fixture.detectChanges();
        expect(fillRectSpy).not.toHaveBeenCalled();
    });

    it('should call setColorAtPosition() if hue changes', () => {
        const getColorAtPositionSpy = spyOn(colorService, 'getColorAtPosition');
        component['selectedPosition'] = { x: 1, y: 1 };
        component.ngOnChanges({
            hue: new SimpleChange(null, colorPlaceholderBlack, false),
        });
        fixture.detectChanges();
        expect(getColorAtPositionSpy).toHaveBeenCalledWith(
            component['ctx'],
            component['selectedPosition'].x,
            component['selectedPosition'].y,
            component.currentOpacity,
        );
        expect(component['selectedPosition'].x).toEqual(1);
        expect(component['selectedPosition'].y).toEqual(1);
    });

    it('onMouseUp should set mousedown to false', () => {
        const event = {} as MouseEvent;
        const mouseEventSpy = spyOn(component, 'onMouseUp').and.callThrough();
        component.onMouseUp(event);
        expect(mouseEventSpy).toHaveBeenCalled();
        expect(mouseEventSpy).toHaveBeenCalledWith(event);
        expect(component['mousedown']).toEqual(false);
    });

    it('onMouseDown should set mouseDown to true', () => {
        component.onMouseDown(mouseEventDown);
        expect(component['mousedown']).toEqual(true);
    });

    it('onMouseDown should set selectedPosition to {offset.X, offSet.Y}', () => {
        component.onMouseDown(mouseEventDown);
        const currentPosition = { x: mouseEventDown.offsetX, y: mouseEventDown.offsetY };
        expect(component['selectedPosition']).toEqual(currentPosition);
    });

    it('onMouseDown should call draw()', () => {
        const fillRectSpy = spyOn(component['ctx'], 'fillRect');
        component.onMouseDown(mouseEventDown);
        expect(fillRectSpy).toHaveBeenCalled();
    });

    it('onMouseDown should call setColorAtPosition() with currentPosition', () => {
        const getColorAtPositionSpy = spyOn(colorService, 'getColorAtPosition');
        const currentPosition = { x: mouseEventDown.offsetX, y: mouseEventDown.offsetY };
        component.onMouseDown(mouseEventDown);
        expect(getColorAtPositionSpy).toHaveBeenCalled();
        expect(getColorAtPositionSpy).toHaveBeenCalledWith(component['ctx'], currentPosition.x, currentPosition.y, component.currentOpacity);
    });

    it('onMouseMove should set selectedPosition to (offSet.X, offSet.Y) if mouseDown is true', () => {
        component['mousedown'] = true;
        const currentPosition = { x: mouseEventMove.offsetX, y: mouseEventMove.offsetY };
        component.onMouseMove(mouseEventMove);
        expect(component['selectedPosition']).toEqual(currentPosition);
    });

    it('onMouseMove should call draw() mouseDown is true', () => {
        component['mousedown'] = true;
        const fillRectSpy = spyOn(component['ctx'], 'fillRect');
        component.onMouseMove(mouseEventMove);
        expect(fillRectSpy).toHaveBeenCalled();
    });

    it('onMouseMove should call setColorAtPosition with current position if mouseDown is true', () => {
        component['mousedown'] = true;
        const getColorAtPositionSpy = spyOn(colorService, 'getColorAtPosition');
        component.onMouseMove(mouseEventMove);
        expect(getColorAtPositionSpy).toHaveBeenCalled();
    });

    it('onMouseMove should not set selectedPosition to (offSet.X, offSet.Y) if mouseDown is false', () => {
        component['mousedown'] = false;
        const currentPosition = { x: mouseEventMove.offsetX, y: mouseEventMove.offsetY };
        component.onMouseMove(mouseEventMove);
        expect(component['selectedPosition']).not.toEqual(currentPosition);
    });

    it('onMouseMove should not call draw() if mouseDown is false', () => {
        component['mousedown'] = false;
        const fillRectSpy = spyOn(component['ctx'], 'fillRect');
        component.onMouseMove(mouseEventMove);
        expect(fillRectSpy).not.toHaveBeenCalled();
    });

    it('onMouseMove should not call setColorAtPosition if mouseDown is false', () => {
        component['mousedown'] = false;
        const getColorAtPositionSpy = spyOn(colorService, 'getColorAtPosition');
        component.onMouseMove(mouseEventMove);
        expect(getColorAtPositionSpy).not.toHaveBeenCalled();
    });

    it('setColorAtPosition should call emit()', () => {
        spyOn(colorService, 'getColorAtPosition').and.callFake(() => {
            return colorPlaceholderBlack;
        });
        const emitSpy = spyOn(component.color, 'emit');
        component.onMouseDown(mouseEventDown);
        expect(emitSpy).toHaveBeenCalled();
        expect(emitSpy).toHaveBeenCalledWith(colorPlaceholderBlack);
    });
});
