import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Rgba } from '@app/classes/rgba';
import * as ColorConstants from '@app/constants/color-constants';
import { ColorService } from '@app/services/color/color.service';
import { ColorHistoryComponent } from './color-history/color-history.component';
import { ColorPickerComponent } from './color-picker.component';

describe('ColorPickerComponent', () => {
    let component: ColorPickerComponent;
    let fixture: ComponentFixture<ColorPickerComponent>;
    let colorService: ColorService;
    let newColor: Rgba;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ColorPickerComponent, ColorHistoryComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ColorPickerComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        colorService = TestBed.inject(ColorService);
        component.primaryColor = { red: '1', green: '2', blue: '3', alpha: 0.1 };
        component.secondaryColor = { red: '100', green: '200', blue: '300', alpha: 0 };
        newColor = { red: '1', green: '2', blue: '3', alpha: 0.1 };
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should switch primary and secondary colors and opacity', () => {
        const primaryColorInitial = component.primaryColor;
        const secondarycolorInitial = component.secondaryColor;
        component.switchPrimarySecondary();
        expect(component.primaryColor).toBe(secondarycolorInitial);
        expect(component.secondaryColor).toBe(primaryColorInitial);
    });

    it('togglePrimaryPickerOpen sets inverses showPrimary', () => {
        const initialShowPrimary: boolean = component.showPrimaryOptions;
        component.togglePrimaryPickerOpen();
        expect(component.showPrimaryOptions).not.toEqual(initialShowPrimary);
    });

    it('toggleSecondaryPickerOpen sets inverses showSecondary', () => {
        const initialShowSecondary: boolean = component.showSecondaryOptions;
        component.toggleSecondaryPickerOpen();
        expect(component.showSecondaryOptions).not.toEqual(initialShowSecondary);
    });

    it('togglePrimaryPickerOpen always sets showSecondary to false', () => {
        component.showSecondaryOptions = true;
        component.togglePrimaryPickerOpen();
        expect(component.showSecondaryOptions).toBeFalse();
        component.showSecondaryOptions = false;
        component.togglePrimaryPickerOpen();
        expect(component.showSecondaryOptions).toBeFalse();
    });

    it('toggleSecondaryPickerOpen always sets showPrimary to false', () => {
        component.showPrimaryOptions = true;
        component.toggleSecondaryPickerOpen();
        expect(component.showPrimaryOptions).toBeFalse();
        component.showPrimaryOptions = false;
        component.toggleSecondaryPickerOpen();
        expect(component.showPrimaryOptions).toBeFalse();
    });

    it('saveColor pushes colors with full opacity', () => {
        component.saveColor(newColor);
        // new color is set exactly the same as primary color
        expect(component.savedColors[0]).not.toEqual(newColor);
        expect(component.savedColors[0].alpha).toEqual(1);
    });

    it('saveColor removes last color when color history reaches maximum capacity', () => {
        const popSpy = spyOn(component.savedColors, 'pop');
        component.savedColors.length = ColorConstants.MAX_SAVED_COLORS;
        component.saveColor(newColor);
        expect(popSpy).toHaveBeenCalled();
    });

    it('saveColor keeps all existing colors when color history has not reached max capacity', () => {
        const popSpy = spyOn(component.savedColors, 'pop');
        component.savedColors.length = 1;
        component.saveColor(newColor);
        expect(popSpy).not.toHaveBeenCalled();
    });

    it('saveColor adds new color to the start of array', () => {
        component.saveColor(newColor);
        const pushedColor = newColor;
        pushedColor.alpha = 1;
        expect(component.savedColors[0]).toEqual(pushedColor);
    });

    it('confirmColorPick sets primary color is showPrimary is true', () => {
        const setPrimaryColorSpy = spyOn(colorService, 'setPrimaryColor');
        component.showPrimaryOptions = true;
        component.confirmColorPick(newColor);
        expect(setPrimaryColorSpy).toHaveBeenCalled();
    });

    it('confirmColorPick sets primary color is showPrimary is true', () => {
        const setSecondaryColorSpy = spyOn(colorService, 'setSecondaryColor');
        component.showPrimaryOptions = false;
        component.confirmColorPick(newColor);
        expect(setSecondaryColorSpy).toHaveBeenCalled();
    });

    it('confirmColorPick calls saveColor', () => {
        const saveColorSpy = spyOn(component, 'saveColor');
        component.confirmColorPick(newColor);
        expect(saveColorSpy).toHaveBeenCalled();
    });
});
