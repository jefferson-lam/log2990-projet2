import { Drawing } from '@app/classes/drawing';
import { TagValidatorService } from '@app/services/database/tag-validator/tag-validator.service';
import { TitleValidatorService } from '@app/services/database/title-validator/title-validator.service';
import { TYPES } from '@app/types';
import { Message } from '@common/communication/message';
import * as DatabaseConstants from '@common/validation/database-constants';
import { inject, injectable } from 'inversify';
import { Collection, MongoClient, MongoClientOptions, ObjectID } from 'mongodb';
import 'reflect-metadata';

@injectable()
export class DrawingsDatabaseService {
    private databasePassword: string = 'log2990206';
    private databaseName: string = 'DrawingsDB';
    private collectionName: string = 'drawings';
    private uri: string = `mongodb+srv://public:${this.databasePassword}@cluster0.p1joc.mongodb.net/${this.databaseName}?retryWrites=true&w=majority`;
    private options: MongoClientOptions = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    };
    private client: MongoClient;

    constructor(
        @inject(TYPES.TitleValidatorService) private titleValidator: TitleValidatorService,
        @inject(TYPES.TagValidatorService) private tagValidator: TagValidatorService,
    ) {}

    async saveDrawing(drawingTitle: string, drawingTags: string[]): Promise<Message> {
        try {
            this.titleValidator.checkTitleValid(drawingTitle);

            this.tagValidator.checkTagsValid(drawingTags);

            const drawingsCollection = await this.getCollection();

            const drawing: Drawing = {
                title: drawingTitle,
                tags: drawingTags,
            };
            const insertResponse = await drawingsCollection.insertOne(drawing);
            console.log('Inserted new object with id:', insertResponse.insertedId);
            const successMessage: Message = {
                title: DatabaseConstants.SUCCESS_MESSAGE,
                body: `Inserted new drawing with id: ${insertResponse.insertedId}`,
            };
            return successMessage;
        } catch (error) {
            console.error(error);
            return this.generateErrorMessage(error);
        } finally {
            if (this.client !== undefined) {
                this.closeConnection();
            }
        }
    }

    async getDrawing(id: string): Promise<Message> {
        try {
            const drawingsCollection = await this.getCollection();
            const drawingId = new ObjectID(id);
            const drawingToFind = { _id: drawingId };
            console.log('Fetching drawing with id: ', drawingId);
            const fetchedDrawing = await drawingsCollection.findOne(drawingToFind);
            console.log('Found drawing: ', fetchedDrawing);

            const successMessage: Message = {
                title: DatabaseConstants.SUCCESS_MESSAGE,
                body: JSON.stringify(fetchedDrawing),
            };
            return successMessage;
        } catch (error) {
            return this.generateErrorMessage(error);
        } finally {
            if (this.client !== undefined) {
                this.closeConnection();
            }
        }
    }

    async getDrawingsByTags(tags: string[]): Promise<Message> {
        try {
            const drawingsCollection = await this.getCollection();
            const collectionDrawings: Drawing[] = await drawingsCollection.find().toArray();
            let drawingsWithTags: Drawing[] = new Array();
            for (let drawing of collectionDrawings) {
                let hasAllTags = true;
                for (let tag of tags) {
                    if (!drawing.tags.includes(tag)) {
                        hasAllTags = false;
                        break;
                    }
                }
                if (hasAllTags) {
                    drawingsWithTags.push(drawing);
                }
            }
            const successMessage: Message = {
                title: DatabaseConstants.SUCCESS_MESSAGE,
                body: JSON.stringify(drawingsWithTags),
            };
            console.log(successMessage);
            return successMessage;
        } catch (error) {
            console.error('Error while getting drawings: ', error);
            return this.generateErrorMessage(error);
        } finally {
            if (this.client !== undefined) {
                this.closeConnection();
            }
        }
    }

    async getDrawings(): Promise<Message> {
        try {
            const drawingsCollection = await this.getCollection();
            const fetchedDrawings = await drawingsCollection.find().toArray();
            console.log('Found drawing: ', fetchedDrawings);
            const successMessage: Message = {
                title: DatabaseConstants.SUCCESS_MESSAGE,
                body: JSON.stringify(fetchedDrawings),
            };
            return successMessage;
        } catch (error) {
            console.error('Error while getting drawings: ', error);
            return this.generateErrorMessage(error);
        } finally {
            if (this.client !== undefined) {
                this.closeConnection();
            }
        }
    }

    // function returns undefined if unsuccessfull.
    // If successfull, returns 0 if drawing wasn't found.
    // Returns 1 if drawing was deleted.
    async dropDrawing(id: string): Promise<Message> {
        try {
            const drawingsCollection = await this.getCollection();
            const drawingId = new ObjectID(id);
            const drawingToFind = { _id: drawingId };
            const deletionDetails = await drawingsCollection.deleteOne(drawingToFind);
            console.log('Drawing deletion count:', deletionDetails.result.n);
            const successMessage: Message = {
                title: DatabaseConstants.SUCCESS_MESSAGE,
                body: `Deleted drawing count: ${JSON.stringify(deletionDetails.result.n)}`,
            };
            return successMessage;
        } catch (error) {
            console.log('Deletion error: ', error);
            return this.generateErrorMessage(error);
        } finally {
            if (this.client !== undefined) {
                this.closeConnection();
            }
        }
    }

    // Method heavily inspired from the example in mongodb example from https://moodle.polymtl.ca
    private async start(): Promise<void> {
        try {
            const client = new MongoClient(this.uri, this.options);
            this.client = await client.connect();
        } catch (error) {
            throw new Error('Database connection error: ' + error).message;
        }
    }

    private async getCollection(): Promise<Collection<Drawing>> {
        try {
            await this.start();
            console.log(`Fetching collection ${this.collectionName}...`);
            return this.client.db(this.databaseName).collection(this.collectionName);
        } catch (error) {
            console.error(error);
            throw new Error('Collection fetching error: ' + error).message;
        }
    }

    private async closeConnection(): Promise<void> {
        console.log('Closing connection to database...');
        return this.client.close();
    }

    private generateErrorMessage(error: Error): Message {
        return {
            title: DatabaseConstants.ERROR_MESSAGE,
            body: error.toString(),
        };
    }
}
