import { Injectable } from '@angular/core';
import * as ExportDrawingConstants from '@app/constants/export-drawing-constants';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ImgurService {
    private readonly IMGUR_URL: string = 'https://api.imgur.com/3/image/';
    private readonly CLIENT_ID: string = 'Client-ID 7cb69a96d40be21';

    responseStatus: number;
    data: string;
    shouldOpenPopUp: boolean;
    isSendingRequest: boolean;
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
        this.responseStatus = 0;
        this.shouldOpenPopUp = false;
        this.isSendingRequest = false;
    }

    exportDrawing(imageString: string, name: string): void {
        this.isSendingRequest = true;
        const img = this.imageStringSplit(imageString);
        const headers = new Headers();
        headers.append('Authorization', this.CLIENT_ID);
        const formData = new FormData();
        formData.append('image', img);
        formData.append('name', name);

        const requestOptions = {
            method: 'POST',
            headers,
            body: formData,
        };

        fetch(this.IMGUR_URL, requestOptions)
            .then((response) => response.json())
            .then((data) => {
                this.setDataFromResponse(data.status, data.data.link);
            });
        this.isSendingRequest = false;
    }

    setDataFromResponse(status: number, url: string): void {
        this.mutex++;
        if (status === ExportDrawingConstants.OK_STATUS) {
            this.setUrlFromResponse(url);
            this.setExportProgress(ExportDrawingConstants.ExportProgress.COMPLETE);
        } else {
            this.serviceSettings[1] = 'none';
            this.setExportProgress(ExportDrawingConstants.ExportProgress.ERROR);
        }
        this.serviceSettingsSource.next(this.serviceSettings);
    }

    setUrlFromResponse(url: string): void {
        this.serviceSettings[ExportDrawingConstants.URL] = url;
    }

    setExportProgress(progress: number): void {
        this.serviceSettings[ExportDrawingConstants.EXPORT_PROGRESS] = progress;
    }

    imageStringSplit(img: string): string {
        const stringArray = img.split(',');
        return stringArray[1];
    }

    resetServiceSettings(): void {
        this.serviceSettings[ExportDrawingConstants.EXPORT_PROGRESS] = ExportDrawingConstants.ExportProgress.CHOOSING_SETTING;
        this.serviceSettings[ExportDrawingConstants.URL] = 'none';
        this.serviceSettingsSource.next(this.serviceSettings);
    }
}
