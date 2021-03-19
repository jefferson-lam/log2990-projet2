import { TestBed } from '@angular/core/testing';
import { ResizerHandlerService } from './resizer-handler.service';

describe('ResizerHandlerService', () => {
    let service: ResizerHandlerService;
    const resizers: HTMLElement[] = new Array<HTMLElement>();

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(ResizerHandlerService);
        service.topLeftResizer = document.createElement('div');
        service.topResizer = document.createElement('div');
        service.topRightResizer = document.createElement('div');
        service.rightResizer = document.createElement('div');
        service.bottomRightResizer = document.createElement('div');
        service.bottomResizer = document.createElement('div');
        service.bottomRightResizer = document.createElement('div');
        service.leftResizer = document.createElement('div');
        document.body.append(service.topLeftResizer);
        document.body.append(service.topResizer);
        document.body.append(service.topRightResizer);
        document.body.append(service.rightResizer);
        document.body.append(service.bottomRightResizer);
        document.body.append(service.bottomResizer);
        document.body.append(service.bottomRightResizer);
        document.body.append(service.leftResizer);

        resizers.push(service.topLeftResizer);
        resizers.push(service.topResizer);
        resizers.push(service.topRightResizer);
        resizers.push(service.rightResizer);
        resizers.push(service.bottomRightResizer);
        resizers.push(service.bottomResizer);
        resizers.push(service.bottomLeftResizer);
        resizers.push(service.leftResizer);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('resetResizers should set all resizers top and left to 0px', () => {
        service.resetResizers();
        expect(service.leftResizer.style.top).toEqual('0px');
    });
});
