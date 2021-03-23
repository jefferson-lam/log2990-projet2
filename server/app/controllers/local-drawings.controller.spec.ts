import { Application } from '@app/app';
import { TYPES } from '@app/types';
import * as HttpRequestCodes from '@common/communication/http-code-constants';
import { Message } from '@common/communication/message';
import { ServerDrawing } from '@common/communication/server-drawing';
import { expect } from 'chai';
import 'express';
import 'mocha';
import * as supertest from 'supertest';
import { testingContainer } from '../../test/test-utils';

describe('LocalDrawingsController', () => {
    let app: Express.Application;
    let drawing: ServerDrawing;
    const successMessage: Message = {
        title: 'Success',
        body: 'This is a success message',
    };

    beforeEach(async () => {
        const [container, sandbox] = await testingContainer();
        container.rebind(TYPES.LocalDrawingsService).toConstantValue({
            saveDrawing: sandbox.stub().resolves(successMessage),
            getAllDrawings: sandbox.stub().resolves(successMessage),
            getDrawing: sandbox.stub().resolves(successMessage),
            deleteDrawing: sandbox.stub().resolves(successMessage),
        });
        app = container.get<Application>(TYPES.Application).app;
        drawing = {
            id: '111',
            image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAADElEQVQImWNgoBMAAABpAAFEI8ARAAAAAElFTkSuQmCC',
        };
    });

    it('should return success message and array of server drawings on get request to /all', async () => {
        return supertest(app)
            .get('/api/drawings/all')
            .expect(HttpRequestCodes.HTTP_STATUS_OK)
            .then((response: any) => {
                expect(response.body).to.deep.equal(successMessage);
            });
    });

    it('should return success message after save drawing in the array on valid post request to /send', async () => {
        return supertest(app)
            .post('/api/drawings/send')
            .send(drawing)
            .set('Accept', 'application/json')
            .expect(HttpRequestCodes.HTTP_STATUS_OK)
            .then((response: any) => {
                expect(response.body).to.deep.equal(successMessage);
            });
    });

    it('should return success message from server on valid get request with specific drawing ID', async () => {
        return supertest(app)
            .get('/api/drawings/get')
            .query({ id: '111' })
            .expect(HttpRequestCodes.HTTP_STATUS_OK)
            .then((response: any) => {
                expect(response.body).to.deep.equal(successMessage);
            });
    });

    it('should return success message after deleting drawing from server on valid get request with specific drawing ID', async () => {
        return supertest(app)
            .delete('/api/drawings/delete')
            .query({ id: '111' })
            .expect(HttpRequestCodes.HTTP_STATUS_OK)
            .then((response: any) => {
                expect(response.body).to.deep.equal(successMessage);
            });
    });
});
