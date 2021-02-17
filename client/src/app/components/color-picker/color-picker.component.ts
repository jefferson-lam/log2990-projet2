import { Component, OnInit } from '@angular/core';
import { Rgba } from '@app/classes/rgba';
import * as ColorConstants from '@app/constants/color-constants';
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

    constructor(public colorService: ColorService) {
        const placeholder = { red: '255', green: '255', blue: '255', alpha: 1 };
        for (let i = 0; i < ColorConstants.MAX_SAVED_COLORS; i++) {
            this.savedColors.push(placeholder);
        }
    }

    ngOnInit(): void {
        this.colorService.primaryObservable.subscribe((color: Rgba) => {
            this.primaryColor = color;
        });
        this.colorService.secondaryObservable.subscribe((color: Rgba) => {
            this.secondaryColor = color;
        });
    }

    saveColor(newColor: Rgba): void {
        // set like this to avoid modifying argument by reference
        const fullOpacityColor: Rgba = { red: newColor.red, green: newColor.green, blue: newColor.blue, alpha: 1 };
        if (this.savedColors.length >= ColorConstants.MAX_SAVED_COLORS) {
            this.savedColors.pop();
        }
        this.savedColors.unshift(fullOpacityColor);
        // cloning savedColors everytime we add a value, or else ngOnChanges in color-history component won't fire
        this.savedColors = this.savedColors.slice(0);
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
        this.saveColor(chosenColor);
    }

    switchPrimarySecondary(): void {
        const temp: Rgba = this.primaryColor;
        this.colorService.setPrimaryColor(this.secondaryColor);
        this.colorService.setSecondaryColor(temp);
    }
}
