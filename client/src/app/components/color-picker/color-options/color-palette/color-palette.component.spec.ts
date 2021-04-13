import { SimpleChange } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Rgba } from '@app/classes/rgba';
import { ColorService } from '@app/services/color/color.service';
import { ColorPaletteComponent } from './color-palette.component';

describe('ColorPaletteComponent', () => {
    let component: ColorPaletteComponent;
    let fixture: ComponentFixture<ColorPaletteComponent>;
    let colorService: ColorService;
    let mouseEventDown: MouseEvent;
    let mouseEventMove: MouseEvent;
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

    it('AfterViewInit should call draw', () => {
        const drawSpy = spyOn(component, 'draw');
        component.ngAfterViewInit();
        expect(drawSpy).toHaveBeenCalled();
    });

    it('draw should call convertRgbaToString() if hue isnt undefined', () => {
        component.hue = colorPlaceholderBlack;
        const convertRgbaToStringSpy = spyOn(colorService, 'convertRgbaToString');
        component.draw();
        expect(convertRgbaToStringSpy).toHaveBeenCalled();
    });

    it('draw should not call convertRgbaToString() if hue is undefined', () => {
        component.draw();
        const convertRgbaToStringSpy = spyOn(colorService, 'convertRgbaToString');
        expect(convertRgbaToStringSpy).not.toHaveBeenCalled();
    });

    it('draw should call fillRect() if', () => {
        const fillRectSpy = spyOn(component.ctx, 'fillRect');
        component.draw();
        expect(fillRectSpy).toHaveBeenCalled();
    });

    it('draw should call createLinearGradient()', () => {
        const createLinearGradientSpy = spyOn(component.ctx, 'createLinearGradient').and.callThrough();
        component.draw();
        expect(createLinearGradientSpy).toHaveBeenCalled();
    });

    it('draw should call beginPath() if (this.selectedPosition) is true', () => {
        const beginPathSpy = spyOn(component.ctx, 'beginPath');
        component.selectedPosition = { x: placeholderX, y: placeholderY };
        component.draw();
        expect(beginPathSpy).toHaveBeenCalled();
    });

    it('draw should call arc() if (this.selectedPosition) is true', () => {
        const arcSpy = spyOn(component.ctx, 'arc');
        component.selectedPosition = { x: placeholderX, y: placeholderY };
        component.draw();
        expect(arcSpy).toHaveBeenCalled();
    });

    it('draw should call stroke() if (this.selectedPosition) is true', () => {
        const strokeSpy = spyOn(component.ctx, 'stroke');
        component.selectedPosition = { x: placeholderX, y: placeholderY };
        component.draw();
        expect(strokeSpy).toHaveBeenCalled();
    });

    it('draw should not call stroke() if (this.selectedPosition) is false', () => {
        const strokeSpy = spyOn(component.ctx, 'stroke');
        component.draw();
        expect(strokeSpy).not.toHaveBeenCalled();
    });

    it('should call draw() if hue changes', () => {
        const drawSpy = spyOn(component, 'draw');
        component.ngOnChanges({
            hue: new SimpleChange(null, colorPlaceholderBlack, false),
        });
        fixture.detectChanges();
        expect(drawSpy).toHaveBeenCalled();
    });

    it('should not call draw() if hue doesnt change', () => {
        const drawSpy = spyOn(component, 'draw');
        component.ngOnChanges({});
        fixture.detectChanges();
        expect(drawSpy).not.toHaveBeenCalled();
    });

    it('should call setColorAtPosition() if hue changes', () => {
        const setColorAtPositionSpy = spyOn(component, 'setColorAtPosition');
        component.selectedPosition = { x: 1, y: 1 };
        component.ngOnChanges({
            hue: new SimpleChange(null, colorPlaceholderBlack, false),
        });
        fixture.detectChanges();
        expect(setColorAtPositionSpy).toHaveBeenCalledWith(component.selectedPosition.x, component.selectedPosition.y);
        expect(component.selectedPosition.x).toEqual(1);
        expect(component.selectedPosition.y).toEqual(1);
    });

    it('onMouseUp should set mousedown to false', () => {
        const event = {} as MouseEvent;
        const mouseEventSpy = spyOn(component, 'onMouseUp').and.callThrough();
        component.onMouseUp(event);
        expect(mouseEventSpy).toHaveBeenCalled();
        expect(mouseEventSpy).toHaveBeenCalledWith(event);
        expect(component.mousedown).toEqual(false);
    });

    it('onMouseDown should set mouseDown to true', () => {
        component.onMouseDown(mouseEventDown);
        expect(component.mousedown).toEqual(true);
    });

    it('onMouseDown should set selectedPosition to {offset.X, offSet.Y}', () => {
        component.onMouseDown(mouseEventDown);
        const currentPosition = { x: mouseEventDown.offsetX, y: mouseEventDown.offsetY };
        expect(component.selectedPosition).toEqual(currentPosition);
    });

    it('onMouseDown should call draw()', () => {
        const drawSpy = spyOn(component, 'draw');
        component.onMouseDown(mouseEventDown);
        expect(drawSpy).toHaveBeenCalled();
    });

    it('onMouseDown should call setColorAtPosition() with currentPosition', () => {
        const setColorAtPositionSpy = spyOn(component, 'setColorAtPosition');
        const currentPosition = { x: mouseEventDown.offsetX, y: mouseEventDown.offsetY };
        component.onMouseDown(mouseEventDown);
        expect(setColorAtPositionSpy).toHaveBeenCalled();
        expect(setColorAtPositionSpy).toHaveBeenCalledWith(currentPosition.x, currentPosition.y);
    });

    it('onMouseMove should set selectedPosition to (offSet.X, offSet.Y) if mouseDown is true', () => {
        component.mousedown = true;
        const currentPosition = { x: mouseEventMove.offsetX, y: mouseEventMove.offsetY };
        component.onMouseMove(mouseEventMove);
        expect(component.selectedPosition).toEqual(currentPosition);
    });

    it('onMouseMove should call draw() mouseDown is true', () => {
        component.mousedown = true;
        const drawSpy = spyOn(component, 'draw');
        component.onMouseMove(mouseEventMove);
        expect(drawSpy).toHaveBeenCalled();
    });

    it('onMouseMove should call setColorAtPosition with current position if mouseDown is true', () => {
        component.mousedown = true;
        const setColorAtPositionSpy = spyOn(component, 'setColorAtPosition');
        component.onMouseMove(mouseEventMove);
        expect(setColorAtPositionSpy).toHaveBeenCalledWith(mouseEventMove.offsetX, mouseEventMove.offsetY);
    });

    it('onMouseMove should not set selectedPosition to (offSet.X, offSet.Y) if mouseDown is false', () => {
        component.mousedown = false;
        const currentPosition = { x: mouseEventMove.offsetX, y: mouseEventMove.offsetY };
        component.onMouseMove(mouseEventMove);
        expect(component.selectedPosition).not.toEqual(currentPosition);
    });

    it('onMouseMove should not call draw() if mouseDown is false', () => {
        component.mousedown = false;
        const drawSpy = spyOn(component, 'draw');
        component.onMouseMove(mouseEventMove);
        expect(drawSpy).not.toHaveBeenCalled();
    });

    it('onMouseMove should not call setColorAtPosition if mouseDown is false', () => {
        component.mousedown = false;
        const setColorAtPositionSpy = spyOn(component, 'setColorAtPosition');
        component.onMouseMove(mouseEventMove);
        expect(setColorAtPositionSpy).not.toHaveBeenCalled();
    });

    it('setColorAtPosition should call color service method getColorAtPosition()', () => {
        const getColorSpy = spyOn(colorService, 'getColorAtPosition');
        component.setColorAtPosition(placeholderX, placeholderY);
        expect(getColorSpy).toHaveBeenCalled();
    });

    it('setColorAtPosition should call emit()', () => {
        spyOn(colorService, 'getColorAtPosition').and.callFake(() => {
            return colorPlaceholderBlack;
        });
        const emitSpy = spyOn(component.color, 'emit');
        component.setColorAtPosition(placeholderX, placeholderY);
        expect(emitSpy).toHaveBeenCalled();
        expect(emitSpy).toHaveBeenCalledWith(colorPlaceholderBlack);
    });
});
