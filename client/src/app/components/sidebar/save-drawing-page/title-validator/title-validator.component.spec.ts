import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TitleValidatorComponent } from './title-validator.component';

describe('TitleValidatorComponent', () => {
    let component: TitleValidatorComponent;
    let fixture: ComponentFixture<TitleValidatorComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [TitleValidatorComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TitleValidatorComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
