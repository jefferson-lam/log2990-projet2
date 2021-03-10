import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Message } from '@common/communication/message';
import { DatabaseService } from './database.service';

describe('DatabaseService', () => {
    let httpMock: HttpTestingController;
    let service: DatabaseService;
    let baseUrl: string;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
        });
        service = TestBed.inject(DatabaseService);
        httpMock = TestBed.inject(HttpTestingController);
        // BASE_URL is private so we need to access it with its name as a key
        // Try to avoid this syntax which violates encapsulation
        // tslint:disable: no-string-literal
        baseUrl = service['BASE_URL'];
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('getDrawing should return expected message (HttpClient called once)', () => {
        const expectedMessage: Message = { title: 'testTitle', body: 'testBody' };
        const testId = '6042a2b65ae55f5a1838be54';
        // check the content of the mocked call
        service.getDrawing(testId).subscribe((response: Message) => {
            expect(response.title).toEqual(expectedMessage.title, 'Title check');
            expect(response.body).toEqual(expectedMessage.body, 'body check');
        }, fail);
        const req = httpMock.expectOne(baseUrl + `/get?_id=${testId}`);
        expect(req.request.method).toBe('GET');
        // actually send the request
        req.flush(expectedMessage);
    });

    it('getDrawings should return expected message (HttpClient called once)', () => {
        const expectedMessage: Message = { title: 'testTitle', body: 'testBody' };

        // check the content of the mocked call
        service.getDrawings().subscribe((response: Message) => {
            expect(response.title).toEqual(expectedMessage.title, 'Title check');
            expect(response.body).toEqual(expectedMessage.body, 'body check');
        }, fail);

        const req = httpMock.expectOne(baseUrl);
        expect(req.request.method).toBe('GET');
        // actually send the request
        req.flush(expectedMessage);
    });

    it('dropDrawing should return expected message (HttpClient called once)', () => {
        const expectedMessage: Message = { title: 'testTitle', body: 'testBody' };
        const testId = '6042a2b65ae55f5a1838be54';
        // check the content of the mocked call
        service.dropDrawing(testId).subscribe((response: Message) => {
            expect(response.title).toEqual(expectedMessage.title, 'Title check');
            expect(response.body).toEqual(expectedMessage.body, 'body check');
        }, fail);
        const req = httpMock.expectOne(baseUrl + `/drop?_id=${testId}`);
        expect(req.request.method).toBe('DELETE');
        // actually send the request
        req.flush(expectedMessage);
    });

    it('should return expected message when sending a POST request (HttpClient called once)', () => {
        const expectedMessage: Message = { title: 'Success', body: 'testBody' };
        const testTitle = 'testTitle';
        const testBody = ['test', 'body'];
        // check the content of the mocked call
        service.saveDrawing(testTitle, testBody).subscribe((response: Message) => {
            expect(response.title).toEqual(expectedMessage.title, 'Title check');
            expect(response.body).toEqual(expectedMessage.body, 'body check');
        }, fail);

        const req = httpMock.expectOne(baseUrl + '/send');
        expect(req.request.method).toBe('POST');
        // actually send the request
        req.flush(expectedMessage);
    });

    it('should handle http error safely', () => {
        service.getDrawings().subscribe((response: Message) => {
            expect(response).toBeUndefined();
        }, fail);

        const req = httpMock.expectOne(baseUrl);
        expect(req.request.method).toBe('GET');
        req.error(new ErrorEvent('Random error occured'));
    });
});
