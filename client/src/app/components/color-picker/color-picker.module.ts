import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSliderModule } from '@angular/material/slider';
import { ColorService } from '@app/services/color/color.service';
import { ColorHistoryComponent } from './color-history/color-history.component';
import { ColorOptionsComponent } from './color-options/color-options.component';
import { ColorPaletteComponent } from './color-options/color-palette/color-palette.component';
import { ColorSliderComponent } from './color-options/color-slider/color-slider.component';
import { RgbSelectorComponent } from './color-options/rgb-selector/rgb-selector.component';
import { ColorPickerComponent } from './color-picker.component';

@NgModule({
    imports: [CommonModule, MatSliderModule, FormsModule, MatButtonModule, MatIconModule],
    declarations: [
        ColorPickerComponent,
        ColorSliderComponent,
        ColorPaletteComponent,
        RgbSelectorComponent,
        ColorHistoryComponent,
        ColorOptionsComponent,
    ],
    exports: [ColorPickerComponent],
    providers: [ColorService],
})
export class ColorPickerModule {}
