import { SimpleChange, SimpleChanges } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ShortcutManagerService } from '@app/services/manager/shortcut-manager.service';
import { RgbSelectorComponent } from './rgb-selector.component';

describe('RgbSelectorComponent', () => {
    let component: RgbSelectorComponent;
    let fixture: ComponentFixture<RgbSelectorComponent>;
    let shortcutManagerSpy: jasmine.SpyObj<ShortcutManagerService>;

    beforeEach(async(() => {
        shortcutManagerSpy = jasmine.createSpyObj('ShortcutManagerService', ['']);
        TestBed.configureTestingModule({
            declarations: [RgbSelectorComponent],
            providers: [{ provide: ShortcutManagerService, useValue: shortcutManagerSpy }],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(RgbSelectorComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should update red, green, blue values if color from palette changes', () => {
        component.ngOnChanges({
            initialColor: new SimpleChange(null, component.initialColor, false),
        });
        fixture.detectChanges();
        expect(component.red).toEqual(component.initialColor.red);
        expect(component.green).toEqual(component.initialColor.green);
        expect(component.blue).toEqual(component.initialColor.blue);
    });

    it('should not update red, green or blue values if color from palette does not change', () => {
        const initialRed = component.red;
        const initialGreen = component.green;
        const initialBlue = component.blue;
        component.ngOnChanges({} as SimpleChanges);
        fixture.detectChanges();
        expect(component.red).toEqual(initialRed);
        expect(component.green).toEqual(initialGreen);
        expect(component.blue).toEqual(initialBlue);
    });

    it('converts string properly from dec to hex', () => {
        const mockNumber = 1234567;
        const hex = component.printDecToHex(mockNumber);
        expect(hex).toEqual('12D687');
    });

    it('onInput sets red value if red field is in focus', () => {
        const emitSpy = spyOn(component.newColor, 'emit');

        const input = fixture.debugElement.query(By.css('#red-input')).nativeElement as HTMLInputElement;
        input.value = 'A';
        const event = { isTrusted: true, target: input as EventTarget } as CustomEvent;
        component.onInput(event);
        expect(emitSpy).toHaveBeenCalled();
    });

    it('onInput only sets invalidInput on true with empty input in red field', async(() => {
        fixture.whenStable().then(() => {
            const emitSpy = spyOn(component.newColor, 'emit');
            const initialRed = component.red;
            const input = fixture.debugElement.query(By.css('#red-input')).nativeElement as HTMLInputElement;
            input.value = {} as string;
            input.dispatchEvent(new Event('input'));
            fixture.detectChanges();
            expect(emitSpy).not.toHaveBeenCalled();
            expect(component.invalidInput).toBeTruthy();
            expect(component.red).toEqual(initialRed);
        });
    }));

    it('onInput only sets invalidInput on true with invalid hex code input', async(() => {
        fixture.whenStable().then(() => {
            const emitSpy = spyOn(component.newColor, 'emit');
            const initialRed = component.red;
            const input = fixture.debugElement.query(By.css('#red-input')).nativeElement as HTMLInputElement;
            input.value = 'pp';
            input.dispatchEvent(new Event('input'));
            fixture.detectChanges();
            expect(emitSpy).not.toHaveBeenCalled();
            expect(component.invalidInput).toBeTruthy();
            expect(component.red).toEqual(initialRed);
        });
    }));

    it('onInput emits new color with valid red input', async(() => {
        fixture.whenStable().then(() => {
            const emitSpy = spyOn(component.newColor, 'emit');
            const input = fixture.debugElement.query(By.css('#red-input')).nativeElement as HTMLInputElement;
            input.value = 'AB';
            input.dispatchEvent(new Event('input'));
            expect(emitSpy).toHaveBeenCalled();
        });
    }));

    it('onInput sets green value if green field is in focus', () => {
        const emitSpy = spyOn(component.newColor, 'emit');

        const input = fixture.debugElement.query(By.css('#green-input')).nativeElement as HTMLInputElement;
        input.value = 'A';
        const event = { isTrusted: true, target: input as EventTarget } as CustomEvent;
        component.onInput(event);
        expect(emitSpy).toHaveBeenCalled();
    });

    it('onInput only sets invalidInput on true with empty input in green field', async(() => {
        fixture.whenStable().then(() => {
            const initialGreen = component.green;
            const input = fixture.debugElement.query(By.css('#green-input')).nativeElement as HTMLInputElement;
            input.value = {} as string;
            input.dispatchEvent(new Event('input'));
            fixture.detectChanges();
            expect(component.invalidInput).toBeTruthy();
            expect(component.red).toEqual(initialGreen);
        });
    }));

    it('onInput emits new color with valid green input', async(() => {
        fixture.whenStable().then(() => {
            const emitSpy = spyOn(component.newColor, 'emit');
            const input = fixture.debugElement.query(By.css('#green-input')).nativeElement as HTMLInputElement;
            input.value = 'CC';
            input.dispatchEvent(new Event('input'));
            expect(emitSpy).toHaveBeenCalled();
        });
    }));

    it('onInput only sets invalidInput on true with empty input in blue field', async(() => {
        fixture.whenStable().then(() => {
            const initialBlue = component.blue;
            const input = fixture.debugElement.query(By.css('#blue-input')).nativeElement as HTMLInputElement;
            input.value = {} as string;
            input.dispatchEvent(new Event('input'));
            fixture.detectChanges();
            expect(component.invalidInput).toBeTruthy();
            expect(component.blue).toEqual(initialBlue);
        });
    }));

    it('onInput changes blue value with valid blue input', async(() => {
        fixture.whenStable().then(() => {
            const CC_DEC = 204;
            const input = fixture.debugElement.query(By.css('#blue-input')).nativeElement as HTMLInputElement;
            expect(input.value).toBe(component.blue.toString());
            input.value = 'CC';
            input.dispatchEvent(new Event('input'));
            expect(fixture.componentInstance.blue).toEqual(CC_DEC);
            expect(component.invalidInput).toBeFalsy();
        });
    }));

    it('onInput emits new color with valid blue input', async(() => {
        fixture.whenStable().then(() => {
            const emitSpy = spyOn(component.newColor, 'emit');
            const input = fixture.debugElement.query(By.css('#blue-input')).nativeElement as HTMLInputElement;
            input.value = 'CC';
            input.dispatchEvent(new Event('input'));
            expect(emitSpy).toHaveBeenCalled();
        });
    }));
});
