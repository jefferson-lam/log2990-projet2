import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Message } from '@common/communication/message';
import { ServerDrawing } from '@common/communication/server-drawing';
import * as ServerConstants from '@common/validation/server-constants';
import { Observable, throwError } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class LocalServerService {
    private readonly DRAWINGS_URL: string = 'http://localhost:3000/api/drawings';

    constructor(private http: HttpClient) {}

    sendDrawing(drawing: ServerDrawing): Observable<Message> {
        return this.http
            .post<Message>(this.DRAWINGS_URL + '/send', drawing)
            .pipe(timeout(ServerConstants.TIMEOUT_MAX_TIME), catchError(this.handleError<Message>('sendDrawing')));
    }

    getAllDrawings(): Observable<Message> {
        return this.http
            .get<Message>(this.DRAWINGS_URL + '/all')
            .pipe(timeout(ServerConstants.TIMEOUT_MAX_TIME), catchError(this.handleError<Message>('getAllDrawings')));
    }

    getDrawingById(drawingId: string): Observable<Message> {
        const testParams = new HttpParams().set('id', drawingId);
        return this.http
            .get<Message>(this.DRAWINGS_URL + '/get', { params: testParams })
            .pipe(timeout(ServerConstants.TIMEOUT_MAX_TIME), catchError(this.handleError<Message>('getDrawingById')));
    }

    deleteDrawing(drawingId: string): Observable<Message> {
        const testParams = new HttpParams().set('id', drawingId);
        return this.http
            .delete<Message>(this.DRAWINGS_URL + '/delete', { params: testParams })
            .pipe(timeout(ServerConstants.TIMEOUT_MAX_TIME), catchError(this.handleError<Message>('deleteDrawing')));
    }

    private handleError<T>(request: string, result?: T): (error: Error) => Observable<T> {
        return (error: Error): Observable<T> => {
            const errorMessage: Message = {
                title: ServerConstants.ERROR_MESSAGE,
                body: error.message,
            };
            return throwError(errorMessage);
        };
    }
}
