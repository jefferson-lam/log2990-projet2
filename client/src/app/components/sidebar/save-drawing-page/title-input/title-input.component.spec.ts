import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TitleInputComponent } from './title-input.component';

describe('TitleValidatorComponent', () => {
    let component: TitleInputComponent;
    let fixture: ComponentFixture<TitleInputComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [TitleInputComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TitleInputComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('validateTag should set minLengthDivClass to "Failed" if tag is shorter than minimum allowed', () => {
        const testTitle = '';
        component.validateTitle(testTitle);
        expect(component.minLengthDivClass).toEqual('Failed');
    });

    it('validateTag should set minLengthDivClass to "Satisfied" if tag length is equal or longer than minimum allowed', () => {
        const testTitle = 't';
        component.validateTitle(testTitle);
        expect(component.minLengthDivClass).toEqual('Satisfied');
    });

    it('validateTag should set maxLengthDivClass to "Failed" if tag is longer than maximum allowed', () => {
        const testTitle = '012345678901234567891';
        component.validateTitle(testTitle);
        expect(component.maxLengthDivClass).toEqual('Failed');
    });

    it('validateTag should set maxLengthDivClass to "Satisfied" if tag is shorter than maximum allowed', () => {
        const testTitle = '012345678901';
        component.validateTitle(testTitle);
        expect(component.maxLengthDivClass).toEqual('Satisfied');
    });

    it('validateTag should set noSpecialCharactersDivClass to "Failed" if tag has special characters', () => {
        const testTitle = '😂';
        component.validateTitle(testTitle);
        expect(component.noSpecialCharacterDivClass).toEqual('Failed');
    });

    it("validateTag should set noSpecialCharactersDivClass to 'Satisfied' if tag doesn't have special characters", () => {
        const testTitle = 'NoLaughingAllowed';
        component.validateTitle(testTitle);
        expect(component.noSpecialCharacterDivClass).toEqual('Satisfied');
    });
});
