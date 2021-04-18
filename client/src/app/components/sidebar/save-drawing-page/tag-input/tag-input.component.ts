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
        let requirementViolated = false;

        if (!this.validateDistinctTag(tag)) requirementViolated = true;
        if (!this.validateMinLength(tag)) requirementViolated = true;
        if (!this.validateMaxLength(tag)) requirementViolated = true;
        if (!this.validateAsciiOnly(tag)) requirementViolated = true;
        if (!this.validateMaxCount()) requirementViolated = true;

        // emit to save-drawing-page that tags aren't valid
        this.areTagsValidEvent.emit(!requirementViolated);
        this.isSavePossible = !requirementViolated;
        return !requirementViolated;
    }

    private validateMaxCount(): boolean {
        if (this.tags.length === DatabaseConstants.MAX_TAGS_COUNT) {
            this.maxTagsCountDivClass = 'Failed';
            return false;
        } else {
            this.maxTagsCountDivClass = 'Satisfied';
        }
        return true;
    }

    private validateDistinctTag(tag: string): boolean {
        if (this.tags.includes(tag)) {
            this.distinctTagsDivClass = 'Failed';
            return false;
        } else {
            this.distinctTagsDivClass = 'Satisfied';
        }
        return true;
    }

    private validateMinLength(tag: string): boolean {
        if (tag.length < DatabaseConstants.MIN_TAG_LENGTH) {
            this.minLengthDivClass = 'Failed';
            return false;
        } else {
            this.minLengthDivClass = 'Satisfied';
        }
        return true;
    }

    private validateMaxLength(tag: string): boolean {
        if (tag.length > DatabaseConstants.MAX_TAG_LENGTH) {
            this.maxLengthDivClass = 'Failed';
            return false;
        } else {
            this.maxLengthDivClass = 'Satisfied';
        }
        return true;
    }

    private validateAsciiOnly(tag: string): boolean {
        if (this.tagHasSpecialCharacters(tag)) {
            this.noSpecialCharacterDivClass = 'Failed';
            return false;
        } else {
            this.noSpecialCharacterDivClass = 'Satisfied';
        }
        return true;
    }

    private tagHasSpecialCharacters(tag: string): boolean {
        return !/^[\x00-\xFF]*$/.test(tag);
    }
}
