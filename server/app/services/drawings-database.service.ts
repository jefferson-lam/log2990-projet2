import { Drawing } from '@app/classes/drawing';
import { Message } from '@common/communication/message';
import * as DatabaseConstants from '@common/validation/database-constants';
import { injectable } from 'inversify';
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

    async saveDrawing(drawingTitle: string, drawingTags: string[]): Promise<Message> {
        try {
            this.checkTitleValid(drawingTitle);

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

    // Returns message with 'Error' as title if title is invalid with reasons in the body.
    // If title is valid,
    private checkTitleValid(title: string): Message {
        const validation = { title: DatabaseConstants.ERROR_MESSAGE, body: '' };
        const minTitleValidation: Message = this.checkViolationTitleMinLength(title);
        const maxTitleValidation: Message = this.checkViolationTitleMaxLength(title);
        const asciiTitleValidation: Message = this.checkViolationTitleAscii(title);
        let errorCount = 0;
        if (this.isMessageError(minTitleValidation)) {
            validation.body += minTitleValidation.body;
            errorCount++;
        }
        if (this.isMessageError(maxTitleValidation)) {
            validation.body += maxTitleValidation;
            errorCount++;
        }
        if (this.isMessageError(asciiTitleValidation)) {
            validation.body += asciiTitleValidation;
            errorCount++;
        }
        if (errorCount > 0) {
            validation.title = DatabaseConstants.ERROR_MESSAGE;
            throw new Error(validation.body);
        }
        return validation;
    }

    private checkViolationTitleMinLength(title: string): Message {
        const validation: Message = { title: DatabaseConstants.SUCCESS_MESSAGE, body: '' };
        if (title.length < DatabaseConstants.MIN_TITLE_LENGTH) {
            validation.title = DatabaseConstants.ERROR_MESSAGE;
            validation.body = `Title does not respect shortest length constraint. Your title length of ${title.length} is shorter than the minimum length allowed of ${DatabaseConstants.MIN_TITLE_LENGTH}.\n`;
        }
        return validation;
    }

    private checkViolationTitleMaxLength(title: string): Message {
        const validation: Message = { title: DatabaseConstants.SUCCESS_MESSAGE, body: '' };
        if (title.length > DatabaseConstants.MAX_TITLE_LENGTH) {
            validation.title = DatabaseConstants.ERROR_MESSAGE;
            validation.body = `Title does not respect longest length constraint. Your title length of ${title.length} is longer than the maximum length allowed of${DatabaseConstants.MAX_TITLE_LENGTH}.\n`;
        }
        return validation;
    }

    private checkViolationTitleAscii(title: string): Message {
        const validation: Message = { title: DatabaseConstants.SUCCESS_MESSAGE, body: '' };
        if (!/^[\x00-\xFF]*$/.test(title)) {
            validation.title = DatabaseConstants.ERROR_MESSAGE;
            validation.body = 'Title does not respect ascii exclusive requirement. Only ascii characters are allowed.\n';
        }
        return validation;
    }

    private isMessageError(message: Message): boolean {
        return message.title === DatabaseConstants.ERROR_MESSAGE;
    }
}
