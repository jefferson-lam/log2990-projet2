import { Injectable } from '@angular/core';
import * as ExportDrawingConstants from '@app/constants/export-drawing-constants';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ImgurService {
    private readonly IMGUR_URL: string = 'https://api.imgur.com/3/image/';
    private readonly CLIENT_ID: string = 'Client-ID 7cb69a96d40be21';

    responseStatus: number = 0;
    data: string;
    shouldOpenPopUp: boolean = false;
    isSendingRequest: boolean = false;
    mutex: number;

    url: string;
    exportProgressEnum: typeof ExportDrawingConstants.ExportProgress = ExportDrawingConstants.ExportProgress;
    exportProgress: ExportDrawingConstants.ExportProgress;
    serviceSettings: [number, string];

    serviceSettingsSource: Subject<[number, string]>;
    serviceSettingsObservable: Observable<[number, string]>;

    constructor() {
        this.url = 'none';
        this.exportProgress = ExportDrawingConstants.ExportProgress.CHOOSING_SETTING;

        this.serviceSettings = [this.exportProgress, this.url];
        this.serviceSettingsSource = new BehaviorSubject<[number, string]>(this.serviceSettings);
        this.serviceSettingsObservable = this.serviceSettingsSource.asObservable();
        this.mutex = 0;
    }

    exportDrawing(imageString: string): void {
        this.isSendingRequest = true;
        const img = this.imageStringSplit(imageString);
        const headers = new Headers();
        headers.append('Authorization', this.CLIENT_ID);
        const formData = new FormData();
        formData.append('image', img);

        const requestOptions = {
            method: 'POST',
            headers,
            body: formData,
        };

        fetch(this.IMGUR_URL, requestOptions)
            .then((response) => response.json())
            .then((data) => {
                this.setDataFromResponse(data);
            });
        this.isSendingRequest = false;
    }

    // tslint:disable-next-line:no-any
    setDataFromResponse(data: any): void {
        if (data.status === ExportDrawingConstants.OK_STATUS) {
            this.mutex++;
            this.setUrlFromResponse(data);
            this.setExportProgress(ExportDrawingConstants.ExportProgress.COMPLETE);
            this.serviceSettingsSource.next(this.serviceSettings);
        } else {
            this.mutex++;
            this.serviceSettings[1] = 'none';
            this.setExportProgress(ExportDrawingConstants.ExportProgress.ERROR);
            this.serviceSettingsSource.next(this.serviceSettings);
        }
    }

    // tslint:disable-next-line:no-any
    setUrlFromResponse(data: any): void {
        this.serviceSettings[1] = data.data.link;
    }

    setExportProgress(progress: number): void {
        this.serviceSettings[0] = progress;
    }

    imageStringSplit(img: string): string {
        const stringArray = img.split(',');
        return stringArray[1];
    }

    resetServiceSettings(): void {
        this.serviceSettings[0] = ExportDrawingConstants.ExportProgress.CHOOSING_SETTING;
        this.serviceSettings[1] = 'none';
        this.serviceSettingsSource.next(this.serviceSettings);
    }
}
