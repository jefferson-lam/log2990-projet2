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
        this.unsatisfiedRequirements = 0;

        this.minLengthTitleValidator(title);
        this.maxLengthTitleValidator(title);
        this.characterTitleValidator(title);

        if (this.unsatisfiedRequirements > 0) {
            this.isTitleValidEvent.emit(false);
        } else {
            this.title = title;
            this.isTitleValidEvent.emit(true);
        }
    }

    minLengthTitleValidator(title: string): void {
        this.minLengthDivClass = 'Satisfied';
        if (this.tagIsShorterThanMinLength(title)) {
            this.minLengthDivClass = 'Failed';
            this.unsatisfiedRequirements++;
        }
    }
    maxLengthTitleValidator(title: string): void {
        this.maxLengthDivClass = 'Satisfied';
        if (this.tagIsLongerThanMaxLength(title)) {
            this.maxLengthDivClass = 'Failed';
            this.unsatisfiedRequirements++;
        }
    }
    characterTitleValidator(title: string): void {
        this.noSpecialCharacterDivClass = 'Satisfied';
        if (this.tagHasSpecialCharacters(title)) {
            this.noSpecialCharacterDivClass = 'Failed';
            this.unsatisfiedRequirements++;
        }
    }

    private tagIsShorterThanMinLength(title: string): boolean {
        return title.length < DatabaseConstants.MIN_TITLE_LENGTH;
    }

    private tagIsLongerThanMaxLength(title: string): boolean {
        return title.length > DatabaseConstants.MAX_TITLE_LENGTH;
    }

    private tagHasSpecialCharacters(title: string): boolean {
        return !/^[\x00-\xFF]*$/.test(title);
    }
}
