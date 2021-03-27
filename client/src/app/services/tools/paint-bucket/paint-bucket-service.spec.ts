import { TestBed } from '@angular/core/testing';
import { PaintBucketService } from './paint-bucket-service';

describe('PaintBucketService', () => {
    let service: PaintBucketService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(PaintBucketService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
