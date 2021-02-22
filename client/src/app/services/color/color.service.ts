import { Injectable } from '@angular/core';
import { Rgba } from '@app/classes/rgba';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ColorService {
    primaryColor: Rgba = { red: '255', green: '255', blue: '255', alpha: 1 };
    primaryColorSource: Subject<Rgba> = new BehaviorSubject<Rgba>(this.primaryColor);
    primaryObservable: Observable<Rgba> = this.primaryColorSource.asObservable();
    secondaryColor: Rgba = { red: '0', green: '0', blue: '0', alpha: 1 };
    secondaryColorSource: Subject<Rgba> = new BehaviorSubject<Rgba>(this.secondaryColor);
    secondaryObservable: Observable<Rgba> = this.secondaryColorSource.asObservable();

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

    // new color opacity is set to 1 to facilitate communication between components
    getColorAtPosition(ctx: CanvasRenderingContext2D, x: number, y: number, opacity: number): Rgba {
        const imageData = ctx.getImageData(x, y, 1, 1).data;
        const colorAtPosition: Rgba = { red: imageData[0].toString(), green: imageData[1].toString(), blue: imageData[2].toString(), alpha: opacity };
        return colorAtPosition;
    }
}
