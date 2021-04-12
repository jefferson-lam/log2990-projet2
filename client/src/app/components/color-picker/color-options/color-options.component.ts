import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Rgba } from '@app/classes/rgba';
import * as ColorConstants from '@app/constants/color-constants';
import { ColorService } from '@app/services/color/color.service';

@Component({
    selector: 'app-color-options',
    templateUrl: './color-options.component.html',
    styleUrls: ['./color-options.component.scss'],
})
export class ColorOptionsComponent {
    max: number;
    min: number;
    step: number;
    hue: Rgba;

    @Input() color: Rgba;

    @Output() newColor: EventEmitter<Rgba>;
    @Output() showOptions: EventEmitter<boolean>;

    constructor(public colorService: ColorService) {
        this.max = 1;
        this.min = 0;
        this.step = ColorConstants.STEP;
        this.color = ColorConstants.INITIAL_COLOR;
        this.newColor = new EventEmitter();
        this.showOptions = new EventEmitter();
    }

    confirmColorPick(): void {
        this.newColor.emit(this.color);
        this.showOptions.emit(false);
    }
}
