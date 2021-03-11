import { HttpClient } from '@angular/common/http';
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
        return this.http.get<ServerDrawing[]>(this.DRAWINGS_URL).pipe(catchError(this.handleError<ServerDrawing[]>('getAllDrawings')));
    }

    private handleError<T>(request: string, result?: T): (error: Error) => Observable<T> {
        return (error: Error): Observable<T> => {
            return of(result as T);
        };
    }

    drawingToImageData(drawing: ServerDrawing): ImageData {
        const typedArray = new Uint8ClampedArray(drawing.pixels);
        const imageData: ImageData = new ImageData(typedArray, drawing.width, drawing.height);
        return imageData;
    }
}
