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
    response: string = '';
    url: string = '';
    urlSource: Subject<string> = new BehaviorSubject<string>(this.url);
    urlObservable: Observable<string> = this.urlSource.asObservable();

    exportProgressEnum: typeof ExportDrawingConstants.ExportProgress = ExportDrawingConstants.ExportProgress;
    exportProgress: ExportDrawingConstants.ExportProgress = ExportDrawingConstants.ExportProgress.CHOOSING_SETTING;
    exportProgressSource: Subject<number> = new BehaviorSubject<number>(this.exportProgress);
    exportProgressObservable: Observable<number> = this.exportProgressSource.asObservable();

    constructor() {}

    exportDrawing(img: string): void {
        const headers = new Headers();
        headers.append('Authorization', this.CLIENT_ID);
        const formData = new FormData();
        formData.append('image', img);

        let requestOptions = {
            method: 'POST',
            headers: headers,
            body: formData,
        };

        fetch(this.IMGUR_URL, requestOptions)
            .then((response) => response.text())
            .then((response) => {
                // if (this.isSuccess(response)) {
                this.response = response;
                console.log(response);
                this.getUrlFromResponse(response);
                // }
            });
        // .catch((error) => {
        //     this.exportProgress = ExportDrawingConstants.ExportProgress.ERROR;
        //     this.exportProgressSource.next();
        //     this.handleError<Message>('exportDrawing');
        // });
    }

    // private handleError<T>(request: string, result?: T): (error: Error) => Observable<T> {
    //     return (error: Error): Observable<T> => {
    //         const errorMessage: Message = {
    //             title: DatabaseConstants.ERROR_MESSAGE,
    //             body: error.message,
    //         };
    //         return throwError(errorMessage);
    //     };
    // }

    getUrlFromResponse(response: string): void {
        let responseObj = JSON.parse(response);
        this.url = responseObj.data.link;
        console.log(this.url);
        this.urlSource.next(this.url);
    }

    // isSuccess(response: string): boolean {
    //     let responseObj = JSON.parse(response);
    //     if (responseObj.data.status === 200) {
    //         this.exportProgress = ExportDrawingConstants.ExportProgress.COMPLETE;
    //         this.exportProgressSource.next();
    //         return true;
    //     } else return false;
    // }
}
