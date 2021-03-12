import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SaveSavingPageComponent } from './save-saving-page.component';

describe('SavingPageComponent', () => {
    let component: SaveSavingPageComponent;
    let fixture: ComponentFixture<SaveSavingPageComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [SaveSavingPageComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SaveSavingPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
