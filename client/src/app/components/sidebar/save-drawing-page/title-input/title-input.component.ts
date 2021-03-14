import { Component, EventEmitter, Output } from '@angular/core';
import * as DatabaseConstants from '@common/validation/database-constants';

@Component({
    selector: 'app-title-input',
    templateUrl: './title-input.component.html',
    styleUrls: ['./title-input.component.scss'],
})
export class TitleInputComponent {
    @Output() isTitleValidEvent: EventEmitter<boolean> = new EventEmitter<boolean>();
    title: string;

    minLengthRequirement: string = 'Un titre est obligatoire.';
    minLengthDivClass: string;

    maxLengthRequirement: string = `Doit avoir ${DatabaseConstants.MAX_TITLE_LENGTH} caractères ou moins.`;
    maxLengthDivClass: string;

    noSpecialCharacterRequirement: string = 'Ne peut pas contenir de caractères spéciaux.';
    noSpecialCharacterDivClass: string;

    validateTitle(title: string): void {
        let unsatisfiedRequirements = 0;
        // Change class for min length requirement
        if (this.tagIsShorterThanMinLength(title)) {
            this.minLengthDivClass = 'Failed';
            unsatisfiedRequirements++;
        } else {
            this.minLengthDivClass = 'Satisfied';
        }

        // Change class for max length requirement
        if (this.tagIsLongerThanMaxLength(title)) {
            this.maxLengthDivClass = 'Failed';
            unsatisfiedRequirements++;
        } else {
            this.maxLengthDivClass = 'Satisfied';
        }

        // Change class for ascii only characters requirement
        if (this.tagHasSpecialCharacters(title)) {
            this.noSpecialCharacterDivClass = 'Failed';
            unsatisfiedRequirements++;
        } else {
            this.noSpecialCharacterDivClass = 'Satisfied';
        }

        if (unsatisfiedRequirements > 0) {
            this.isTitleValidEvent.emit(false);
        } else {
            this.title = title;
            this.isTitleValidEvent.emit(true);
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
