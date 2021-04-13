import { Component } from '@angular/core';
import { ImgurService } from '@app/services/imgur/imgur.service';

@Component({
    selector: 'app-export-error-page',
    templateUrl: './export-error-page.component.html',
    styleUrls: ['./export-error-page.component.scss'],
})
export class ExportErrorPageComponent {
    constructor(private imgurService: ImgurService) {}

    resetValues(): void {
        this.imgurService.resetServiceSettings();
    }
}
