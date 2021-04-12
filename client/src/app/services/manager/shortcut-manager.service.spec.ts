import { TestBed } from '@angular/core/testing';

import { ShortcutManagerService } from './shortcut-manager.service';

describe('ShortcutManagerService', () => {
    let service: ShortcutManagerService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(ShortcutManagerService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
