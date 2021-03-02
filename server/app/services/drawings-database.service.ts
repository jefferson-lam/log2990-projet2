import { Drawing } from '@app/classes/drawing';
import { injectable } from 'inversify';
import { Collection, MongoClient, ObjectID } from 'mongodb';
import 'reflect-metadata';

@injectable()
export class DrawingsDatabaseService {
    private databasePassword: string = 'log2990206';
    private databaseName: string = 'DrawingsDB';
    private uri: string = `mongodb+srv://public:${this.databasePassword}@cluster0.p1joc.mongodb.net/${this.databaseName}?retryWrites=true&w=majority`;
    private client: MongoClient = new MongoClient(this.uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    async saveDrawing(drawingTitle: string, drawingTags: string[]): Promise<boolean> {
        const drawingsCollection = await this.getCollection();
        if (drawingsCollection === undefined) {
            return false;
        }

        const drawing: Drawing = {
            title: drawingTitle,
            tags: drawingTags,
        };
        const isInserted = await drawingsCollection
            .insertOne(drawing)
            .then((res) => {
                console.log('Inserted new object with id:', res.insertedId);
                return true;
            })
            .catch((err) => {
                console.log('Saving error: ', err);
                return false;
            })
            .finally(() => {
                console.log('Closing connection to database...');
                this.client.close();
            });
        return isInserted;
    }

    async getDrawing(id: string): Promise<Drawing | undefined> {
        const drawingsCollection = await this.getCollection();
        if (drawingsCollection === undefined) {
            return undefined;
        }
        const drawingId = new ObjectID(id);
        const drawingToFind = { _id: drawingId };
        const fetchedDrawing = await drawingsCollection
            .findOne(drawingToFind)
            .then((databaseDrawing: Drawing) => {
                console.log('Found drawing: ', databaseDrawing);
                return databaseDrawing;
            })
            .catch((error) => {
                console.log('Error while finding: ', error);
                return undefined;
            })
            .finally(() => {
                this.client.close();
            });
        return fetchedDrawing;
    }

    async getDrawings(): Promise<Drawing[] | undefined> {
        const drawingsCollection = await this.getCollection();
        if (drawingsCollection === undefined) {
            return undefined;
        }
        const fetchedDrawing = await drawingsCollection
            .find()
            .toArray()
            .then((databaseDrawings: Drawing[]) => {
                console.log('Found drawing: ', databaseDrawings);
                return databaseDrawings;
            })
            .catch((error) => {
                console.log('Error while finding: ', error);
                return undefined;
            })
            .finally(() => {
                this.client.close();
            });
        return fetchedDrawing;
    }

    // function returns undefined if unsuccessfull.
    // If successfull, returns 0 if drawing wasn't found.
    // Returns 1 if drawing was deleted.
    async dropDrawing(id: string): Promise<number | undefined> {
        const drawingsCollection = await this.getCollection();
        if (drawingsCollection === undefined) {
            return undefined;
        }
        const drawingId = new ObjectID(id);
        const drawingToFind = { _id: drawingId };
        const deleteCount = await drawingsCollection
            .deleteOne(drawingToFind)
            .then((deletion) => {
                console.log('Deleted', deletion.result.n, 'drawings');
                return deletion.result.n;
            })
            .catch((error) => {
                console.log('Deletion error: ', error);
                return undefined;
            })
            .finally(() => {
                console.log('Closing connection to database...');
                this.client.close();
            });
        return deleteCount;
    }

    private async getCollection(): Promise<Collection<Drawing> | undefined> {
        return await this.client
            .connect()
            .then(() => {
                console.log('Connecting to database...');
                return this.client.db('DrawingsDB').collection('drawings');
            })
            .catch((err) => {
                console.log('Error while connecting to database...');
                console.log(err);
                return undefined;
            });
    }
}
