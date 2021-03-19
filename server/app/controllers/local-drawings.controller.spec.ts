import { Application } from '@app/app';
import { LocalDrawingsService } from '@app/services/local-drawings.service';
import { TYPES } from '@app/types';
import { ServerDrawing } from '@common/communication/server-drawing';
import { expect } from 'chai';
import 'express';
import 'mocha';
import * as supertest from 'supertest';
import { Stubbed, testingContainer } from '../../test/test-utils';

// tslint:disable:no-any
const HTTP_STATUS_OK = 200;
const HTTP_STATUS_CREATED = 201;

describe('LocalDrawingsController', () => {
    let localDrawingsService: Stubbed<LocalDrawingsService>;
    let app: Express.Application;
    let drawing: ServerDrawing;

    beforeEach(async () => {
        const [container, sandbox] = await testingContainer();
        container.rebind(TYPES.LocalDrawingsService).toConstantValue({
            saveDrawing: sandbox.stub().resolves(),
            getAllDrawings: sandbox.stub().resolves([drawing, drawing]),
            getDrawing: sandbox.stub().resolves(drawing),
        });
        localDrawingsService = container.get(TYPES.LocalDrawingsService);
        app = container.get<Application>(TYPES.Application).app;
        drawing = {
            id: '111',
            image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAADElEQVQImWNgoBMAAABpAAFEI8ARAAAAAElFTkSuQmCC',
        };
    });

    it('should return array of server drawings on get request to /all', async () => {
        localDrawingsService.getAllDrawings.returns([drawing, drawing]);
        return supertest(app)
            .get('/api/drawings/all')
            .expect(HTTP_STATUS_OK)
            .then((response: any) => {
                expect(response.body).to.deep.equal([drawing, drawing]);
            });
    });

    it('should save drawing in the array on valid post request to /send', async () => {
        return supertest(app).post('/api/drawings/send').send(drawing).set('Accept', 'application/json').expect(HTTP_STATUS_CREATED);
    });

    it('should return drawing from server on valid get request with specific drawing ID', async () => {
        localDrawingsService.getDrawing.returns(drawing);
        return supertest(app)
            .get('/api/drawings/get')
            .query({ id: '111' })
            .expect(HTTP_STATUS_OK)
            .then((response: any) => {
                expect(response.body).to.deep.equal(drawing);
            });
    });
});
