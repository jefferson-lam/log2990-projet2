import { TestBed } from '@angular/core/testing';
import { ImgurServiceService } from './imgur.service';

describe('ImgurServiceService', () => {
    let service: ImgurServiceService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(ImgurServiceService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
