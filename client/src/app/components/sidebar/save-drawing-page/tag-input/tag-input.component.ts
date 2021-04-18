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
    @ViewChild('tagInput') tagInput: ElementRef;
    currentTag: string;
    tags: string[];

    isSavePossible: boolean;
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

    constructor() {
        this.tags = new Array();
        this.isSavePossible = false;
        this.areTagsValidEvent = new EventEmitter<boolean>();
        this.distinctTagsRequirement = TagInputConstants.DISTINCT_TAGS_REQUIREMENT;
        this.minLengthRequirement = TagInputConstants.MIN_LENGTH_REQUIREMENT;
        this.maxLengthRequirement = TagInputConstants.MAX_LENGTH_REQUIREMENT;
        this.noSpecialCharacterRequirement = TagInputConstants.NO_SPECIAL_CARACTER_REQUIREMENT;
        this.maxTagsCountRequirement = TagInputConstants.MAX_TAGS_COUNT_REQUIREMENT;
    }

    addTag(tag: string): void {
        tag = tag.trim();
        if (this.validateTag(tag)) {
            this.tags.push(tag);
        }
        this.tagInput.nativeElement.value = '';
    }

    deleteTag(tag: string): void {
        const index = this.tags.indexOf(tag, 0);
        if (index > SaveDrawingConstants.TAG_NOT_FOUND) {
            this.tags.splice(index, 1);
        }
    }

    validateTag(tag: string): boolean {
        tag = tag.trim();
        let unsatisfiedRequirements = 0;
        // Change class for distinct tags requirement
        if (this.tags.includes(tag)) {
            this.distinctTagsDivClass = 'Failed';
            unsatisfiedRequirements++;
        } else {
            this.distinctTagsDivClass = 'Satisfied';
        }

        // Change class for min length requirement
        if (this.tagIsShorterThanMinLength(tag)) {
            this.minLengthDivClass = 'Failed';
            unsatisfiedRequirements++;
        } else {
            this.minLengthDivClass = 'Satisfied';
        }

        // Change class for max length requirement
        if (this.tagIsLongerThanMaxLength(tag)) {
            this.maxLengthDivClass = 'Failed';
            unsatisfiedRequirements++;
        } else {
            this.maxLengthDivClass = 'Satisfied';
        }

        // Change class for ascii only characters requirement
        if (this.tagHasSpecialCharacters(tag)) {
            this.noSpecialCharacterDivClass = 'Failed';
            unsatisfiedRequirements++;
        } else {
            this.noSpecialCharacterDivClass = 'Satisfied';
        }

        // Change class for max tags count requirement
        if (this.tagsHasReachedMaxCount()) {
            this.maxTagsCountDivClass = 'Failed';
            unsatisfiedRequirements++;
        } else {
            this.maxTagsCountDivClass = 'Satisfied';
        }

        const requirementViolated = unsatisfiedRequirements > 0;
        // emit to save-drawing-page that tags aren't valid
        this.areTagsValidEvent.emit(!requirementViolated);
        this.isSavePossible = !requirementViolated;
        return !requirementViolated;
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
