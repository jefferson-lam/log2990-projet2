import { Component, ElementRef, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { Rgba } from '@app/classes/rgba';
import { ShortcutManagerService } from '@app/services/manager/shortcut-manager.service';

@Component({
    selector: 'app-rgb-selector',
    templateUrl: './rgb-selector.component.html',
    styleUrls: ['./rgb-selector.component.scss'],
})
export class RgbSelectorComponent implements OnChanges {
    red: number;
    green: number;
    blue: number;
    invalidInput: boolean;

    @ViewChild('redInput', { static: false }) private redInput: ElementRef<HTMLInputElement>;
    @ViewChild('greenInput', { static: false }) private greenInput: ElementRef<HTMLInputElement>;
    @ViewChild('blueInput', { static: false }) private blueInput: ElementRef<HTMLInputElement>;

    @Input() initialColor: Rgba;

    @Output() newColor: EventEmitter<Rgba>;

    constructor(public shortcutManager: ShortcutManagerService) {
        this.red = 0;
        this.green = 0;
        this.blue = 0;
        this.invalidInput = false;
        this.initialColor = { red: 255, green: 255, blue: 255, alpha: 1 };
        this.newColor = new EventEmitter();
        this.invalidInput = false;
    }

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
            this.red = this.convertHexToDec(this.redInput.nativeElement.value);
            this.green = this.convertHexToDec(this.greenInput.nativeElement.value);
            this.blue = this.convertHexToDec(this.blueInput.nativeElement.value);

            this.emitColor(this.newColor);
            this.invalidInput = false;
        } else {
            this.invalidInput = true;
        }
    }

    printDecToHex(dec: number): string {
        return dec.toString(16).toUpperCase();
    }
    private emitColor(newColor: EventEmitter<Rgba>): void {
        newColor.emit({ red: this.red, green: this.green, blue: this.blue, alpha: this.initialColor.alpha });
    }

    private isValidHexCode(code: string): boolean {
        return /^[a-fA-F0-9]+$/i.test(code);
    }

    private convertHexToDec(hex: string): number {
        return parseInt(hex, 16);
    }
}
