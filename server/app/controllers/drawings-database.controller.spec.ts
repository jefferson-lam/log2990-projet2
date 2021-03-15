import { Application } from '@app/app';
// import { DrawingsDatabaseService } from '@app/services/drawings-database.service';
import { TYPES } from '@app/types';
import * as HttpRequestCodes from '@common/communication/http-code-constants';
import { Message } from '@common/communication/message';
import { expect } from 'chai';
import * as supertest from 'supertest';
import { testingContainer } from '../../test/test-utils';

// tslint:disable:no-any

describe('DrawingsDatabaseController', () => {
    // let databaseService: Stubbed<DrawingsDatabaseService>;
    let app: Express.Application;

    const successMessage: Message = {
        title: 'Success',
        body: 'This is a success message stub',
    };

    beforeEach(async () => {
        const [container, sandbox] = await testingContainer();
        container.rebind(TYPES.DrawingsDatabaseService).toConstantValue({
            saveDrawing: sandbox.stub().resolves(successMessage),
            getDrawing: sandbox.stub().resolves(successMessage),
            getDrawingsByTags: sandbox.stub().resolves(successMessage),
            getDrawings: sandbox.stub().resolves(successMessage),
            dropDrawing: sandbox.stub().resolves(successMessage),
        });
        app = container.get<Application>(TYPES.Application).app;
    });

    it('should return message from database service on valid get request to root', async () => {
        return supertest(app)
            .get('/api/database')
            .expect(HttpRequestCodes.HTTP_STATUS_OK)
            .then((response: any) => {
                expect(response.body).to.deep.equal(successMessage);
            });
    });

    it('should return message from database service on valid get request with specific drawing ID', async () => {
        const testID = '604055a4efc7ff42043e0a8c';

        return supertest(app)
            .get('/api/database/getID')
            .query({ _id: testID })
            .expect(HttpRequestCodes.HTTP_STATUS_OK)
            .then((response: any) => {
                expect(response.body).to.deep.equal(successMessage);
            });
    });

    it('should return message from database service on valid get request with specific tags', async () => {
        const testTags: string[] = ['1', '2'];

        return supertest(app)
            .get('/api/database/getTags')
            .query({ tags: testTags })
            .expect(HttpRequestCodes.HTTP_STATUS_OK)
            .then((response: any) => {
                expect(response.body).to.deep.equal(successMessage);
            });
    });

    it('should return message from database service on valid post request with specific drawing ID', async () => {
        const testID = '604055a4efc7ff42043e0a8c';
        return supertest(app)
            .post('/api/database/send')
            .send({ _id: testID })
            .expect(HttpRequestCodes.HTTP_STATUS_OK)
            .then((response: any) => {
                expect(response.body).to.deep.equal(successMessage);
            });
    });

    it('should return message from database service on valid delete request with specific drawing ID', async () => {
        const testID = '604055a4efc7ff42043e0a8c';
        return supertest(app)
            .delete('/api/database/drop')
            .query({ _id: testID })
            .expect(HttpRequestCodes.HTTP_STATUS_OK)
            .then((response: any) => {
                expect(response.body).to.deep.equal(successMessage);
            });
    });
});
