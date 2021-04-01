import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ExportCompletePageComponent } from './export-complete-page.component';

describe('ExportCompletePageComponent', () => {
    let component: ExportCompletePageComponent;
    let fixture: ComponentFixture<ExportCompletePageComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ExportCompletePageComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ExportCompletePageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('setUrlText should set the url in the header innerText', () => {
        const urlHeader = document.getElementById('urlLink') as HTMLElement;
        component.imageUrl = 'www.thisisalink.com';

        component.setUrlText();
        expect(urlHeader.innerText).toEqual('www.thisisalink.com');
    });
});
