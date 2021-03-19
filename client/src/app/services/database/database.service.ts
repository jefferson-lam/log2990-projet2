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

    getDrawingById(drawingId: string): Observable<Message> {
        const testParams = new HttpParams().set('_id', drawingId);
        return this.http
            .get<Message>(this.BASE_URL + '/getId', { params: testParams })
            .pipe(catchError(this.handleError<Message>('getDrawingById')));
    }

    getDrawingsByTags(tags: string[]): Observable<Message> {
        const testParams = new HttpParams().set('tags', tags.toString());
        return this.http
            .get<Message>(this.BASE_URL + '/getTags', { params: testParams })
            .pipe(catchError(this.handleError<Message>('getDrawingsByTag')));
    }

    saveDrawing(testTitle: string, testTags: string[]): Observable<Message> {
        const postBody = {
            title: testTitle,
            tags: testTags,
        };
        return this.http.post<Message>(this.BASE_URL + '/send', postBody).pipe(catchError(this.handleError<Message>('saveDrawing')));
    }

    dropDrawing(drawingId: string): Observable<Message> {
        const testParams = new HttpParams().set('_id', drawingId);
        return this.http
            .delete<Message>(this.BASE_URL + '/drop', { params: testParams })
            .pipe(catchError(this.handleError<Message>('dropDrawing')));
    }

    private handleError<T>(request: string, result?: T): (error: Error) => Observable<T> {
        return (error: Error): Observable<T> => {
            return of(result as T);
        };
    }
}
