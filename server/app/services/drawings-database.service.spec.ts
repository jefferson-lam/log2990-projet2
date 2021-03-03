import { DrawingsDatabaseService } from '@app/services/drawings-database.service';
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

    it('saveDrawing should return true on successfull save', async () => {
        const testUri = await mongoServer.getUri();
        databaseService['uri'] = testUri;
        const testTitle = 'testTitle';
        const testTags = ['testing', 'function'];
        const isSaveDrawingSuccess = await databaseService.saveDrawing(testTitle, testTags);
        expect(isSaveDrawingSuccess).to.be.true;
        expect(databaseService['client'].isConnected()).to.be.false;
    });

    it('saveDrawing should return false on unsuccessfull save', async () => {
        const testUri = 'BAD_URL';
        databaseService['uri'] = testUri;
        const testTitle = 'testTitle';
        const testTags = ['testing', 'function'];
        const isSaveDrawingSuccess = await databaseService.saveDrawing(testTitle, testTags);
        expect(isSaveDrawingSuccess).to.be.false;
    });

    it('getDrawing should not return undefined if connection successfull', async () => {
        const testUri = await mongoServer.getUri();
        databaseService['uri'] = testUri;
        const testID = '203f0175c969185bc849ae10';
        const drawing = await databaseService.getDrawing(testID);
        expect(drawing).to.not.be.undefined;
        expect(databaseService['client'].isConnected()).to.be.false;
    });

    it('getDrawing should return undefined if connection unsuccessfull', async () => {
        const testUri = 'BAD_URL';
        databaseService['uri'] = testUri;
        const testID = '203f0175c969185bc849ae10';
        const drawing = await databaseService.getDrawing(testID);
        expect(drawing).to.be.undefined;
    });

    it('getDrawings should not return undefined on successfull connection', async () => {
        const testUri = await mongoServer.getUri();
        databaseService['uri'] = testUri;
        const drawings = await databaseService.getDrawings();
        expect(drawings).not.to.be.undefined;
        expect(databaseService['client'].isConnected()).to.be.false;
    });

    it('getDrawings should return undefined on unsuccessfull connection', async () => {
        const testUri = 'BAD_URL';
        databaseService['uri'] = testUri;
        const drawings = await databaseService.getDrawings();
        expect(drawings).to.be.undefined;
    });

    it('dropDrawing should not return undefined if connection successful', async () => {
        const testUri = await mongoServer.getUri();
        databaseService['uri'] = testUri;
        const testID = '203f0175c969185bc849ae10';
        const drawings = await databaseService.dropDrawing(testID);
        expect(drawings).not.to.be.undefined;
        expect(databaseService['client'].isConnected()).to.be.false;
    });

    it('dropDrawing should return undefined if connection unsuccessful', async () => {
        const testUri = 'BAD_URL';
        databaseService['uri'] = testUri;
        const testID = '203f0175c969185bc849ae10';
        const drawings = await databaseService.dropDrawing(testID);
        expect(drawings).to.be.undefined;
    });
});
