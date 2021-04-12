import { Injectable } from '@angular/core';
import { Rgba } from '@app/classes/rgba';
import * as ColorConstants from '@app/constants/color-constants';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ColorService {
    primaryColor: Rgba;
    primaryColorSource: Subject<Rgba>;
    primaryObservable: Observable<Rgba>;

    secondaryColor: Rgba;
    secondaryColorSource: Subject<Rgba>;
    secondaryObservable: Observable<Rgba>;

    savedColors: Rgba[];
    savedColorsSource: Subject<Rgba[]>;
    savedColorsObservable: Observable<Rgba[]>;

    constructor() {
        this.primaryColor = { red: '0', green: '0', blue: '0', alpha: 1 };
        this.primaryColorSource = new BehaviorSubject<Rgba>(this.primaryColor);
        this.primaryObservable = this.primaryColorSource.asObservable();

        this.secondaryColor = { red: '255', green: '255', blue: '255', alpha: 1 };
        this.secondaryColorSource = new BehaviorSubject<Rgba>(this.secondaryColor);
        this.secondaryObservable = this.secondaryColorSource.asObservable();
        this.savedColors = new Array();

        const placeholder = { red: '255', green: '255', blue: '255', alpha: 1 };
        for (let i = 0; i < ColorConstants.MAX_SAVED_COLORS; i++) {
            this.savedColors.push(placeholder);
        }
        this.savedColorsSource = new BehaviorSubject<Rgba[]>(this.savedColors);
        this.savedColorsObservable = this.savedColorsSource.asObservable();
    }

    getPrimaryColor(): string {
        return this.convertRgbaToString(this.primaryColor);
    }

    getSecondaryColor(): string {
        return this.convertRgbaToString(this.secondaryColor);
    }

    setPrimaryColor(color: Rgba): void {
        this.primaryColorSource.next(color);
        this.primaryColor = color;
    }

    setSecondaryColor(color: Rgba): void {
        this.secondaryColorSource.next(color);
        this.secondaryColor = color;
    }

    changePrimaryOpacity(opacity: number): void {
        this.primaryColor.alpha = opacity;
        this.primaryColorSource.next(this.primaryColor);
    }

    changeSecondaryOpacity(opacity: number): void {
        this.secondaryColor.alpha = opacity;
        this.secondaryColorSource.next(this.secondaryColor);
    }

    convertRgbaToString(color: Rgba): string {
        return 'rgba(' + color.red + ', ' + color.green + ', ' + color.blue + ', ' + color.alpha + ')';
    }

    getColorAtPosition(ctx: CanvasRenderingContext2D, x: number, y: number, opacity: number): Rgba {
        const imageData = ctx.getImageData(x, y, 1, 1).data;
        const colorAtPosition: Rgba = { red: imageData[0].toString(), green: imageData[1].toString(), blue: imageData[2].toString(), alpha: opacity };
        return colorAtPosition;
    }

    saveColor(newColor: Rgba): void {
        // set like this to avoid modifying argument by reference
        const fullOpacityColor: Rgba = { red: newColor.red, green: newColor.green, blue: newColor.blue, alpha: 1 };
        if (this.containsSameColor(fullOpacityColor)) {
            return;
        }
        if (this.savedColors.length >= ColorConstants.MAX_SAVED_COLORS) {
            this.savedColors.pop();
        }
        this.savedColors.unshift(fullOpacityColor);
        this.savedColorsSource.next(this.savedColors);
    }

    private containsSameColor(newColor: Rgba): boolean {
        return this.savedColors.some((color) => color.red === newColor.red && color.green === newColor.green && color.blue === newColor.blue);
    }
}
