import { ObjectID } from 'mongodb';
export interface Drawing {
    _id?: ObjectID;
    title: string;
    tags: string[];
}
