import { Component, OnInit } from '@angular/core';
import * as ExportDrawingConstants from '@app/constants/export-drawing-constants';
import { ImgurService } from '@app/services/imgur/imgur.service';

@Component({
    selector: 'app-export-popup-page',
    templateUrl: './export-popup-page.component.html',
    styleUrls: ['./export-popup-page.component.scss'],
})
export class ExportPopupPageComponent implements OnInit {
    imgurService: ImgurService;
    url: string;
    resultMessage: string = '';

    PopUpToggleEnum: typeof ExportDrawingConstants.PopUpToggle = ExportDrawingConstants.PopUpToggle;
    popUpToggle: ExportDrawingConstants.PopUpToggle = ExportDrawingConstants.PopUpToggle.NONE;

    constructor(imgurService: ImgurService) {
        this.imgurService = imgurService;
    }

    ngOnInit(): void {
        this.imgurService.urlObservable.subscribe((url: string) => {
            this.url = url;
        });
        this.imgurService.exportProgressObservable.subscribe((exportProgress: number) => {
            this.popUpToggle = exportProgress;
            console.log('Code: ' + this.popUpToggle);
        });
    }
}
