import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PipetteService } from '@app/services/tools/pipette/pipette-service';
import { SidebarPipetteComponent } from './sidebar-pipette.component';

fdescribe('SidebarPipetteComponent', () => {
    let component: SidebarPipetteComponent;
    let fixture: ComponentFixture<SidebarPipetteComponent>;
    let pipetteService: PipetteService;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [SidebarPipetteComponent],
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
        const drawPreviewSpy = spyOn(component, 'drawPreview');
        component.ngOnInit();
        expect(drawPreviewSpy).toHaveBeenCalled();
    });

    it('drawPreview should call clearRect()', () => {
        const clearRectSpy = spyOn(component.ctx, 'clearRect');
        component.drawPreview();
        expect(clearRectSpy).toHaveBeenCalled();
    });

    it('drawPreview should call clearRect()', () => {
        const clearRectSpy = spyOn(component.ctx, 'clearRect');
        component.drawPreview();
        expect(clearRectSpy).toHaveBeenCalled();
    });

    it('drawPreview should call canvas functions if centerPixel is not transparent', () => {
        const arrayData = new Uint8ClampedArray(11 * 11 * 4);
        for (let i = 0; i < arrayData.length; i++) {
            arrayData[i] = 255;
        }
        const pixelData = new ImageData(arrayData, 11, 11);
        component.rawData = pixelData;

        const clipSpy = spyOn(component, 'clipPreview');
        const zoomSpy = spyOn(component, 'zoomPreview');
        const centerPixelStrokeSpy = spyOn(component, 'centerPixelStroke');
        const previewStrokeSpy = spyOn(component, 'previewStroke');
        component.drawPreview();
        expect(clipSpy).toHaveBeenCalled();
        expect(zoomSpy).toHaveBeenCalled();
        expect(centerPixelStrokeSpy).toHaveBeenCalled();
        expect(previewStrokeSpy).toHaveBeenCalled();
        expect((document.getElementById('pipettePreview') as HTMLCanvasElement).style.display).toEqual('block');
    });

    it('drawPreview should not call canvas functions if centerPixel is transparent', () => {
        const pixelData = new ImageData(11, 11);
        pipetteService.previewData = pixelData;

        const clipSpy = spyOn(component, 'clipPreview');
        const zoomSpy = spyOn(component, 'zoomPreview');
        const centerPixelStrokeSpy = spyOn(component, 'centerPixelStroke');
        const previewStrokeSpy = spyOn(component, 'previewStroke');
        component.drawPreview();
        expect(clipSpy).not.toHaveBeenCalled();
        expect(zoomSpy).not.toHaveBeenCalled();
        expect(centerPixelStrokeSpy).not.toHaveBeenCalled();
        expect(previewStrokeSpy).not.toHaveBeenCalled();
        expect((document.getElementById('pipettePreview') as HTMLCanvasElement).style.display).toEqual('none');
    });

    it('drawPreview should call putImageData() if centerPixel is not transparent', () => {
        const arrayData = new Uint8ClampedArray(11 * 11 * 4);
        for (let i = 0; i < arrayData.length; i++) {
            arrayData[i] = 255;
        }
        const pixelData = new ImageData(arrayData, 11, 11);
        component.rawData = pixelData;

        const putImageDataSpy = spyOn(component.ctx, 'putImageData');
        component.drawPreview();
        expect(putImageDataSpy).toHaveBeenCalled();
    });

    it('drawPreview should not call putImageData() if centerPixel is transparent', () => {
        const arrayData = new Uint8ClampedArray([0, 0, 0, 0]);
        const pixelData = new ImageData(arrayData, 1, 1);
        pipetteService.previewData = pixelData;

        const putImageDataSpy = spyOn(component.ctx, 'putImageData');
        component.drawPreview();
        expect(putImageDataSpy).not.toHaveBeenCalled();
    });

    it('clipPreview should call canvas functions', () => {
        const beginPathSpy = spyOn(component.ctx, 'beginPath');
        const arcSpy = spyOn(component.ctx, 'arc');
        const clipSpy = spyOn(component.ctx, 'clip');
        const closePathSpy = spyOn(component.ctx, 'closePath');
        component.clipPreview(component.ctx);
        expect(beginPathSpy).toHaveBeenCalled();
        expect(arcSpy).toHaveBeenCalled();
        expect(clipSpy).toHaveBeenCalled();
        expect(closePathSpy).toHaveBeenCalled();
    });

    it('zoomPreview should call drawImage()', () => {
        const drawImageSpy = spyOn(component.ctx, 'drawImage');
        component.zoomPreview(component.ctx);
        expect(drawImageSpy).toHaveBeenCalled();
    });

    it('centerPixelStroke should call strokeRect()', () => {
        const strokeRectSpy = spyOn(component.ctx, 'strokeRect');
        component.centerPixelStroke(component.ctx);
        expect(strokeRectSpy).toHaveBeenCalled();
    });

    it('previewStroke should call canvas functions', () => {
        const beginPathSpy = spyOn(component.ctx, 'beginPath');
        const arcSpy = spyOn(component.ctx, 'arc');
        const strokeSpy = spyOn(component.ctx, 'stroke');
        const closePathSpy = spyOn(component.ctx, 'closePath');
        component.previewStroke(component.ctx);
        expect(beginPathSpy).toHaveBeenCalled();
        expect(arcSpy).toHaveBeenCalled();
        expect(strokeSpy).toHaveBeenCalled();
        expect(closePathSpy).toHaveBeenCalled();
    });
});
