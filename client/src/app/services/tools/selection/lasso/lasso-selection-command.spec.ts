import { TestBed } from '@angular/core/testing';
import { LassoSelectionCommand } from '@app/services/tools/selection/lasso/lasso-selection-command';

describe('LassoSelectionCommand', () => {
    let service: LassoSelectionCommand;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(LassoSelectionCommand);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
