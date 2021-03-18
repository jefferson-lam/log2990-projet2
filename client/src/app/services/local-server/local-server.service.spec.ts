import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ServerDrawing } from '@common/communication/server-drawing';
import { LocalServerService } from './local-server.service';

describe('LocalServerService', () => {
    let service: LocalServerService;
    let httpMock: HttpTestingController;
    let baseUrl: string;
    let drawing: ServerDrawing;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
        });
        service = TestBed.inject(LocalServerService);
        httpMock = TestBed.inject(HttpTestingController);
        // tslint:disable: no-string-literal
        baseUrl = service['DRAWINGS_URL'];
        drawing = {
            id: '123',
            image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAADElEQVQImWNgoBMAAABpAAFEI8ARAAAAAElFTkSuQmCC',
        };
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should not return any drawing when sending a POST request (HttpClient called once)', () => {
        // subscribe to the mocked call
        // tslint:disable-next-line: no-empty
        service.sendDrawing(drawing).subscribe(() => {}, fail);

        const req = httpMock.expectOne(baseUrl + '/send');
        expect(req.request.method).toBe('POST');
        // actually send the request
        req.flush(drawing);
    });

    it('should return expected drawing (HttpClient called once)', () => {
        service.sendDrawing(drawing);
        // TODO: find right syntax to expect drawing to be at first position of response body (array)
        // tslint:disable-next-line: no-empty
        service.getAllDrawings().subscribe(() => {}, fail);

        const req = httpMock.expectOne(baseUrl);
        expect(req.request.method).toBe('GET');
        // actually send the request
        req.flush(drawing);
    });

    it('should handle http error safely', () => {
        service.sendDrawing(drawing).subscribe((response: void) => {
            expect(response).toBeUndefined();
        }, fail);

        const req = httpMock.expectOne(baseUrl + '/send');
        expect(req.request.method).toBe('POST');
        req.error(new ErrorEvent('Random error occured'));
    });
});
