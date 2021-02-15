import { TestBed } from '@angular/core/testing';
import { Tool } from '@app/classes/tool.ts';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';

class ToolStub extends Tool {}

// tslint:disable:no-string-literal
describe('Tool', () => {
    let toolStub: ToolStub;

    beforeEach(() => {
        toolStub = new ToolStub({} as DrawingService);
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
            offsetX: EXPECTED_X_OFFSET,
            offsetY: EXPECTED_Y_OFFSET,
        } as MouseEvent;
        expect(toolStub.getPositionFromMouse(mouseEvent)).toEqual(EXPECTED_MOUSE_POSITION);
    });
});
