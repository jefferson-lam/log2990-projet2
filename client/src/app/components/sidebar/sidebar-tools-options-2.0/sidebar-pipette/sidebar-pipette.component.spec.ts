import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SidebarPipetteComponent } from './sidebar-pipette.component';

fdescribe('SidebarPipetteComponent', () => {
    let component: SidebarPipetteComponent;
    let fixture: ComponentFixture<SidebarPipetteComponent>;
    //let service: PipetteService;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [SidebarPipetteComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SidebarPipetteComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        //service = TestBed.inject(PipetteService);
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('ngOnInit should call drawPreview()', () => {
        const drawPreviewSpy = spyOn(component, 'drawPreview');
        component.ngOnInit();
        expect(drawPreviewSpy).toHaveBeenCalled();
    });

    it('drawPreview should call putImageData()', () => {
        const putImageDataSpy = spyOn(component.ctx, 'putImageData');
        component.drawPreview();
        expect(putImageDataSpy).toHaveBeenCalled();
    });

    it('drawPreview should call drawImage()', () => {
        const drawImageSpy = spyOn(component.ctx, 'drawImage');
        component.drawPreview();
        expect(drawImageSpy).toHaveBeenCalled();
    });

    it('drawPreview should call strokeRect()', () => {
        const strokeRectSpy = spyOn(component.ctx, 'strokeRect');
        component.drawPreview();
        expect(strokeRectSpy).toHaveBeenCalled();
    });
});
