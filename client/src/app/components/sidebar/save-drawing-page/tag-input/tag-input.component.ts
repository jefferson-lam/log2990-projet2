import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import * as SaveDrawingConstants from '@app/constants/save-drawing-constants';
import * as DatabaseConstants from '@common/validation/database-constants';

@Component({
    selector: 'app-tag-input',
    templateUrl: './tag-input.component.html',
    styleUrls: ['./tag-input.component.scss'],
})
export class TagInputComponent {
    @ViewChild('tagInput') tagInput: ElementRef;
    currentTag: string;
    tags: string[] = new Array();

    isSavePossible: boolean = false;
    @Output() areTagsValidEvent: EventEmitter<boolean> = new EventEmitter<boolean>();

    distinctTagsRequirement: string = 'Ne peut pas avoir deux étiquettes identiques.';
    distinctTagsDivClass: string;

    minLengthRequirement: string = `Doit avoir au moins ${DatabaseConstants.MIN_TAG_LENGTH} caractère.`;
    minLengthDivClass: string;

    maxLengthRequirement: string = `Doit avoir moins de ${DatabaseConstants.MAX_TAG_LENGTH} caractères.`;
    maxLengthDivClass: string;

    noSpecialCharacterRequirement: string = 'Ne peut pas contenir de caractères spéciaux.';
    noSpecialCharacterDivClass: string;

    maxTagsCountRequirement: string = `Ne peut pas avoir plus que ${DatabaseConstants.MAX_TAGS_COUNT} étiquettes.`;
    maxTagsCountDivClass: string;

    addTag(tag: string): void {
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
