import { TestBed } from '@angular/core/testing';
import { PaintBucketCommand } from './paint-bucket-command';

describe('PaintBucketCommandService', () => {
    let service: PaintBucketCommand;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(PaintBucketCommand);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
