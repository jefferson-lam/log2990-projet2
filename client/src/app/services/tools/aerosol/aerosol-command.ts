import { Command } from '@app/classes/command';
import { Vec2 } from '@app/classes/vec2';
import { AerosolService } from '@app/services/tools/aerosol/aerosol-service';

export class AerosolCommand extends Command {
    private waterDropWidth: number;
    private primaryColor: string;
    private path: Vec2[];
    private preview: boolean;
    aerosolRefresh: number;

    constructor(canvasContext: CanvasRenderingContext2D, aerosolService: AerosolService) {
        super();
        this.ctx = canvasContext;
        this.path = Object.assign([], aerosolService.pathData);
        this.primaryColor = aerosolService.primaryColor;
        this.aerosolRefresh = aerosolService.aerosolRefresh;
        this.waterDropWidth = aerosolService.waterDropWidth;
        this.preview = false;
    }

    setValues(canvasContext: CanvasRenderingContext2D, aerosolService: AerosolService): void {
        this.preview = true;
        this.ctx = canvasContext;
        this.path = Object.assign([], aerosolService.pathData);
        this.primaryColor = aerosolService.primaryColor;
        this.aerosolRefresh = aerosolService.aerosolRefresh;
        this.waterDropWidth = aerosolService.waterDropWidth;
    }

    execute(): void {
        if (!this.preview) {
            for (let index = 0; index < this.path.length - 1; index++) {
                this.airBrushCircle(this.ctx, index);
            }
        }
        this.airBrushCircle(this.ctx);
    }

    private airBrushCircle(ctx: CanvasRenderingContext2D, index?: number): void {
        if (!index) index = this.path.length - 1;
        ctx.fillStyle = this.primaryColor;
        ctx.fillRect(this.path[index].x, this.path[index].y, this.waterDropWidth, this.waterDropWidth);
    }
}
