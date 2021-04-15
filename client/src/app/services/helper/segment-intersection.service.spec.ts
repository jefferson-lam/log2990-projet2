import { TestBed } from '@angular/core/testing';
import { SegmentIntersectionService } from './segment-intersection.service';

describe('SegmentIntersectionService', () => {
    let service: SegmentIntersectionService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(SegmentIntersectionService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('calculateSlopeLine should calculate correct slope with positive dx', () => {
        const start = { x: 50, y: 50 };
        const end = { x: 100, y: 100 };
        const line = {
            start,
            end,
        };
        const expectedSlope = 1;
        const slope = service['calculateSlopeLine'](line);
        expect(slope).toEqual(expectedSlope);
    });

    it('calculateSlopeLine should calculate correct slope with negative dx', () => {
        const start = { x: 100, y: 100 };
        const end = { x: 50, y: 50 };
        const line = {
            start,
            end,
        };

        const expectedSlope = 1;
        const slope = service['calculateSlopeLine'](line);
        expect(slope).toEqual(expectedSlope);
    });

    it('calculateSlopeLine should correctly calculate Infinity slope', () => {
        const start = { x: 50, y: 50 };
        const end = { x: 50, y: 50 };
        const line = {
            start,
            end,
        };

        const expectedSlope = Infinity;
        const slope = service['calculateSlopeLine'](line);
        expect(slope).toEqual(expectedSlope);
    });

    it('calculateSlopeLine should correctly calculate random slope', () => {
        const start = { x: 50, y: 50 };
        const end = { x: 50, y: 900 };
        const line = {
            start,
            end,
        };

        const expectedSlope = Infinity;
        const slope = service['calculateSlopeLine'](line);
        expect(slope).toEqual(expectedSlope);
    });

    it('areAllPointsAligned should return true if all points are equal', () => {
        const start1 = { x: 50, y: 50 };
        const end1 = { x: 50, y: 900 };
        const start2 = { x: 50, y: 50 };
        const end2 = { x: 50, y: 900 };
        const result = service['areAllPointsAligned'](start1.x, end1.x, start2.x, end2.x);
        expect(result).toBeTruthy();
    });

    it('areAllPointsAligned should return true if all points are equal', () => {
        const start1 = { x: 100, y: 50 };
        const end1 = { x: 50, y: 900 };
        const start2 = { x: 50, y: 50 };
        const end2 = { x: 50, y: 900 };
        const result = service['areAllPointsAligned'](start1.x, end1.x, start2.x, end2.x);
        expect(result).toBeFalsy();
    });

    it('doDomainsOverlap should return true if all lines domain overlap', () => {
        const start1 = { x: 100, y: 50 };
        const end1 = { x: 50, y: 900 };
        const start2 = { x: 50, y: 50 };
        const end2 = { x: 50, y: 900 };
        const result = service['doDomainsOverlap'](start1.x, end1.x, start2.x, end2.x);
        expect(result).toBeTruthy();
    });

    it('doDomainsOverlap should return true if all lines domain overlap', () => {
        const start1 = { x: 25, y: 50 };
        const end1 = { x: 50, y: 65 };
        const start2 = { x: 50, y: 50 };
        const end2 = { x: 50, y: 90 };
        const result = service['doDomainsOverlap'](start1.x, end1.x, start2.x, end2.x);
        expect(result).toBeTruthy();
    });

    it('doLinesShareRange should call doDomainsOverlap and areAllPointsAligned return true', () => {
        const doDomainsOverlapSpy = spyOn<any>(service, 'doDomainsOverlap').and.callThrough();
        const areAllPointsAlignedSpy = spyOn<any>(service, 'areAllPointsAligned').and.callThrough();
        const start1 = { x: 50, y: 50 };
        const end1 = { x: 50, y: 900 };
        const line1 = {
            start: start1,
            end: end1,
        };
        const start2 = { x: 50, y: 50 };
        const end2 = { x: 50, y: 90 };
        const line2 = {
            start: start2,
            end: end2,
        };
        const result = service['doLinesShareRange'](line1, line2);
        expect(doDomainsOverlapSpy).toHaveBeenCalled();
        expect(areAllPointsAlignedSpy).toHaveBeenCalled();
        expect(result).toBeTruthy();
    });

    it('doLinesShareRange should call doDomainsOverlap and areAllPointsAligned return false', () => {
        const doDomainsOverlapSpy = spyOn<any>(service, 'doDomainsOverlap').and.callThrough();
        const areAllPointsAlignedSpy = spyOn<any>(service, 'areAllPointsAligned').and.callThrough();
        const start1 = { x: 32, y: 50 };
        const end1 = { x: 120, y: 900 };
        const line1 = {
            start: start1,
            end: end1,
        };
        const start2 = { x: 121, y: 50 };
        const end2 = { x: 800, y: 90 };
        const line2 = {
            start: start2,
            end: end2,
        };
        const result = service['doLinesShareRange'](line1, line2);
        expect(doDomainsOverlapSpy).toHaveBeenCalled();
        expect(areAllPointsAlignedSpy).toHaveBeenCalled();
        expect(result).toBeFalsy();
    });

    it('isColinear should return false if both lines are not colinear', () => {
        const start1 = { x: 32, y: 50 };
        const end1 = { x: 120, y: 900 };
        const line1 = {
            start: start1,
            end: end1,
        };
        const start2 = { x: 121, y: 50 };
        const end2 = { x: 800, y: 90 };
        const line2 = {
            start: start2,
            end: end2,
        };
        const result = service['isColinear'](line1, line2);
        expect(result).toBeFalsy();
    });

    it('isColinear should return true if both lines are colinear', () => {
        const start1 = { x: 32, y: 50 };
        const end1 = { x: 32, y: 900 };
        const line1 = {
            start: start1,
            end: end1,
        };
        const start2 = { x: 32, y: 50 };
        const end2 = { x: 32, y: 900 };
        const line2 = {
            start: start2,
            end: end2,
        };
        const result = service['isColinear'](line1, line2);
        expect(result).toBeTruthy();
    });

    it('intersects should return true if both lines are colinear', () => {
        const start1 = { x: 32, y: 50 };
        const end1 = { x: 32, y: 900 };
        const line1 = {
            start: start1,
            end: end1,
        };
        const start2 = { x: 32, y: 50 };
        const end2 = { x: 32, y: 900 };
        const line2 = {
            start: start2,
            end: end2,
        };
        const result = service['intersects'](line1, line2);
        expect(result).toBeTruthy();
    });

    it('intersects should return false if both lines determinant is 0', () => {
        const start1 = { x: 5, y: 520 };
        const end1 = { x: 32, y: 50 };
        const line1 = {
            start: start1,
            end: end1,
        };
        const start2 = { x: 32, y: 50 };
        const end2 = { x: 25, y: 43 };
        const line2 = {
            start: start2,
            end: end2,
        };
        const result = service['intersects'](line1, line2);
        expect(result).toBeFalsy();
    });

    it('intersects should return true if both lines intersect', () => {
        const start1 = { x: 10, y: 25 };
        const end1 = { x: 100, y: 50 };
        const line1 = {
            start: start1,
            end: end1,
        };
        const start2 = { x: 250, y: 120 };
        const end2 = { x: 32, y: 50 };
        const line2 = {
            start: start2,
            end: end2,
        };
        const result = service['intersects'](line1, line2);
        expect(result).toBeFalsy();
    });
});
