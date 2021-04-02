import { TestBed } from '@angular/core/testing';
import { Vec2 } from '@app/classes/vec2';
import { BUTTON_OFFSET } from '@app/constants/selection-constants';
import { ResizerHandlerService } from './resizer-handler.service';

describe('ResizerHandlerService', () => {
    let service: ResizerHandlerService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(ResizerHandlerService);
        service.topLeftResizer = document.createElement('div');
        service.topResizer = document.createElement('div');
        service.topRightResizer = document.createElement('div');
        service.rightResizer = document.createElement('div');
        service.bottomLeftResizer = document.createElement('div');
        service.bottomResizer = document.createElement('div');
        service.bottomRightResizer = document.createElement('div');
        service.leftResizer = document.createElement('div');
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('resetResizers should set all resizers top and left to 0px', () => {
        service.resetResizers();
        const resizers = service.getAllResizers();
        resizers.forEach((resizer) => {
            expect(resizer.style.top).toEqual('0px');
            expect(resizer.style.left).toEqual('0px');
            expect(resizer.style.visibility).toEqual('hidden');
        });
    });

    it('setResizerPosition should correct set all resizers to new canvas position', () => {
        const canvasPosition: Vec2 = {
            x: 750,
            y: 750,
        };
        const canvasWidth = 450;
        const canvasHeight = 750;

        const xOrigin = '750px';
        const yOrigin = '750px';
        const expectedVisibility = 'visible';

        const xMean = canvasPosition.x + canvasWidth / 2 - BUTTON_OFFSET / 2 + 'px';
        const xMax = canvasPosition.x + canvasWidth - BUTTON_OFFSET + 'px';
        const yMax = canvasPosition.y + canvasHeight - BUTTON_OFFSET + 'px';
        const yMean = canvasPosition.y + canvasHeight / 2 - BUTTON_OFFSET / 2 + 'px';

        service.setResizerPosition(canvasPosition, canvasWidth, canvasHeight);
        expect(service.topLeftResizer.style.left).toEqual(xOrigin);
        expect(service.topLeftResizer.style.top).toEqual(yOrigin);
        expect(service.topLeftResizer.style.visibility).toEqual(expectedVisibility);

        expect(service.topResizer.style.left).toEqual(xMean);
        expect(service.topResizer.style.top).toEqual(yOrigin);
        expect(service.topResizer.style.visibility).toEqual(expectedVisibility);

        expect(service.topRightResizer.style.left).toEqual(xMax);
        expect(service.topRightResizer.style.top).toEqual(yOrigin);
        expect(service.topRightResizer.style.visibility).toEqual(expectedVisibility);

        expect(service.rightResizer.style.left).toEqual(xMax);
        expect(service.rightResizer.style.top).toEqual(yMean);
        expect(service.rightResizer.style.visibility).toEqual(expectedVisibility);

        expect(service.bottomRightResizer.style.left).toEqual(xMax);
        expect(service.bottomRightResizer.style.top).toEqual(yMax);
        expect(service.bottomRightResizer.style.visibility).toEqual(expectedVisibility);

        expect(service.bottomResizer.style.left).toEqual(xMean);
        expect(service.bottomResizer.style.top).toEqual(yMax);
        expect(service.bottomResizer.style.visibility).toEqual(expectedVisibility);

        expect(service.bottomLeftResizer.style.left).toEqual(xOrigin);
        expect(service.bottomLeftResizer.style.top).toEqual(yMax);
        expect(service.bottomLeftResizer.style.visibility).toEqual(expectedVisibility);

        expect(service.leftResizer.style.left).toEqual(xOrigin);
        expect(service.leftResizer.style.top).toEqual(yMean);
        expect(service.leftResizer.style.visibility).toEqual(expectedVisibility);
    });

    it('getAllResizers should return all resizers', () => {
        const result = service.getAllResizers();
        expect(result).toEqual([
            service.topLeftResizer,
            service.topResizer,
            service.topRightResizer,
            service.rightResizer,
            service.bottomRightResizer,
            service.bottomResizer,
            service.bottomLeftResizer,
            service.leftResizer,
        ]);
    });
});
