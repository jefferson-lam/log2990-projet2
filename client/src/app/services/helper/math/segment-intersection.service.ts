import { Injectable } from '@angular/core';
import { Line2 } from '@app/classes/line2';

@Injectable({
    providedIn: 'root',
})
export class SegmentIntersectionService {
    // https://stackoverflow.com/questions/9043805/test-if-two-lines-intersect-javascript-function
    intersects(line1: Line2, line2: Line2): boolean {
        let det;
        let gamma;
        let lambda;
        det = (line1.end.x - line1.start.x) * (line2.end.y - line2.start.y) - (line2.end.x - line2.start.x) * (line1.end.y - line1.start.y);
        if (this.isColinear(line1, line2)) {
            return true;
        }
        if (det === 0) {
            return false;
        }
        lambda =
            ((line2.end.y - line2.start.y) * (line2.end.x - line1.start.x) + (line2.start.x - line2.end.x) * (line2.end.y - line1.start.y)) / det;
        gamma = ((line1.start.y - line1.end.y) * (line2.end.x - line1.start.x) + (line1.end.x - line1.start.x) * (line2.end.y - line1.start.y)) / det;
        return 0 < lambda && lambda < 1 && 0 < gamma && gamma < 1;
    }

    private isColinear(line1: Line2, line2: Line2): boolean {
        const line3: Line2 = { start: line1.start, end: line2.start };
        const slopeLine1 = this.calculateSlopeLine(line1);
        const slopeLine3 = this.calculateSlopeLine(line3);
        return slopeLine1 === slopeLine3 && this.doLinesShareRange(line1, line2);
    }

    private doLinesShareRange(line1: Line2, line2: Line2): boolean {
        return (
            (this.doDomainsOverlap(line1.start.x, line1.end.x, line2.start.x, line2.end.x) ||
                this.areAllPointsAligned(line1.start.x, line1.end.x, line2.start.x, line2.end.x)) &&
            (this.doDomainsOverlap(line1.start.y, line1.end.y, line2.start.y, line2.end.y) ||
                this.areAllPointsAligned(line1.start.y, line1.end.y, line2.start.y, line2.end.y))
        );
    }

    private doDomainsOverlap(line1Start: number, line1End: number, line2Start: number, line2End: number): boolean {
        const minLine1 = Math.min(line1Start, line1End);
        const maxLine1 = Math.max(line1Start, line1End);
        const minLine2 = Math.min(line2Start, line2End);
        const maxLine2 = Math.max(line2Start, line2End);
        return (
            (minLine1 >= minLine2 && minLine1 < maxLine2) ||
            (maxLine1 > minLine2 && maxLine1 <= maxLine2) ||
            (minLine2 >= minLine1 && minLine2 < maxLine1) ||
            (maxLine2 > minLine1 && maxLine2 <= maxLine1)
        );
    }

    private areAllPointsAligned(line1Start: number, line1End: number, line2Start: number, line2End: number): boolean {
        return line1Start === line1End && line1Start === line2Start && line1Start === line2End;
    }

    private calculateSlopeLine(line: Line2): number {
        const TOLERANCE = 2;
        const ROUNDING_FACTOR = 10;
        return Math.abs(line.end.x - line.start.x) < TOLERANCE
            ? Number.POSITIVE_INFINITY
            : Math.round((Math.abs(line.end.y - line.start.y) / Math.abs(line.end.x - line.start.x)) * ROUNDING_FACTOR) / ROUNDING_FACTOR;
    }
}
