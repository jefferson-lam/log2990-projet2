import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ImgurService } from '@app/services/imgur/imgur.service';
import { ExportErrorPageComponent } from './export-error-page.component';

fdescribe('ExportErrorPageComponent', () => {
    let component: ExportErrorPageComponent;
    let fixture: ComponentFixture<ExportErrorPageComponent>;
    let imgurStub: ImgurService;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ExportErrorPageComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ExportErrorPageComponent);
        component = fixture.componentInstance;
        imgurStub = TestBed.inject(ImgurService);
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('resetValues should call resetServiceSettings', () => {
        const resetServiceSettingsSpy = spyOn(imgurStub, 'resetServiceSettings');

        component.resetValues();
        expect(resetServiceSettingsSpy).toHaveBeenCalled();
    });
});
