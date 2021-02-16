import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { Rgba } from '@app/classes/rgba';

@Component({
    selector: 'app-rgb-selector',
    templateUrl: './rgb-selector.component.html',
    styleUrls: ['./rgb-selector.component.scss'],
})
export class RgbSelectorComponent implements OnChanges {
    red: string = '0';
    green: string = '0';
    blue: string = '0';
    invalidInput: boolean = false;

    @Input()
    initialColor: Rgba = { red: '255', green: '255', blue: '255', alpha: 1 };

    @Output()
    newColor: EventEmitter<Rgba> = new EventEmitter();

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.initialColor) {
            this.red = this.initialColor.red;
            this.green = this.initialColor.green;
            this.blue = this.initialColor.blue;
        }
    }

    onInput(evt: Event): void {
        const input = (evt.target as HTMLInputElement).value;
        if (input !== undefined && this.isValidHexCode(input)) {
            if ('red-input' === (evt.target as HTMLInputElement).id) {
                this.red = this.convertHexToDec(input);
            } else if ('green-input' === (evt.target as HTMLInputElement).id) {
                this.green = this.convertHexToDec(input);
            } else {
                this.blue = this.convertHexToDec(input);
            }
            this.emitColor(this.newColor);
            this.invalidInput = false;
        } else {
            this.invalidInput = true;
        }
    }

    emitColor(newColor: EventEmitter<Rgba>): void {
        newColor.emit({ red: this.red, green: this.green, blue: this.blue, alpha: this.initialColor.alpha });
    }

    isValidHexCode(code: string): boolean {
        return /^[a-fA-F0-9]+$/i.test(code);
    }

    convertHexToDec(hex: string): string {
        return parseInt(hex, 16).toString();
    }

    printDecToHex(dec: string): string {
        return parseInt(dec, 10).toString(16).toUpperCase();
    }
}
