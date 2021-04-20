import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ImgurService } from '@app/services/imgur/imgur.service';
import { ExportCompletePageComponent } from './export-complete-page.component';

// tslint:disable: no-string-literal
describe('ExportCompletePageComponent', () => {
    let component: ExportCompletePageComponent;
    let fixture: ComponentFixture<ExportCompletePageComponent>;
    let imgurStub: ImgurService;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ExportCompletePageComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ExportCompletePageComponent);
        component = fixture.componentInstance;
        imgurStub = TestBed.inject(ImgurService);
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('setUrlText should set the url in the header innerText', () => {
        const urlHeader = document.getElementById('urlLink') as HTMLElement;
        component.imageUrl = 'www.thisisalink.com';

        component['setUrlText']();
        expect(urlHeader.innerText).toEqual('www.thisisalink.com');
    });

    it('resetValues should call resetServiceSettings', () => {
        const resetServiceSettingsSpy = spyOn(imgurStub, 'resetServiceSettings');

        component.resetValues();
        expect(resetServiceSettingsSpy).toHaveBeenCalled();
    });
});
