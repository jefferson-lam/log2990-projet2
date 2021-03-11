import { DrawingsDatabaseService } from '@app/services/drawings-database.service';
import { Message } from '@common/communication/message';
import { expect } from 'chai';
import { MongoMemoryServer } from 'mongodb-memory-server';

// These tests were taken from the example given here: TODO INSERT URL

// tslint:disable: no-unused-expression
// tslint:disable: no-string-literal
describe('Drawing database service', () => {
    let databaseService: DrawingsDatabaseService;
    let mongoServer: MongoMemoryServer;

    beforeEach(async () => {
        databaseService = new DrawingsDatabaseService();
        // Start a local test server
        mongoServer = new MongoMemoryServer();
    });

    it('saveDrawing should return success message on successfull save', async () => {
        const testUri = await mongoServer.getUri();
        databaseService['uri'] = testUri;
        const testTitle = 'testTitle';
        const testTags = ['testing', 'function'];
        const result = await databaseService.saveDrawing(testTitle, testTags);
        expect(result.title).to.equals('Success');
        expect(databaseService['client'].isConnected()).to.be.false;
    });

    it('saveDrawing should handle error on unsuccessfull connection to server', (done: Mocha.Done) => {
        const testUri = 'BAD_URL';
        databaseService['uri'] = testUri;
        const testTitle = 'testTitle';
        const testTags = ['testing', 'function'];
        databaseService
            .saveDrawing(testTitle, testTags)
            .then((result: Message) => {
                expect(result.title).to.equals('Error');
                done();
            })
            .catch((error: unknown) => {
                done(error);
            });
    });

    it('saveDrawing should handle invalid title min length error', async () => {
        const testUri = await mongoServer.getUri();
        databaseService['uri'] = testUri;
        const testTitle = '';
        const testTags = ['testing', 'function'];
        databaseService
            .saveDrawing(testTitle, testTags)
            .then((result: Message) => {
                expect(result.title).to.equals('Error');
            })
            .catch((error: unknown) => {});
    });

    it('saveDrawing should handle invalid title max length error', async () => {
        const testUri = await mongoServer.getUri();
        databaseService['uri'] = testUri;
        const testTitle = '123456789012345678901';
        const testTags = ['testing', 'function'];
        databaseService
            .saveDrawing(testTitle, testTags)
            .then((result: Message) => {
                expect(result.title).to.equals('Error');
                console.log(result.body);
            })
            .catch((error: unknown) => {});
    });

    it('saveDrawing should handle invalid title max length error', async () => {
        const testUri = await mongoServer.getUri();
        databaseService['uri'] = testUri;
        const testTitle = String.fromCharCode(35895);
        const testTags = ['testing', 'function'];
        databaseService
            .saveDrawing(testTitle, testTags)
            .then((result: Message) => {
                expect(result.title).to.equals('Error');
                console.log(result.body);
            })
            .catch((error: unknown) => {});
    });

    it('getDrawing should return success message if connection successfull', async () => {
        const testUri = await mongoServer.getUri();
        databaseService['uri'] = testUri;
        const testID = '203f0175c969185bc849ae10';
        const result = await databaseService.getDrawing(testID);
        expect(result.title).to.equals('Success');
        expect(databaseService['client'].isConnected()).to.be.false;
    });

    it('getDrawing should handle error if connection unsuccessfull', (done: Mocha.Done) => {
        const testUri = 'BAD_URL';
        databaseService['uri'] = testUri;
        const testID = '203f0175c969185bc849ae10';
        databaseService
            .getDrawing(testID)
            .then((result: Message) => {
                expect(result.title).to.equals('Error');
                done();
            })
            .catch((error: unknown) => {
                done(error);
            });
    });

    it('getDrawings should not return undefined on successfull connection', async () => {
        const testUri = await mongoServer.getUri();
        databaseService['uri'] = testUri;
        const result = await databaseService.getDrawings();
        expect(result.title).to.equals('Success');
        expect(databaseService['client'].isConnected()).to.be.false;
    });

    it('getDrawings should return message error on unsuccessfull connection', (done: Mocha.Done) => {
        const testUri = 'BAD_URL';
        databaseService['uri'] = testUri;
        databaseService
            .getDrawings()
            .then((result: Message) => {
                expect(result.title).to.equals('Error');
                done();
            })
            .catch((error: unknown) => {
                done(error);
            });
    });

    it('dropDrawing should return success message if connection successful', async () => {
        const testUri = await mongoServer.getUri();
        databaseService['uri'] = testUri;
        const testID = '203f0175c969185bc849ae10';
        const result = await databaseService.dropDrawing(testID);
        expect(result.title).to.equals('Success');
        expect(databaseService['client'].isConnected()).to.be.false;
    });

    it('dropDrawing should return error message if connection unsuccessful', (done: Mocha.Done) => {
        const testUri = 'BAD_URL';
        databaseService['uri'] = testUri;
        const testID = '203f0175c969185bc849ae10';
        databaseService
            .dropDrawing(testID)
            .then((result: Message) => {
                expect(result.title).to.equals('Error');
                done();
            })
            .catch((error: unknown) => {
                done(error);
            });
    });
});
