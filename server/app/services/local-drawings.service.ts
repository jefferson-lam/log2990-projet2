import { ServerDrawing } from '@common/communication/server-drawing';
import { injectable } from 'inversify';
import 'reflect-metadata';

@injectable()
export class LocalDrawingsService {
    clientDrawings: ServerDrawing[];

    constructor() {
        this.clientDrawings = [];
    }

    saveDrawing(drawing: ServerDrawing): void {
        this.clientDrawings.push(drawing);
    }

    getAllDrawings(): ServerDrawing[] {
        return this.clientDrawings;
    }

    getDrawing(wantedId: string): ServerDrawing | undefined {
        return this.clientDrawings.find(({ id }) => id === wantedId);
    }
}
