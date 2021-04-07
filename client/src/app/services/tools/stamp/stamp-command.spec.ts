import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { StampService } from '@app/services/tools/stamp/stamp-service';
import { StampCommand } from './stamp-command';

describe('StampCommand', () => {
    let command: StampCommand;
    let stampService: StampService;
    let baseCtxStub: CanvasRenderingContext2D;
    let canvasTestHelper: CanvasTestHelper;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        stampService = TestBed.inject(StampService);
        canvasTestHelper = TestBed.inject(CanvasTestHelper);
        baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        command = new StampCommand(baseCtxStub, stampService);
    });

    it('should be created', () => {
        expect(command).toBeTruthy();
    });
});
