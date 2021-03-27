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
    data: string = '';
    url: string = '';
    urlSource: Subject<string> = new BehaviorSubject<string>(this.url);
    urlObservable: Observable<string> = this.urlSource.asObservable();

    exportProgressEnum: typeof ExportDrawingConstants.ExportProgress = ExportDrawingConstants.ExportProgress;
    exportProgress: ExportDrawingConstants.ExportProgress = ExportDrawingConstants.ExportProgress.CHOOSING_SETTING;
    exportProgressSource: Subject<number> = new BehaviorSubject<number>(this.exportProgress);
    exportProgressObservable: Observable<number> = this.exportProgressSource.asObservable();

    constructor() {}

    exportDrawing(imageString: string, name: string): void {
        let img = this.imageStringSplit(imageString);
        console.log(img);
        const headers = new Headers();
        headers.append('Authorization', this.CLIENT_ID);
        const formData = new FormData();
        formData.append('image', img);
        //formData.append('name', name);

        let requestOptions = {
            method: 'POST',
            headers: headers,
            body: formData,
        };

        fetch(this.IMGUR_URL, requestOptions)
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                if (data.status === 200) {
                    console.log('SUCCESS');
                    this.exportProgress = ExportDrawingConstants.ExportProgress.COMPLETE;
                    this.exportProgressSource.next(this.exportProgress);
                    console.log('Succeded with code: ' + this.exportProgress);
                    this.getUrlFromResponse(data);
                } else {
                    console.log('ERROR');
                    this.exportProgress = ExportDrawingConstants.ExportProgress.ERROR;
                    this.exportProgressSource.next(this.exportProgress);
                }
            })
            .catch((error) => {
                this.exportProgress = ExportDrawingConstants.ExportProgress.ERROR;
                this.exportProgressSource.next(this.exportProgress);
            });
        // .catch((error) => {
        //     this.exportProgress = ExportDrawingConstants.ExportProgress.ERROR;
        //     this.exportProgressSource.next();
        //     this.handleError<Message>('exportDrawing');
        // });
    }

    getUrlFromResponse(data: any): void {
        this.url = data.data.link;
        this.urlSource.next(this.url);
    }

    imageStringSplit(img: string): string {
        console.log(img);

        let stringArray = img.split(',');
        return stringArray[1];
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

    // isSuccess(response: string): boolean {
    //     let responseObj = JSON.parse(response);
    //     if (responseObj.data.status === 200) {
    //         this.exportProgress = ExportDrawingConstants.ExportProgress.COMPLETE;
    //         this.exportProgressSource.next();
    //         return true;
    //     } else return false;
    // }
}
