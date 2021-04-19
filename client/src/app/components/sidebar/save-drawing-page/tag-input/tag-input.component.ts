import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import * as SaveDrawingConstants from '@app/constants/save-drawing-constants';
import * as TagInputConstants from '@app/constants/tag-input-constants';
import * as DatabaseConstants from '@common/validation/database-constants';

@Component({
    selector: 'app-tag-input',
    templateUrl: './tag-input.component.html',
    styleUrls: ['./tag-input.component.scss'],
})
export class TagInputComponent {
    constructor() {
        this.tags = [];
        this.areTagsValidEvent = new EventEmitter<boolean>();
        this.distinctTagsRequirement = TagInputConstants.DISTINCT_TAGS_REQUIREMENT;
        this.minLengthRequirement = TagInputConstants.MIN_LENGTH_REQUIREMENT;
        this.maxLengthRequirement = TagInputConstants.MAX_LENGTH_REQUIREMENT;
        this.noSpecialCharacterRequirement = TagInputConstants.NO_SPECIAL_CARACTER_REQUIREMENT;
        this.maxTagsCountRequirement = TagInputConstants.MAX_TAGS_COUNT_REQUIREMENT;
        this.isSavePossible = false;
    }
    @ViewChild('tagInput') tagInput: ElementRef;
    currentTag: string;
    tags: string[];
    isSavePossible: boolean;
    unsatisfiedRequirements: number;

    @Output() areTagsValidEvent: EventEmitter<boolean>;

    distinctTagsRequirement: string;
    distinctTagsDivClass: string;

    minLengthRequirement: string;
    minLengthDivClass: string;

    maxLengthRequirement: string;
    maxLengthDivClass: string;

    noSpecialCharacterRequirement: string;
    noSpecialCharacterDivClass: string;

    maxTagsCountRequirement: string;
    maxTagsCountDivClass: string;

    addTag(tag: string): void {
        tag = tag.trim();
        if (this.validateTag(tag)) {
            this.tags.push(tag);
        }
        this.isSavePossible = false;
        this.tagInput.nativeElement.value = '';
        this.resetRequirements();
    }

    deleteTag(tag: string): void {
        const index = this.tags.indexOf(tag, 0);
        if (index > SaveDrawingConstants.TAG_NOT_FOUND) {
            this.tags.splice(index, 1);
        }
    }

    validateTag(tag: string): boolean {
        tag = tag.trim();
        this.unsatisfiedRequirements = 0;

        this.distinctTagsValidator(tag);
        this.minLengthTagsValidator(tag);
        this.maxLengthTagsValidator(tag);
        this.characterTagsValidator(tag);
        this.maxTagsValidator();

        const requirementViolated = this.unsatisfiedRequirements > 0;
        this.areTagsValidEvent.emit(!requirementViolated);
        this.isSavePossible = !requirementViolated;
        return !requirementViolated;
    }

    distinctTagsValidator(tag: string): void {
        this.distinctTagsDivClass = 'Satisfied';
        if (this.tags.includes(tag)) {
            this.distinctTagsDivClass = 'Failed';
            this.unsatisfiedRequirements++;
        }
    }

    minLengthTagsValidator(tag: string): void {
        this.minLengthDivClass = 'Satisfied';
        if (this.tagIsShorterThanMinLength(tag)) {
            this.minLengthDivClass = 'Failed';
            this.unsatisfiedRequirements++;
        }
    }

    maxLengthTagsValidator(tag: string): void {
        this.maxLengthDivClass = 'Satisfied';
        if (this.tagIsLongerThanMaxLength(tag)) {
            this.maxLengthDivClass = 'Failed';
            this.unsatisfiedRequirements++;
        }
    }

    characterTagsValidator(tag: string): void {
        this.noSpecialCharacterDivClass = 'Satisfied';
        if (this.tagHasSpecialCharacters(tag)) {
            this.noSpecialCharacterDivClass = 'Failed';
            this.unsatisfiedRequirements++;
        }
    }

    maxTagsValidator(): void {
        this.maxTagsCountDivClass = 'Satisfied';
        if (this.tagsHasReachedMaxCount()) {
            this.maxTagsCountDivClass = 'Failed';
            this.unsatisfiedRequirements++;
        }
    }

    resetRequirementsOnFocusOut(tag: string): void {
        if (this.tagIsShorterThanMinLength(tag)) {
            this.resetRequirements();
        }
    }

    resetRequirements(): void {
        this.distinctTagsDivClass = 'Unrequested';
        this.minLengthDivClass = 'Unrequested';
        this.maxLengthDivClass = 'Unrequested';
        this.noSpecialCharacterDivClass = 'Unrequested';
        this.maxTagsCountDivClass = 'Unrequested';
    }

    private tagIsShorterThanMinLength(tag: string): boolean {
        return tag.length < DatabaseConstants.MIN_TAG_LENGTH;
    }

    private tagIsLongerThanMaxLength(tag: string): boolean {
        return tag.length > DatabaseConstants.MAX_TAG_LENGTH;
    }

    private tagHasSpecialCharacters(tag: string): boolean {
        return !/^[\x00-\xFF]*$/.test(tag);
    }
    private tagsHasReachedMaxCount(): boolean {
        return this.tags.length === DatabaseConstants.MAX_TAGS_COUNT;
    }
}
