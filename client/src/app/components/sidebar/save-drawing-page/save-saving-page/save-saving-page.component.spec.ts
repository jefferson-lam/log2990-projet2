import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SaveSavingPageComponent } from './save-saving-page.component';

describe('SavingPageComponent', () => {
    let component: SaveSavingPageComponent;
    let fixture: ComponentFixture<SaveSavingPageComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [SaveSavingPageComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
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
