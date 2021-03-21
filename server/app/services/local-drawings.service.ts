import { Message } from '@common/communication/message';
import { ServerDrawing } from '@common/communication/server-drawing';
import * as ServerConstants from '@common/validation/server-constants';
import { injectable } from 'inversify';
import 'reflect-metadata';

@injectable()
export class LocalDrawingsService {
    clientDrawings: ServerDrawing[];

    constructor() {
        this.clientDrawings = [];
    }

    async saveDrawing(drawing: ServerDrawing): Promise<Message> {
        try {
            if (this.containsDrawingId(drawing, this.clientDrawings)) {
                throw new Error('Drawing already exists, failed to save');
            }
            this.clientDrawings.push(drawing);
            return { title: ServerConstants.SUCCESS_MESSAGE, body: 'Drawing successfully saved in local server' };
        } catch (error) {
            return this.generateErrorMessage(error);
        }
    }

    // TODO: determine when it would be impossible to get all drawings
    async getAllDrawings(): Promise<Message> {
        return { title: 'Success', body: JSON.stringify(this.clientDrawings) };
    }

    async getDrawing(wantedId: string): Promise<Message> {
        try {
            // TODO: handle drawing can be undefined
            const drawing = this.clientDrawings.find(({ id }) => id === wantedId);
            if (drawing === undefined) {
                throw new Error('Drawing does not exist, failed to get');
            }
            return { title: ServerConstants.SUCCESS_MESSAGE, body: JSON.stringify(drawing) };
        } catch (error) {
            return this.generateErrorMessage(error);
        }
    }

    async deleteDrawing(wantedId: string): Promise<Message> {
        try {
            // TODO: handle when id doesn't exist
            const indexToDelete = this.clientDrawings.findIndex(({ id }) => id === wantedId);
            if (indexToDelete === ServerConstants.ID_NOT_EXIST) {
                throw new Error('Drawing does not exist, failed to delete');
            }
            this.clientDrawings.splice(indexToDelete, 1);
            return { title: ServerConstants.SUCCESS_MESSAGE, body: 'Drawing successfully deleted' };
        } catch (error) {
            return this.generateErrorMessage(error);
        }
    }

    private generateErrorMessage(error: Error): Message {
        return {
            title: ServerConstants.ERROR_MESSAGE,
            body: error.toString(),
        };
    }

    private containsDrawingId(newDrawing: ServerDrawing, storedDrawings: ServerDrawing[]): boolean {
        return storedDrawings.findIndex(({ id }) => newDrawing.id === id) === ServerConstants.ID_NOT_EXIST ? false : true;
    }
}
