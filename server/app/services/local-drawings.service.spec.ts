import { TYPES } from '@app/types';
import { ServerDrawing } from '@common/communication/server-drawing';
import * as ServerConstants from '@common/validation/server-constants';
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
        localDrawingsService.clientDrawings.push(newDrawing1);
        localDrawingsService.clientDrawings.push(newDrawing2);
    });

    it('getAllDrawings should get all drawings and return success message', (done: Mocha.Done) => {
        localDrawingsService.getAllDrawings().then((message) => {
            expect(message.title).to.equals(ServerConstants.SUCCESS_MESSAGE);
            expect(message.body).to.equal(JSON.stringify(localDrawingsService.clientDrawings));
            done();
        });
    });

    it('getDrawing should return success message if retrieved drawing with corresponding id', (done: Mocha.Done) => {
        const wantedId = '222';
        localDrawingsService.getDrawing(wantedId).then((message) => {
            expect(message.title).to.equals(ServerConstants.SUCCESS_MESSAGE);
            expect(message.body).to.equal(JSON.stringify(newDrawing2));
            done();
        });
    });

    it('getDrawing should return error message when id doesnt exist in the server', (done: Mocha.Done) => {
        const wantedId = '333';
        localDrawingsService
            .getDrawing(wantedId)
            .then((message) => {
                expect(message.title).to.equals(ServerConstants.ERROR_MESSAGE);
                done();
            })
            .catch((error) => {
                done(error);
            });
    });

    it('saveDrawing should save new drawing in clientDrawings and return success message', (done: Mocha.Done) => {
        localDrawingsService.clientDrawings.splice(0);
        localDrawingsService.saveDrawing(newDrawing1).then((message) => {
            expect(message.title).to.equals(ServerConstants.SUCCESS_MESSAGE);
            expect(localDrawingsService.clientDrawings[0]).to.equals(newDrawing1);
            done();
        });
    });

    it('saveDrawing should fail if drawing id already exists', (done: Mocha.Done) => {
        localDrawingsService
            .saveDrawing(newDrawing1)
            .then((message) => {
                expect(message.title).to.equals('Error during local save');
                done();
            })
            .catch((error) => {
                done(error);
            });
    });

    it('deleteDrawing should return success message if deleted drawing with corresponding id', (done: Mocha.Done) => {
        const idToDelete = '222';
        localDrawingsService.deleteDrawing(idToDelete).then((message) => {
            expect(message.title).to.equals(ServerConstants.SUCCESS_MESSAGE);
            done();
        });
    });

    it('deleteDrawing should return error message if requested id doesnt exist ', (done: Mocha.Done) => {
        const idToDelete = '223332';
        localDrawingsService
            .deleteDrawing(idToDelete)
            .then((message) => {
                expect(message.title).to.equals(ServerConstants.ERROR_MESSAGE);
                done();
            })
            .catch((error) => {
                done(error);
            });
    });
});
