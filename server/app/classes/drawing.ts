import { ObjectID } from 'mongodb';
export interface Drawing {
    id?: ObjectID;
    title: string;
    tags: string[];
}
