import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ServerDrawing } from '@common/communication/server-drawing';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class LocalServerService {
    private readonly DRAWINGS_URL: string = 'http://localhost:3000/api/drawings';

    constructor(private http: HttpClient) {}

    sendDrawing(drawing: ServerDrawing): Observable<void> {
        return this.http.post<void>(this.DRAWINGS_URL + '/send', drawing).pipe(catchError(this.handleError<void>('sendDrawing')));
    }

    getAllDrawings(): Observable<ServerDrawing[]> {
        return this.http.get<ServerDrawing[]>(this.DRAWINGS_URL + '/all').pipe(catchError(this.handleError<ServerDrawing[]>('getAllDrawings')));
    }

    getDrawingById(drawingId: string): Observable<ServerDrawing> {
        const testParams = new HttpParams().set('id', drawingId);
        return this.http
            .get<ServerDrawing>(this.DRAWINGS_URL + '/get', { params: testParams })
            .pipe(catchError(this.handleError<ServerDrawing>('getDrawingById')));
    }

    deleteDrawing(drawingId: string): Observable<void> {
        const testParams = new HttpParams().set('id', drawingId);
        return this.http
            .delete<void>(this.DRAWINGS_URL + '/delete', { params: testParams })
            .pipe(catchError(this.handleError<void>('deleteDrawing')));
    }

    private handleError<T>(request: string, result?: T): (error: Error) => Observable<T> {
        return (error: Error): Observable<T> => {
            return of(result as T);
        };
    }
}
