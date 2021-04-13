import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import * as ColorConstants from '@app/constants/color-constants';
import { ColorService } from '@app/services/color/color.service';
import { ColorHistoryComponent } from './color-history.component';

describe('ColorHistoryComponent', () => {
    let component: ColorHistoryComponent;
    let fixture: ComponentFixture<ColorHistoryComponent>;
    let colorService: ColorService;
    let mouseEventLeft: MouseEvent;
    let mouseEventRight: MouseEvent;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ColorHistoryComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ColorHistoryComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        const placeholder = { red: 255, green: 255, blue: 255, alpha: 1 };
        for (let i = 0; i < ColorConstants.MAX_SAVED_COLORS; i++) {
            component.savedColors.push(placeholder);
        }

        colorService = TestBed.inject(ColorService);
        mouseEventLeft = {
            offsetX: 25,
            offsetY: 25,
            button: 0,
        } as MouseEvent;
        mouseEventRight = {
            offsetX: 25,
            offsetY: 25,
            button: 1,
        } as MouseEvent;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('onLeftClick should call color service method getColorAtPosition()', () => {
        const getColorSpy = spyOn(colorService, 'getColorAtPosition').and.callThrough();
        component.onLeftClick(mouseEventLeft);
        expect(getColorSpy).toHaveBeenCalled();
    });

    it('onLeftClick should call color service method setPrimaryColor()', () => {
        const setPrimaryColorSpy = spyOn(colorService, 'setPrimaryColor');
        component.onLeftClick(mouseEventLeft);
        expect(setPrimaryColorSpy).toHaveBeenCalled();
    });

    it('onRightClick should call color service method getColorAtPosition()', () => {
        const getColorSpy = spyOn(colorService, 'getColorAtPosition').and.callThrough();
        component.onLeftClick(mouseEventRight);
        expect(getColorSpy).toHaveBeenCalled();
    });

    it('onRightClick should call color service method setSecondaryColor()', () => {
        const setSecondaryColorSpy = spyOn(colorService, 'setSecondaryColor');
        component.onRightClick(mouseEventRight);
        expect(setSecondaryColorSpy).toHaveBeenCalled();
    });

    it('should call draw after view init', () => {
        const drawSpy = spyOn(component, 'drawHistory');
        component.ngAfterViewInit();
        expect(drawSpy).toHaveBeenCalled();
    });

    it('should fill history with set colors if savedColors is not empty', () => {
        const convertRgbaStringSpy = spyOn(colorService, 'convertRgbaToString');
        component.drawHistory();
        expect(convertRgbaStringSpy).toHaveBeenCalled();
    });

    it('should fill history with default colors if savedColors is empty', () => {
        component.savedColors = new Array();
        const convertRgbaStringSpy = spyOn(colorService, 'convertRgbaToString');
        component.drawHistory();
        expect(convertRgbaStringSpy).not.toHaveBeenCalled();
    });
});
