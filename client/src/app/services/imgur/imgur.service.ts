import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ImgurService {
    private readonly IMGUR_URL: string = 'https://api.imgur.com/3/image/';
    private readonly CLIENT_ID: string = 'Client-ID 7cb69a96d40be21';

    url: string = '';
    urlSource: Subject<string> = new BehaviorSubject<string>(this.url);
    urlObservable: Observable<string> = this.urlSource.asObservable();

    constructor() {}

    sendDrawing(img: HTMLAnchorElement) {
        const headers = { Authorization: this.CLIENT_ID };
        const body = new FormData();
        body.append('image', img.href);
        fetch(this.IMGUR_URL, {
            method: 'post',
            headers: headers,
            body: body,
        })
            .then((data) => data.json())
            .then((data) => {
                this.url = data.data.link;
            });
        //return this.http.post<any>(this.IMGUR_URL, body, { headers });
    }
}
