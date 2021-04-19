import { Component, EventEmitter, Output } from '@angular/core';
import * as TitleInputConstants from '@app/constants/title-input-constants';
import * as DatabaseConstants from '@common/validation/database-constants';

@Component({
    selector: 'app-title-input',
    templateUrl: './title-input.component.html',
    styleUrls: ['./title-input.component.scss'],
})
export class TitleInputComponent {
    @Output() isTitleValidEvent: EventEmitter<boolean>;
    title: string;
    unsatisfiedRequirements: number;

    minLengthRequirement: string;
    minLengthDivClass: string;

    maxLengthRequirement: string;
    maxLengthDivClass: string;

    noSpecialCharacterRequirement: string;
    noSpecialCharacterDivClass: string;

    constructor() {
        this.isTitleValidEvent = new EventEmitter<boolean>();
        this.minLengthRequirement = TitleInputConstants.MIN_LENGTH_REQUIREMENT;
        this.maxLengthRequirement = TitleInputConstants.MAX_LENGTH_REQUIREMENT;
        this.noSpecialCharacterRequirement = TitleInputConstants.NO_SPECIAL_CARACTER_REQUIREMENT;
        this.minLengthDivClass = 'Failed';
    }

    validateTitle(title: string): void {
        title = title.trim();
        let requirementViolated = false;

        if (!this.validateMinLength(title)) requirementViolated = true;
        if (!this.validateMaxLength(title)) requirementViolated = true;
        if (!this.validateAsciiOnly(title)) requirementViolated = true;

        this.isTitleValidEvent.emit(!requirementViolated);
        this.title = title;
    }

    private validateMinLength(title: string): boolean {
        if (title.length < DatabaseConstants.MIN_TITLE_LENGTH) {
            this.minLengthDivClass = 'Failed';
            return false;
        } else {
            this.minLengthDivClass = 'Satisfied';
        }
        return true;
    }

    private validateMaxLength(title: string): boolean {
        if (title.length > DatabaseConstants.MAX_TITLE_LENGTH) {
            this.maxLengthDivClass = 'Failed';
            return false;
        } else {
            this.maxLengthDivClass = 'Satisfied';
        }
        return true;
    }

    private validateAsciiOnly(title: string): boolean {
        if (this.titleHasSpecialCharacters(title)) {
            this.noSpecialCharacterDivClass = 'Failed';
            return false;
        } else {
            this.noSpecialCharacterDivClass = 'Satisfied';
        }
        return true;
    }

    private titleHasSpecialCharacters(title: string): boolean {
        return !/^[\x00-\xFF]*$/.test(title);
    }
}
