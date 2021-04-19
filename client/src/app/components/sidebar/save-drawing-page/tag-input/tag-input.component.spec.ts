import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import * as DatabaseConstants from '@common/validation/database-constants';
import { TagInputComponent } from './tag-input.component';

describe('TagValidatorComponent', () => {
    let component: TagInputComponent;
    let fixture: ComponentFixture<TagInputComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [TagInputComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TagInputComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('addTag should add a tag into tags if it is valid.', () => {
        const testTag = 'testTag';
        component.addTag(testTag);
        expect(component.tags.length).toBeGreaterThan(0);
    });

    it('addTag should call resetRequirements', () => {
        const testTag = 'testTag';
        const resetSpy = spyOn(component, 'resetRequirements');
        component.addTag(testTag);
        expect(resetSpy).toHaveBeenCalled();
    });

    it('deleteTag should remove tag from tags if it exists.', () => {
        const testTag = 'testTag';
        component.tags.push(testTag);
        component.deleteTag(testTag);
        expect(component.tags).not.toContain(testTag);
    });

    it("deleteTag should do nothing if tags doesn't exist.", () => {
        const testTag = 'testTag';
        component.deleteTag(testTag);
        expect(component.tags.length).toEqual(0);
    });

    it('validateTag should set distinctTagsDivClass to "Failed" if tag already exists in tags', () => {
        const testTag = 'test';
        component.tags.push(testTag);

        component.validateTag(testTag);
        expect(component.distinctTagsDivClass).toEqual('Failed');
        expect(component.isSavePossible).toEqual(false);
    });

    it("validateTag should set distinctTagsDivClass to 'Satisfied' if tag doesn't exists in tags", () => {
        const testTag = 'test';
        component.validateTag(testTag);
        expect(component.distinctTagsDivClass).toEqual('Satisfied');
        expect(component.isSavePossible).toEqual(true);
    });

    it('distinctTagsValidator should set distinctTagsDivClass to "Failed" if tag already exists in tags', () => {
        const testTag = 'test';
        component.tags.push(testTag);
        component.distinctTagsValidator(testTag);
        expect(component.distinctTagsDivClass).toEqual('Failed');
        expect(component.unsatisfiedRequirements).not.toEqual(0);
    });

    it("distinctTagsValidator should set distinctTagsDivClass to 'Satisfied' if tag doesn't exists in tags", () => {
        const testTag = 'test';
        component.distinctTagsValidator(testTag);
        expect(component.distinctTagsDivClass).toEqual('Satisfied');
    });

    it('validateTag should set minLengthDivClass to "Failed" if tag is shorter than minimum allowed', () => {
        const testTag = '';
        component.validateTag(testTag);
        expect(component.minLengthDivClass).toEqual('Failed');
        expect(component.isSavePossible).toEqual(false);
    });

    it('validateTag should set minLengthDivClass to "Satisfied" if tag length is equal or longer than minimum allowed', () => {
        const testTag = 't';
        component.validateTag(testTag);
        expect(component.distinctTagsDivClass).toEqual('Satisfied');
        expect(component.isSavePossible).toEqual(true);
    });

    it('minLengthTagsValidator should set minLengthDivClass to "Failed" if tag is shorter than minimum allowed', () => {
        const testTag = '';
        component.minLengthTagsValidator(testTag);
        expect(component.minLengthDivClass).toEqual('Failed');
        expect(component.unsatisfiedRequirements).not.toEqual(0);
    });

    it('minLengthTagsValidator should set minLengthDivClass to "Satisfied" if tag length is equal or longer than minimum allowed', () => {
        const testTag = 't';
        component.minLengthTagsValidator(testTag);
        expect(component.minLengthDivClass).toEqual('Satisfied');
    });

    it('validateTag should set maxLengthDivClass to "Failed" if tag is longer than maximum allowed', () => {
        const testTag = '012345678901234567891';
        component.validateTag(testTag);
        expect(component.maxLengthDivClass).toEqual('Failed');
        expect(component.isSavePossible).toEqual(false);
    });

    it('validateTag should set maxLengthDivClass to "Satisfied" if tag is shorter than maximum allowed', () => {
        const testTag = '012345678901';
        component.validateTag(testTag);
        expect(component.maxLengthDivClass).toEqual('Satisfied');
        expect(component.isSavePossible).toEqual(true);
    });

    it('maxLengthTagsValidator should set maxLengthDivClass to "Failed" if tag is longer than maximum allowed', () => {
        const testTag = '012345678901234567891';
        component.maxLengthTagsValidator(testTag);
        expect(component.maxLengthDivClass).toEqual('Failed');
        expect(component.unsatisfiedRequirements).not.toEqual(0);
    });

    it('maxLengthTagsValidator should set maxLengthDivClass to "Satisfied" if tag is shorter than maximum allowed', () => {
        const testTag = '012345678901';
        component.maxLengthTagsValidator(testTag);
        expect(component.maxLengthDivClass).toEqual('Satisfied');
    });

    it('validateTag should set noSpecialCharactersDivClass to "Failed" if tag has special characters', () => {
        const testTag = '😂';
        component.validateTag(testTag);
        expect(component.noSpecialCharacterDivClass).toEqual('Failed');
        expect(component.isSavePossible).toEqual(false);
    });

    it("validateTag should set noSpecialCharactersDivClass to 'Satisfied' if tag doesn't have special characters", () => {
        const testTag = 'NoLaughingAllowed';
        component.validateTag(testTag);
        expect(component.noSpecialCharacterDivClass).toEqual('Satisfied');
        expect(component.isSavePossible).toEqual(true);
    });

    it('characterTagsValidator should set noSpecialCharactersDivClass to "Failed" if tag has special characters', () => {
        const testTag = '😂';
        component.validateTag(testTag);
        expect(component.noSpecialCharacterDivClass).toEqual('Failed');
        expect(component.unsatisfiedRequirements).not.toEqual(0);
    });

    it("characterTagsValidator should set noSpecialCharactersDivClass to 'Satisfied' if tag doesn't have special characters", () => {
        const testTag = 'NoLaughingAllowed';
        component.validateTag(testTag);
        expect(component.noSpecialCharacterDivClass).toEqual('Satisfied');
    });

    it('validateTag should set maxTagsCountDivClass to "Failed" if tag already has max amount of tags allowed', () => {
        const testTag = 'test';
        for (let i = 0; i < DatabaseConstants.MAX_TAGS_COUNT; i++) {
            component.tags.push(testTag + i.toString());
        }
        component.validateTag(testTag);
        expect(component.maxTagsCountDivClass).toEqual('Failed');
        expect(component.isSavePossible).toEqual(false);
    });

    it("validateTag should set maxTagsCountDivClass to 'Satisfied' if tag doesn't have max amount of tags allowed", () => {
        const testTag = 'test';
        const RANDOM_AMOUNT = 10;
        for (let i = 0; i < RANDOM_AMOUNT; i++) {
            component.tags.push(testTag + i.toString());
        }
        component.validateTag(testTag);
        expect(component.maxTagsCountDivClass).toEqual('Satisfied');
        expect(component.isSavePossible).toEqual(true);
    });

    it('maxTagsValidator should set maxTagsCountDivClass to "Failed" if tag already has max amount of tags allowed', () => {
        const testTag = 'test';
        for (let i = 0; i < DatabaseConstants.MAX_TAGS_COUNT; i++) {
            component.tags.push(testTag + i.toString());
        }
        component.maxTagsValidator();
        expect(component.maxTagsCountDivClass).toEqual('Failed');
        expect(component.unsatisfiedRequirements).not.toEqual(0);
    });

    it("maxTagsValidator should set maxTagsCountDivClass to 'Satisfied' if tag doesn't have max amount of tags allowed", () => {
        const testTag = 'test';
        const RANDOM_AMOUNT = 10;
        for (let i = 0; i < RANDOM_AMOUNT; i++) {
            component.tags.push(testTag + i.toString());
        }
        component.maxTagsValidator();
        expect(component.maxTagsCountDivClass).toEqual('Satisfied');
    });

    it('validateTag should call all validators methods', () => {
        const distinctSpy = spyOn(component, 'distinctTagsValidator');
        const minLengthSpy = spyOn(component, 'minLengthTagsValidator');
        const maxLengthSpy = spyOn(component, 'maxLengthTagsValidator');
        const characterSpy = spyOn(component, 'characterTagsValidator');
        const maxSpy = spyOn(component, 'maxTagsValidator');
        const testTag = 'test';

        component.validateTag(testTag);
        expect(distinctSpy).toHaveBeenCalled();
        expect(minLengthSpy).toHaveBeenCalled();
        expect(maxLengthSpy).toHaveBeenCalled();
        expect(characterSpy).toHaveBeenCalled();
        expect(maxSpy).toHaveBeenCalled();
    });

    it('addTag should handle case where tag already exists in tags', () => {
        const testTag = 'test';
        component.tags.push(testTag);

        component.addTag(testTag);
        expect(component.tags.length).toEqual(1);
    });

    it("checkIsTagValid should handle case where tag doesn't exists in tags", () => {
        const testTag = 'test';
        component.addTag(testTag);
        expect(component.tags.length).toEqual(1);
    });

    it('checkIsTagValid should handle case where tag is shorter than minimum allowed', () => {
        const testTag = '';
        component.addTag(testTag);
        expect(component.tags.length).toEqual(0);
    });

    it('checkIsTagValid should handle case where tag length is equal or longer than minimum allowed', () => {
        const testTag = 't';
        component.addTag(testTag);
        expect(component.tags.length).toEqual(1);
    });

    it('checkIsTagValid should handle case where tag is longer than maximum allowed', () => {
        const testTag = '012345678901234567891';
        component.addTag(testTag);
        expect(component.tags.length).toEqual(0);
    });

    it('checkIsTagValid should handle case where tag is shorter than maximum allowed', () => {
        const testTag = '012345678901';
        component.addTag(testTag);
        expect(component.tags.length).toEqual(1);
    });

    it('checkIsTagValid should handle case where tag has special characters', () => {
        const testTag = '😂';
        component.addTag(testTag);
        expect(component.tags.length).toEqual(0);
    });

    it("checkIsTagValid should handle case where tag doesn't have special characters", () => {
        const testTag = 'NoLaughingAllowed';
        component.addTag(testTag);
        expect(component.tags.length).toEqual(1);
    });

    it('checkIsTagValid should handle case where tag already has max amount of tags allowed', () => {
        const testTag = 'test';
        for (let i = 0; i < DatabaseConstants.MAX_TAGS_COUNT; i++) {
            component.tags.push(testTag + i.toString());
        }
        component.addTag(testTag);
        expect(component.tags.length).toEqual(DatabaseConstants.MAX_TAGS_COUNT);
    });

    it("checkIsTagValid should handle case where tag doesn't have max amount of tags allowed", () => {
        const testTag = 'test';
        const RANDOM_AMOUNT = 10;
        for (let i = 0; i < RANDOM_AMOUNT; i++) {
            component.tags.push(testTag + i.toString());
        }
        component.addTag(testTag);
        expect(component.tags.length).toEqual(RANDOM_AMOUNT + 1);
    });

    it('resetRequirementsOnFocusOut should call resetRequirements if tag is shorter than minimum allowed', () => {
        const testTag = '';
        const resetSpy = spyOn(component, 'resetRequirements');

        component.resetRequirementsOnFocusOut(testTag);
        expect(resetSpy).toHaveBeenCalled();
    });

    it('resetRequirementsOnFocusOut should not call resetRequirements if tag is longer than minimum allowed', () => {
        const testTag = 'test';
        const resetSpy = spyOn(component, 'resetRequirements');

        component.resetRequirementsOnFocusOut(testTag);
        expect(resetSpy).not.toHaveBeenCalled();
    });

    it('resetRequirements should set classes to Unrequested', () => {
        component.resetRequirements();
        expect(component.distinctTagsDivClass).toEqual('Unrequested');
        expect(component.minLengthDivClass).toEqual('Unrequested');
        expect(component.maxLengthDivClass).toEqual('Unrequested');
        expect(component.noSpecialCharacterDivClass).toEqual('Unrequested');
        expect(component.maxTagsCountDivClass).toEqual('Unrequested');
    });
});
