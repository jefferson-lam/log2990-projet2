import { TestBed } from '@angular/core/testing';
import { Tool } from '@app/classes/tool.ts';
import { Vec2 } from '@app/classes/vec2';
import * as CanvasConstants from '@app/constants/canvas-constants';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';

class ToolStub extends Tool {}

// tslint:disable:no-string-literal
describe('Tool', () => {
    let toolStub: ToolStub;

    beforeEach(() => {
        toolStub = new ToolStub({} as DrawingService, {} as UndoRedoService);
        TestBed.configureTestingModule({
            providers: [{ provide: Tool, useValue: toolStub }],
        }).compileComponents();
    });

    it('should be created', () => {
        expect(toolStub).toBeTruthy();
    });

    it('getPositionFromMouse should return correct x and y offset of mouse', () => {
        const EXPECTED_X_OFFSET = 25;
        const EXPECTED_Y_OFFSET = 32;
        const EXPECTED_MOUSE_POSITION: Vec2 = { x: EXPECTED_X_OFFSET, y: EXPECTED_Y_OFFSET };
        const mouseEvent = {
            x: EXPECTED_X_OFFSET + CanvasConstants.LEFT_MARGIN,
            y: EXPECTED_Y_OFFSET,
        } as MouseEvent;
        expect(toolStub.getPositionFromMouse(mouseEvent)).toEqual(EXPECTED_MOUSE_POSITION);
    });
});
