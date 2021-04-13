import { SimpleChange, SimpleChanges } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RgbSelectorComponent } from './rgb-selector.component';

describe('RgbSelectorComponent', () => {
    let component: RgbSelectorComponent;
    let fixture: ComponentFixture<RgbSelectorComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [RgbSelectorComponent],
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

    it('returns true with valid hex code', () => {
        const isValid = component.isValidHexCode('jfkldas1231');
        expect(isValid).toBeFalsy();
    });

    it('returns true with valid hex code', () => {
        const isValid = component.isValidHexCode('1234567890abcef');
        expect(isValid).toBeTruthy();
    });

    it('converts string properly from hex to dec', () => {
        const dec = component.convertHexToDec('FACE01');
        expect(dec).toEqual(16436737);
    });

    it('converts string properly from dec to hex', () => {
        const hex = component.printDecToHex(1234567);
        expect(hex).toEqual('12D687');
    });

    it('should emit color output', () => {
        const outputEmitSpy = spyOn(component.newColor, 'emit');
        component.emitColor(component.newColor);
        expect(outputEmitSpy).toHaveBeenCalled();
    });

    it('onInput sets red value if red field is in focus', () => {
        const hexToDecSpy = spyOn(component, 'convertHexToDec');
        const emitSpy = spyOn(component, 'emitColor');

        const input = fixture.debugElement.query(By.css('#red-input')).nativeElement as HTMLInputElement;
        input.value = 'A';
        const event = { isTrusted: true, target: input as EventTarget } as CustomEvent;
        component.onInput(event);
        expect(hexToDecSpy).toHaveBeenCalledWith(input.value);
        expect(emitSpy).toHaveBeenCalled();
    });

    it('onInput only sets invalidInput on true with empty input in red field', async(() => {
        fixture.whenStable().then(() => {
            const emitSpy = spyOn(component, 'emitColor');
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
            const emitSpy = spyOn(component, 'emitColor');
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
            const emitColorSpy = spyOn(component, 'emitColor');
            const input = fixture.debugElement.query(By.css('#red-input')).nativeElement as HTMLInputElement;
            input.value = 'AB';
            input.dispatchEvent(new Event('input'));
            expect(emitColorSpy).toHaveBeenCalled();
        });
    }));

    it('onInput sets green value if green field is in focus', () => {
        const hexToDecSpy = spyOn(component, 'convertHexToDec');
        const emitSpy = spyOn(component, 'emitColor');

        const input = fixture.debugElement.query(By.css('#green-input')).nativeElement as HTMLInputElement;
        input.value = 'A';
        const event = { isTrusted: true, target: input as EventTarget } as CustomEvent;
        component.onInput(event);
        expect(hexToDecSpy).toHaveBeenCalledWith(input.value);
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
            const emitColorSpy = spyOn(component, 'emitColor');
            const input = fixture.debugElement.query(By.css('#green-input')).nativeElement as HTMLInputElement;
            input.value = 'CC';
            input.dispatchEvent(new Event('input'));
            expect(emitColorSpy).toHaveBeenCalled();
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
            const input = fixture.debugElement.query(By.css('#blue-input')).nativeElement as HTMLInputElement;
            expect(input.value).toBe(component.blue.toString());
            input.value = 'CC';
            input.dispatchEvent(new Event('input'));
            expect(fixture.componentInstance.blue).toEqual(204);
            expect(component.invalidInput).toBeFalsy();
        });
    }));

    it('onInput emits new color with valid blue input', async(() => {
        fixture.whenStable().then(() => {
            const emitColorSpy = spyOn(component, 'emitColor');
            const input = fixture.debugElement.query(By.css('#blue-input')).nativeElement as HTMLInputElement;
            input.value = 'CC';
            input.dispatchEvent(new Event('input'));
            expect(emitColorSpy).toHaveBeenCalled();
        });
    }));
});
