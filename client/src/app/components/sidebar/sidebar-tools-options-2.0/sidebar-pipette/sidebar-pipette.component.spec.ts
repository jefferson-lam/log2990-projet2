import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SidebarPipetteComponent } from './sidebar-pipette.component';

fdescribe('SidebarPipetteComponent', () => {
    let component: SidebarPipetteComponent;
    let fixture: ComponentFixture<SidebarPipetteComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [SidebarPipetteComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SidebarPipetteComponent);
        component = fixture.componentInstance;
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

    it('drawPreview should call clipPreview()', () => {
        const clipSpy = spyOn(component, 'clipPreview');
        component.drawPreview();
        expect(clipSpy).toHaveBeenCalled();
    });

    it('drawPreview should call putImageData()', () => {
        const putImageDataSpy = spyOn(component.ctx, 'putImageData');
        component.drawPreview();
        expect(putImageDataSpy).toHaveBeenCalled();
    });

    it('drawPreview should call zoomPreview()', () => {
        const zoomSpy = spyOn(component, 'zoomPreview');
        component.drawPreview();
        expect(zoomSpy).toHaveBeenCalled();
    });

    it('drawPreview should call centerPixelStroke()', () => {
        const centerPixelStrokeSpy = spyOn(component, 'centerPixelStroke');
        component.drawPreview();
        expect(centerPixelStrokeSpy).toHaveBeenCalled();
    });

    it('drawPreview should call previewStroke()', () => {
        const previewStrokeSpy = spyOn(component, 'previewStroke');
        component.drawPreview();
        expect(previewStrokeSpy).toHaveBeenCalled();
    });

    it('clipPreview should call beginPath()', () => {
        const beginPathSpy = spyOn(component.ctx, 'beginPath');
        component.clipPreview(component.ctx);
        expect(beginPathSpy).toHaveBeenCalled();
    });

    it('clipPreview should call arc()', () => {
        const arcSpy = spyOn(component.ctx, 'arc');
        component.clipPreview(component.ctx);
        expect(arcSpy).toHaveBeenCalled();
    });

    it('clipPreview should call clip()', () => {
        const clipSpy = spyOn(component.ctx, 'clip');
        component.clipPreview(component.ctx);
        expect(clipSpy).toHaveBeenCalled();
    });

    it('clipPreview should call closePath()', () => {
        const closePathSpy = spyOn(component.ctx, 'closePath');
        component.clipPreview(component.ctx);
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

    it('previewStroke should call beginPath()', () => {
        const beginPathSpy = spyOn(component.ctx, 'beginPath');
        component.previewStroke(component.ctx);
        expect(beginPathSpy).toHaveBeenCalled();
    });

    it('previewStroke should call arc()', () => {
        const arcSpy = spyOn(component.ctx, 'arc');
        component.previewStroke(component.ctx);
        expect(arcSpy).toHaveBeenCalled();
    });

    it('previewStroke should call stroke()', () => {
        const strokeSpy = spyOn(component.ctx, 'stroke');
        component.previewStroke(component.ctx);
        expect(strokeSpy).toHaveBeenCalled();
    });

    it('previewStroke should call closePath()', () => {
        const closePathSpy = spyOn(component.ctx, 'closePath');
        component.previewStroke(component.ctx);
        expect(closePathSpy).toHaveBeenCalled();
    });

    it('drawPreview should call strokeRect()', () => {
        const strokeRectSpy = spyOn(component.ctx, 'strokeRect');
        component.drawPreview();
        expect(strokeRectSpy).toHaveBeenCalled();
    });
});
