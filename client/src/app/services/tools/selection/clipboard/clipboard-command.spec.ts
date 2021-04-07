import { TestBed } from '@angular/core/testing';
import { DrawingService } from '@app/services/drawing/drawing.service';

describe('ClipboardCommandService', () => {
    // let command: ClipboardCommand;
    let drawServiceSpy: jasmine.SpyObj<DrawingService>;
    // let canvasTestHelper: CanvasTestHelper;
    // let baseCtxStub: CanvasRenderingContext2D;
    // let selectionCtxStub: CanvasRenderingContext2D;

    beforeEach(() => {
        drawServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas']);
        // toolManagerSpy = jasmine.createSpyObj('ToolManagerService', []);

        TestBed.configureTestingModule({
            providers: [{ provide: DrawingService, useValue: drawServiceSpy }],
        });

        // command = new ClipboardCommand();
        // baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        // selectionCtxStub = canvasTestHelper.selectionCanvas.getContext('2d') as CanvasRenderingContext2D;
    });

    it('should be created', () => {});
});
