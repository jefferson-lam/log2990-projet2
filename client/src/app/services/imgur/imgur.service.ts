import { Injectable } from '@angular/core';
import * as ExportDrawingConstants from '@app/constants/export-drawing-constants';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ImgurService {
    private readonly IMGUR_URL: string;
    private readonly CLIENT_ID: string;

    responseStatus: number;
    data: string;
    shouldOpenPopUp: boolean;
    isSendingRequest: boolean;
    mutex: number;

    url: string;
    exportProgress: ExportDrawingConstants.ExportProgress;
    serviceSettings: [number, string];

    private serviceSettingsSource: Subject<[number, string]>;
    serviceSettingsObservable: Observable<[number, string]>;

    constructor() {
        this.IMGUR_URL = 'https://api.imgur.com/3/image/';
        this.CLIENT_ID = 'Client-ID 7cb69a96d40be21';

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
        const headers = this.createHeaders();
        const formData = this.createBody(img, name);

        const requestOptions = this.createRequestOptions(headers, formData);

        fetch(this.IMGUR_URL, requestOptions)
            .then((response) => response.json())
            .then((data) => {
                this.setDataFromResponse(data.status, data.data.link);
            });
        this.isSendingRequest = false;
    }

    private createHeaders(): Headers {
        const headers = new Headers();
        headers.append('Authorization', this.CLIENT_ID);
        return headers;
    }

    private createBody(img: string, name: string): FormData {
        const formData = new FormData();
        formData.append('image', img);
        formData.append('name', name);
        return formData;
    }

    private createRequestOptions(headers: Headers, formData: FormData): ExportDrawingConstants.PostRequest {
        const requestOptions = {
            method: 'POST',
            headers,
            body: formData,
        };
        return requestOptions;
    }

    private setDataFromResponse(status: number, url: string): void {
        this.mutex++;
        if (status === ExportDrawingConstants.OK_STATUS) {
            this.setUrlFromResponse(url);
            this.setExportProgress(ExportDrawingConstants.ExportProgress.COMPLETE);
        } else {
            this.setUrlFromResponse('none');
            this.setExportProgress(ExportDrawingConstants.ExportProgress.ERROR);
        }
        this.serviceSettingsSource.next(this.serviceSettings);
    }

    private setUrlFromResponse(url: string): void {
        this.serviceSettings[ExportDrawingConstants.URL] = url;
    }

    private setExportProgress(progress: number): void {
        this.serviceSettings[ExportDrawingConstants.EXPORT_PROGRESS] = progress;
    }

    private imageStringSplit(img: string): string {
        const stringArray = img.split(',');
        return stringArray[1];
    }

    resetServiceSettings(): void {
        this.serviceSettings[ExportDrawingConstants.EXPORT_PROGRESS] = ExportDrawingConstants.ExportProgress.CHOOSING_SETTING;
        this.serviceSettings[ExportDrawingConstants.URL] = 'none';
        this.serviceSettingsSource.next(this.serviceSettings);
    }
}
