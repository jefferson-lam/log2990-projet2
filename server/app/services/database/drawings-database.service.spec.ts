import { Drawing } from '@app/classes/drawing';
import { DrawingsDatabaseService } from '@app/services/database/drawings-database.service';
import { TagValidatorService } from '@app/services/database/tag-validator/tag-validator.service';
import { TitleValidatorService } from '@app/services/database/title-validator/title-validator.service';
import { Message } from '@common/communication/message';
import * as DatabaseConstants from '@common/validation/database-constants';
import { expect } from 'chai';
import { MongoClient } from 'mongodb';
import { MongoMemoryServer } from 'mongodb-memory-server';

// These tests were taken from the example given on polymtl's log2990 mongodb example.

// tslint:disable: no-unused-expression
// tslint:disable: no-string-literal
describe('Drawing database service', () => {
    let databaseService: DrawingsDatabaseService;
    let mongoServer: MongoMemoryServer;
    let tagValidator: TagValidatorService;
    let titleValidator: TitleValidatorService;

    beforeEach(async () => {
        tagValidator = new TagValidatorService();
        titleValidator = new TitleValidatorService();
        databaseService = new DrawingsDatabaseService(titleValidator, tagValidator);
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
            })
            .catch((error: unknown) => {});
    });

    it('saveDrawing should handle ascii invalid character title error', async () => {
        const testUri = await mongoServer.getUri();
        databaseService['uri'] = testUri;
        const testTitle = String.fromCharCode(35895);
        const testTags = ['testing', 'function'];
        databaseService
            .saveDrawing(testTitle, testTags)
            .then((result: Message) => {
                expect(result.title).to.equals('Error');
            })
            .catch((error: unknown) => {});
    });

    it('saveDrawing should handle invalid tag max length error', async () => {
        const testUri = await mongoServer.getUri();
        databaseService['uri'] = testUri;
        const testTitle = 'testTitle';
        let testTag = '';
        for (let i = 0; i < DatabaseConstants.MAX_TAG_LENGTH + 1; i++) {
            testTag += 'g';
        }
        const testTags = [testTag];
        databaseService
            .saveDrawing(testTitle, testTags)
            .then((result: Message) => {
                expect(result.title).to.equals('Error');
            })
            .catch((error: unknown) => {});
    });

    it('saveDrawing should handle invalid tags length error', async () => {
        const testUri = await mongoServer.getUri();
        databaseService['uri'] = testUri;
        const testTitle = 'Title';
        const testTags: string[] = [];
        for (let i = 0; i < DatabaseConstants.MAX_TAGS_COUNT + 1; i++) {
            testTags.push('test');
        }
        databaseService
            .saveDrawing(testTitle, testTags)
            .then((result: Message) => {
                expect(result.title).to.equals('Error');
            })
            .catch((error: unknown) => {});
    });

    it('saveDrawing should handle invalid tag min length error', async () => {
        const testUri = await mongoServer.getUri();
        databaseService['uri'] = testUri;
        const testTitle = 'testTitle';
        const testTags = ['', 'function'];
        databaseService
            .saveDrawing(testTitle, testTags)
            .then((result: Message) => {
                expect(result.title).to.equals('Error');
            })
            .catch((error: unknown) => {});
    });

    it('saveDrawing should handle ascii invalid character tag error', async () => {
        const testUri = await mongoServer.getUri();
        databaseService['uri'] = testUri;
        const testTitle = 'testTitle';
        const testTags = [String.fromCharCode(35895), 'function'];
        databaseService
            .saveDrawing(testTitle, testTags)
            .then((result: Message) => {
                expect(result.title).to.equals('Error');
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

    it('getDrawingsByTags should return successfull message on successfull connection', async () => {
        const testUri = await mongoServer.getUri();
        databaseService['uri'] = testUri;

        const client = await MongoClient.connect(testUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        const testTags = ['1', '5'];
        const drawings: Drawing[] = [
            {
                title: 'test1',
                tags: ['1', '2', '3'],
            },
            {
                title: 'test2',
                tags: ['2'],
            },
            {
                title: 'test3',
                tags: ['3'],
            },
            {
                title: 'test4',
                tags: ['4'],
            },
            {
                title: 'test5',
                tags: ['1', '5'],
            },
        ];
        for (const drawing of drawings) {
            await client.db('DrawingsDB').collection('drawings').insertOne(drawing);
        }
        databaseService['client'] = client;
        const result = await databaseService.getDrawingsByTags(testTags);
        expect(result.body).includes('1');
        expect(result.body).includes('5');
        expect(result.title).to.equals('Success');
        expect(databaseService['client'].isConnected()).to.be.false;
    });

    it('getDrawingsByTags should return error message on unsuccessfull connection', (done: Mocha.Done) => {
        const testUri = 'BAD_URL';
        databaseService['uri'] = testUri;
        databaseService
            .getDrawingsByTags([])
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
