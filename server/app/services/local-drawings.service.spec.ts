import { TYPES } from '@app/types';
import { ServerDrawing } from '@common/communication/server-drawing';
import { expect } from 'chai';
import 'mocha';
import { testingContainer } from '../../test/test-utils';
import { LocalDrawingsService } from './local-drawings.service';

describe('Local Drawings service', () => {
    let localDrawingsService: LocalDrawingsService;
    let newDrawing1: ServerDrawing;
    let newDrawing2: ServerDrawing;

    beforeEach(async () => {
        const [container] = await testingContainer();
        localDrawingsService = container.get<LocalDrawingsService>(TYPES.LocalDrawingsService);
        newDrawing1 = {
            id: '111',
            image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAADElEQVQImWNgoBMAAABpAAFEI8ARAAAAAElFTkSuQmCC',
        };
        newDrawing2 = {
            id: '222',
            image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAADElEQVQImWNgoBMAAABpAAFEI8ARAAAAAElFTkSuQmCC',
        };
    });

    it('should get all drawings', (done: Mocha.Done) => {
        localDrawingsService.clientDrawings.push(newDrawing1);
        localDrawingsService.clientDrawings.push(newDrawing2);
        const drawings = localDrawingsService.getAllDrawings();
        expect(drawings).to.equals(localDrawingsService.clientDrawings);
        done();
    });

    it('should return drawing with corresponding id', (done: Mocha.Done) => {
        localDrawingsService.clientDrawings.push(newDrawing1);
        localDrawingsService.clientDrawings.push(newDrawing2);
        const wantedId = '222';
        const drawing = localDrawingsService.getDrawing(wantedId);
        expect(drawing).to.equals(newDrawing2);
        done();
    });

    it('should return undefined when id doesnt exist in the server', (done: Mocha.Done) => {
        localDrawingsService.clientDrawings.push(newDrawing1);
        localDrawingsService.clientDrawings.push(newDrawing2);
        const wantedId = '333';
        const drawing = localDrawingsService.getDrawing(wantedId);
        expect(drawing).to.equals(undefined);
        done();
    });

    it('should save new drawing in clientDrawings', (done: Mocha.Done) => {
        localDrawingsService.saveDrawing(newDrawing1);
        expect(localDrawingsService.clientDrawings[0]).to.equals(newDrawing1);
        done();
    });

    it('should save new drawing at the end of the array when not the first', (done: Mocha.Done) => {
        localDrawingsService.clientDrawings.push(newDrawing1);
        localDrawingsService.clientDrawings.push(newDrawing2);
        const newDrawing3 = {
            id: '333',
            image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAADElEQVQImWNgoBMAAABpAAFEI8ARAAAAAElFTkSuQmCC',
        };
        localDrawingsService.saveDrawing(newDrawing3);
        expect(localDrawingsService.clientDrawings[2]).to.equals(newDrawing3);
        done();
    });
});
