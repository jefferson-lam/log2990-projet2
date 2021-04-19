import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import * as PipetteConstants from '@app/constants/pipette-constants';
import { PipetteService } from '@app/services/tools/pipette/pipette-service';
import { SidebarPipetteComponent } from './sidebar-pipette.component';

// tslint:disable: no-string-literal
// tslint:disable: no-any
describe('SidebarPipetteComponent', () => {
    let component: SidebarPipetteComponent;
    let fixture: ComponentFixture<SidebarPipetteComponent>;
    let pipetteService: PipetteService;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [SidebarPipetteComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SidebarPipetteComponent);
        component = fixture.componentInstance;
        pipetteService = TestBed.inject(PipetteService);
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('ngOnInit should call drawPreview()', () => {
        const drawPreviewSpy = spyOn<any>(component, 'drawPreview');
        component.ngOnInit();
        expect(drawPreviewSpy).toHaveBeenCalled();
    });

    it('drawPreview should call clearRect()', () => {
        const clearRectSpy = spyOn(component['ctx'], 'clearRect');
        component['drawPreview']();
        expect(clearRectSpy).toHaveBeenCalled();
    });

    it('drawPreview should call clearRect()', () => {
        const clearRectSpy = spyOn(component['ctx'], 'clearRect');
        component['drawPreview']();
        expect(clearRectSpy).toHaveBeenCalled();
    });

    it('drawPreview should call canvas functions if inBound is true', () => {
        component.inBound = true;
        const arrayData = new Uint8ClampedArray(PipetteConstants.RAWDATA_SIZE * PipetteConstants.RAWDATA_SIZE * PipetteConstants.RGBA_SIZE);
        for (let i = 0; i < arrayData.length; i++) {
            arrayData[i] = PipetteConstants.NON_TRANSPARENT_FF;
        }
        const pixelData = new ImageData(arrayData, PipetteConstants.RAWDATA_SIZE, PipetteConstants.RAWDATA_SIZE);
        component['ctx'].putImageData(pixelData, 0, 0);

        const clipSpy = spyOn<any>(component, 'clipPreview');
        const zoomSpy = spyOn<any>(component, 'zoomPreview');
        const centerPixelStrokeSpy = spyOn<any>(component, 'centerPixelStroke');
        const previewStrokeSpy = spyOn(component, 'previewStroke');
        component['drawPreview']();
        expect(clipSpy).toHaveBeenCalled();
        expect(zoomSpy).toHaveBeenCalled();
        expect(centerPixelStrokeSpy).toHaveBeenCalled();
        expect(previewStrokeSpy).toHaveBeenCalled();
    });

    it('drawPreview should not call canvas functions if inBound is false', () => {
        component.inBound = false;
        const pixelData = new ImageData(PipetteConstants.RAWDATA_SIZE, PipetteConstants.RAWDATA_SIZE);
        component['ctx'].putImageData(pixelData, 0, 0);

        const clipSpy = spyOn<any>(component, 'clipPreview');
        const zoomSpy = spyOn<any>(component, 'zoomPreview');
        const centerPixelStrokeSpy = spyOn<any>(component, 'centerPixelStroke');
        const previewStrokeSpy = spyOn(component, 'previewStroke');
        component['drawPreview']();
        expect(clipSpy).not.toHaveBeenCalled();
        expect(zoomSpy).not.toHaveBeenCalled();
        expect(centerPixelStrokeSpy).not.toHaveBeenCalled();
        expect(previewStrokeSpy).not.toHaveBeenCalled();
    });

    it('drawPreview should call putImageData() if inBound is true', () => {
        component.inBound = true;
        const arrayData = new Uint8ClampedArray(PipetteConstants.RAWDATA_SIZE * PipetteConstants.RAWDATA_SIZE * PipetteConstants.RGBA_SIZE);
        for (let i = 0; i < arrayData.length; i++) {
            arrayData[i] = PipetteConstants.NON_TRANSPARENT_FF;
        }
        const pixelData = new ImageData(arrayData, PipetteConstants.RAWDATA_SIZE, PipetteConstants.RAWDATA_SIZE);
        component['rawData'] = pixelData;

        const putImageDataSpy = spyOn(component['ctx'], 'putImageData');
        component['drawPreview']();
        expect(putImageDataSpy).toHaveBeenCalled();
    });

    it('drawPreview should not call putImageData() if inBound is false', () => {
        component.inBound = false;
        const arrayData = new Uint8ClampedArray([0, 0, 0, 0]);
        const pixelData = new ImageData(arrayData, 1, 1);
        pipetteService.previewData = pixelData;

        const putImageDataSpy = spyOn(component['ctx'], 'putImageData');
        component['drawPreview']();
        expect(putImageDataSpy).not.toHaveBeenCalled();
    });

    it('clipPreview should call canvas functions', () => {
        const beginPathSpy = spyOn(component['ctx'], 'beginPath');
        const arcSpy = spyOn(component['ctx'], 'arc');
        const clipSpy = spyOn(component['ctx'], 'clip');
        const closePathSpy = spyOn(component['ctx'], 'closePath');
        component['clipPreview']();
        expect(beginPathSpy).toHaveBeenCalled();
        expect(arcSpy).toHaveBeenCalled();
        expect(clipSpy).toHaveBeenCalled();
        expect(closePathSpy).toHaveBeenCalled();
    });

    it('zoomPreview should call drawImage()', () => {
        const drawImageSpy = spyOn(component['ctx'], 'drawImage');
        component['zoomPreview']();
        expect(drawImageSpy).toHaveBeenCalled();
    });

    it('centerPixelStroke should call strokeRect()', () => {
        const strokeRectSpy = spyOn(component['ctx'], 'strokeRect');
        component['centerPixelStroke']();
        expect(strokeRectSpy).toHaveBeenCalled();
    });

    it('previewStroke should call canvas functions', () => {
        const beginPathSpy = spyOn(component['ctx'], 'beginPath');
        const arcSpy = spyOn(component['ctx'], 'arc');
        const strokeSpy = spyOn(component['ctx'], 'stroke');
        const closePathSpy = spyOn(component['ctx'], 'closePath');
        component.previewStroke();
        expect(beginPathSpy).toHaveBeenCalled();
        expect(arcSpy).toHaveBeenCalled();
        expect(strokeSpy).toHaveBeenCalled();
        expect(closePathSpy).toHaveBeenCalled();
    });
});
