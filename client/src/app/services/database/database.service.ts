import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Message } from '@common/communication/message';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class DatabaseService {
    private readonly BASE_URL: string = 'http://localhost:3000/api/database';

    constructor(private http: HttpClient) {}

    getDrawings(): Observable<Message> {
        return this.http.get<Message>(this.BASE_URL).pipe(catchError(this.handleError<Message>('getDrawings')));
    }

    getDrawing(drawingId: string): Observable<Message> {
        let params = new HttpParams().set('_id', drawingId);
        console.log(params);
        return this.http
            .get<Message>(this.BASE_URL + '/get', { params: params })
            .pipe(catchError(this.handleError<Message>('getDrawing')));
    }

    saveDrawing(title: string, tags: string[]): Observable<Message> {
        let postBody = {
            title: title,
            tags: tags,
        };
        return this.http.post<Message>(this.BASE_URL + '/send', postBody).pipe(catchError(this.handleError<Message>('saveDrawing')));
    }

    dropDrawing(drawingId: string): Observable<Message> {
        let params = new HttpParams().set('_id', drawingId);
        console.log(params);
        return this.http
            .delete<Message>(this.BASE_URL + '/drop', { params: params })
            .pipe(catchError(this.handleError<Message>('dropDrawing')));
    }

    private handleError<T>(request: string, result?: T): (error: Error) => Observable<T> {
        return (error: Error): Observable<T> => {
            return of(result as T);
        };
    }
}
