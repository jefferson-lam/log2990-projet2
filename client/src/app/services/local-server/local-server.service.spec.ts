import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Message } from '@common/communication/message';
import { ServerDrawing } from '@common/communication/server-drawing';
import * as ServerConstants from '@common/validation/server-constants';
import { LocalServerService } from './local-server.service';

// tslint:disable: no-empty
// tslint:disable: no-string-literal
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
        service.sendDrawing(drawing).subscribe(() => {}, fail);

        const req = httpMock.expectOne(baseUrl + '/send');
        expect(req.request.method).toBe('POST');
        // actually send the request
        req.flush(drawing);
    });

    it('should return expected drawing (HttpClient called once)', () => {
        service.sendDrawing(drawing);
        service.getAllDrawings().subscribe(() => {}, fail);

        const req = httpMock.expectOne(baseUrl + '/all');
        expect(req.request.method).toBe('GET');
        req.flush(drawing);
    });

    it('should return expected drawing with requested id', () => {
        service.sendDrawing(drawing);
        const id = '123';
        service.getDrawingById(id).subscribe(() => {}, fail);

        const req = httpMock.expectOne(baseUrl + `/get?id=${id}`);
        expect(req.request.method).toBe('GET');
        req.flush(drawing);
    });

    it('dropDrawing should return expected message (HttpClient called once)', () => {
        const testId = 'abc123456789';
        service.deleteDrawing(testId).subscribe(() => {}, fail);
        const req = httpMock.expectOne(baseUrl + `/delete?id=${testId}`);
        expect(req.request.method).toBe('DELETE');
        req.flush(drawing);
    });

    it('should handle http error safely', () => {
        service
            .sendDrawing(drawing)
            .toPromise()
            .then((result: Message) => {
                expect(result.title).toContain(ServerConstants.ERROR_MESSAGE);
            })
            .catch((error) => {});
        const req = httpMock.expectOne(baseUrl + '/send');
        expect(req.request.method).toBe('POST');
        req.error(new ErrorEvent('Random error occured'));
    });
});
