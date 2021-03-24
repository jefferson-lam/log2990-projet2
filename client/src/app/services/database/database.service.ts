import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Message } from '@common/communication/message';
import * as DatabaseConstants from '@common/validation/database-constants';
import { Observable, throwError } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class DatabaseService {
    private readonly BASE_URL: string = 'http://localhost:3000/api/database';

    constructor(private http: HttpClient) {}

    getDrawings(): Observable<Message> {
        return this.http
            .get<Message>(this.BASE_URL)
            .pipe(timeout(DatabaseConstants.TIMEOUT_MAX_TIME), catchError(this.handleError<Message>('getDrawings')));
    }

    getDrawingById(drawingId: string): Observable<Message> {
        const testParams = new HttpParams().set('_id', drawingId);
        return this.http
            .get<Message>(this.BASE_URL + '/getId', { params: testParams })
            .pipe(timeout(DatabaseConstants.TIMEOUT_MAX_TIME), catchError(this.handleError<Message>('getDrawingById')));
    }

    getDrawingsByTags(tags: string[]): Observable<Message> {
        const testParams = new HttpParams().set('tags', tags.toString());
        return this.http
            .get<Message>(this.BASE_URL + '/getTags', { params: testParams })
            .pipe(timeout(DatabaseConstants.TIMEOUT_MAX_TIME), catchError(this.handleError<Message>('getDrawingsByTag')));
    }

    saveDrawing(testTitle: string, testTags: string[]): Observable<Message> {
        const postBody = {
            title: testTitle,
            tags: testTags,
        };
        return this.http
            .post<Message>(this.BASE_URL + '/send', postBody)
            .pipe(timeout(DatabaseConstants.TIMEOUT_MAX_TIME), catchError(this.handleError<Message>('saveDrawing')));
    }

    dropDrawing(drawingId: string): Observable<Message> {
        const testParams = new HttpParams().set('_id', drawingId);
        return this.http
            .delete<Message>(this.BASE_URL + '/drop', { params: testParams })
            .pipe(timeout(DatabaseConstants.TIMEOUT_MAX_TIME), catchError(this.handleError<Message>('dropDrawing')));
    }

    private handleError<T>(request: string, result?: T): (error: Error) => Observable<T> {
        return (error: Error): Observable<T> => {
            const errorMessage: Message = {
                title: DatabaseConstants.ERROR_MESSAGE,
                body: error.message,
            };
            return throwError(errorMessage);
        };
    }
}
