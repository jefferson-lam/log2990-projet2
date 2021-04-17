import { TestBed } from '@angular/core/testing';

import { CursorManagerService } from './cursor-manager.service';

describe('CursorManagerService', () => {
    let service: CursorManagerService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(CursorManagerService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
