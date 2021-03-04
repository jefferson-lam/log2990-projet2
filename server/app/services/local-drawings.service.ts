import { ServerDrawing } from '@common/communication/serverDrawing';
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

    getDrawing(wantedId: number): ServerDrawing | undefined {
        return this.clientDrawings.find(({ id }) => id === wantedId);
    }
}
