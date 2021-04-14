import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Rgba } from '@app/classes/rgba';
import { ColorService } from '@app/services/color/color.service';

@Component({
    selector: 'app-color-options',
    templateUrl: './color-options.component.html',
    styleUrls: ['./color-options.component.scss'],
})
export class ColorOptionsComponent {
    max: number = 1;
    min: number = 0;
    step: number = 0.1;
    hue: Rgba;

    @Input() color: Rgba = { red: 255, green: 255, blue: 255, alpha: 1 };

    @Output() newColor: EventEmitter<Rgba> = new EventEmitter();
    @Output() showOptions: EventEmitter<boolean> = new EventEmitter();

    constructor(public colorService: ColorService) {}

    confirmColorPick(): void {
        this.newColor.emit(this.color);
        this.showOptions.emit(false);
    }
}
