import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ColorOptionsComponent } from '@app/components/color-picker/color-options/color-options.component';
import { ColorPaletteComponent } from '@app/components/color-picker/color-options/color-palette/color-palette.component';
import { ColorSliderComponent } from '@app/components/color-picker/color-options/color-slider/color-slider.component';
import { RgbSelectorComponent } from '@app/components/color-picker/color-options/rgb-selector/rgb-selector.component';
import { ShortcutManagerService } from '@app/services/manager/shortcut-manager.service';

describe('ColorOptionsComponent', () => {
    let component: ColorOptionsComponent;
    let fixture: ComponentFixture<ColorOptionsComponent>;
    let shortcutManagerSpy: jasmine.SpyObj<ShortcutManagerService>;

    beforeEach(async(() => {
        shortcutManagerSpy = jasmine.createSpyObj('ShortcutManagerService', ['']);
        TestBed.configureTestingModule({
            declarations: [ColorOptionsComponent, ColorPaletteComponent, ColorSliderComponent, RgbSelectorComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
            providers: [{ provide: ShortcutManagerService, useValue: shortcutManagerSpy }],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ColorOptionsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('confirmColorPick should emit new color', () => {
        const emitSpy = spyOn(component.newColor, 'emit');
        component.confirmColorPick();
        expect(emitSpy).toHaveBeenCalled();
    });

    it('confirmColorPick should emit false to close options', () => {
        const emitSpy = spyOn(component.showOptions, 'emit');
        component.confirmColorPick();
        expect(emitSpy).toHaveBeenCalled();
    });
});
