import { Component, OnInit } from '@angular/core';
import { Rgba } from '@app/classes/rgba';
import { ColorService } from '@app/services/color/color.service';

@Component({
    selector: 'app-color-picker',
    templateUrl: './color-picker.component.html',
    styleUrls: ['./color-picker.component.scss'],
})
export class ColorPickerComponent implements OnInit {
    // Code provided by Lukas Marx (https://malcoded.com/posts/angular-color-picker/)
    primaryColor: Rgba;
    secondaryColor: Rgba;
    savedColors: Rgba[] = new Array();
    showPrimaryOptions: boolean = false;
    showSecondaryOptions: boolean = false;

    constructor(public colorService: ColorService) {}

    ngOnInit(): void {
        this.colorService.primaryObservable.subscribe((color: Rgba) => {
            this.primaryColor = color;
        });
        this.colorService.secondaryObservable.subscribe((color: Rgba) => {
            this.secondaryColor = color;
        });
        this.colorService.savedColorsObservable.subscribe((colors: Rgba[]) => {
            this.savedColors = colors;
        });
    }

    // makes sure only one showX can be true
    togglePrimaryPickerOpen(): void {
        this.showPrimaryOptions = !this.showPrimaryOptions;
        if (this.showSecondaryOptions) this.showSecondaryOptions = false;
    }

    toggleSecondaryPickerOpen(): void {
        this.showSecondaryOptions = !this.showSecondaryOptions;
        if (this.showPrimaryOptions) this.showPrimaryOptions = false;
    }

    // This function can only be accessed when either of the showX are true
    confirmColorPick(chosenColor: Rgba): void {
        this.showPrimaryOptions ? this.colorService.setPrimaryColor(chosenColor) : this.colorService.setSecondaryColor(chosenColor);
        this.colorService.saveColor(chosenColor);
    }

    switchPrimarySecondary(): void {
        const temp: Rgba = this.primaryColor;
        this.colorService.setPrimaryColor(this.secondaryColor);
        this.colorService.setSecondaryColor(temp);
    }
}
