import { Tool } from '@app/classes/tool.ts';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';

class ToolStub extends Tool {
    constructor() {
        super({} as DrawingService);
    }
}

// tslint:disable:no-string-literal
describe('Tool', () => {
    let tool: ToolStub;

    beforeEach(() => {
        tool = new ToolStub();
    });

    it('should be created', () => {
        expect(tool).toBeTruthy();
    });

    it('getPositionFromMouse should return correct x and y offset of mouse', () => {
        const EXPECTED_X_OFFSET = 25;
        const EXPECTED_Y_OFFSET = 32;
        const EXPECTED_MOUSE_POSITION: Vec2 = { x: EXPECTED_X_OFFSET, y: EXPECTED_Y_OFFSET };
        const mouseEvent = {
            offsetX: EXPECTED_X_OFFSET,
            offsetY: EXPECTED_Y_OFFSET,
        } as MouseEvent;
        const mousePosition = tool.getPositionFromMouse(mouseEvent);
        expect(mousePosition).toEqual(EXPECTED_MOUSE_POSITION);
    });
});
