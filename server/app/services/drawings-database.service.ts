import { Drawing } from '@app/classes/drawing';
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

    async saveDrawing(drawingTitle: string, drawingTags: string[]): Promise<boolean> {
        try {
            const drawingsCollection = await this.getCollection();

            const drawing: Drawing = {
                title: drawingTitle,
                tags: drawingTags,
            };
            const insertResponse = await drawingsCollection.insertOne(drawing);
            console.log('Inserted new object with id:', insertResponse.insertedId);
            return true;
        } catch (error) {
            console.log(error);
            return false;
        } finally {
            this.closeConnection();
        }
    }

    async getDrawing(id: string): Promise<Drawing | null | undefined> {
        try {
            const drawingsCollection = await this.getCollection();
            const drawingId = new ObjectID(id);
            const drawingToFind = { _id: drawingId };
            const fetchedDrawing = await drawingsCollection.findOne(drawingToFind);
            console.log('Found drawing: ', fetchedDrawing);
            return fetchedDrawing;
        } catch (error) {
            console.log(error);
            return undefined;
        } finally {
            this.closeConnection();
        }
    }

    async getDrawings(): Promise<Drawing[] | undefined> {
        try {
            const drawingsCollection = await this.getCollection();
            const fetchedDrawing = await drawingsCollection.find().toArray();
            console.log('Found drawing: ', fetchedDrawing);
            return fetchedDrawing;
        } catch (error) {
            console.log('Error while finding: ', error);
            return undefined;
        } finally {
            this.closeConnection();
        }
    }

    // function returns undefined if unsuccessfull.
    // If successfull, returns 0 if drawing wasn't found.
    // Returns 1 if drawing was deleted.
    async dropDrawing(id: string): Promise<number | undefined> {
        try {
            const drawingsCollection = await this.getCollection();
            const drawingId = new ObjectID(id);
            const drawingToFind = { _id: drawingId };
            const deletionDetails = await drawingsCollection.deleteOne(drawingToFind);
            console.log('Drawing deletion count:', deletionDetails.result.n);
            return deletionDetails.result.n;
        } catch (error) {
            console.log('Deletion error: ', error);
            return undefined;
        } finally {
            this.closeConnection();
        }
    }

    // Method taken from the example in: TODO ADD SOURCE
    private async start(): Promise<void> {
        try {
            const client = new MongoClient(this.uri, this.options);
            this.client = await client.connect();
        } catch {
            throw new Error('Database connection error');
        }
    }

    private async getCollection(): Promise<Collection<Drawing>> {
        try {
            await this.start();
            console.log(`Fetching collection ${this.collectionName}...`);
            return this.client.db(this.databaseName).collection(this.collectionName);
        } catch (error) {
            console.log(error);
            throw new Error('Database connection error');
        }
    }

    private async closeConnection(): Promise<void> {
        console.log('Closing connection to database...');
        return this.client.close();
    }
}
