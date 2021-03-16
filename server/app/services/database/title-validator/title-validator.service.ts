import { ValidatorService } from '@app/services/database/validator/validator.service';
import { Message } from '@common/communication/message';
import * as DatabaseConstants from '@common/validation/database-constants';
import { injectable } from 'inversify';

@injectable()
export class TitleValidatorService extends ValidatorService {
    // Returns message with 'Error' as title if title is invalid with reasons in the body.
    // If title is valid, return success title with empty body.
    checkTitleValid(title: string): Message {
        const validation = { title: DatabaseConstants.ERROR_MESSAGE, body: '' };
        const minTitleValidation: Message = this.checkViolationTitleMinLength(title);
        const maxTitleValidation: Message = this.checkViolationTitleMaxLength(title);
        const asciiTitleValidation: Message = this.checkViolationTitleAscii(title);
        let errorCount = 0;
        if (this.isMessageError(minTitleValidation)) {
            validation.body += minTitleValidation.body;
            errorCount++;
        }
        if (this.isMessageError(maxTitleValidation)) {
            validation.body += maxTitleValidation.body;
            errorCount++;
        }
        if (this.isMessageError(asciiTitleValidation)) {
            validation.body += asciiTitleValidation.body;
            errorCount++;
        }
        if (errorCount > 0) {
            validation.title = DatabaseConstants.ERROR_MESSAGE;
            throw new Error(validation.body);
        }
        return validation;
    }

    private checkViolationTitleMinLength(title: string): Message {
        const validation: Message = { title: DatabaseConstants.SUCCESS_MESSAGE, body: '' };
        if (title.length < DatabaseConstants.MIN_TITLE_LENGTH) {
            validation.title = DatabaseConstants.ERROR_MESSAGE;
            validation.body = `Le titre est trop court. Votre titre de longueur ${title.length} est plus court que le minimum de ${DatabaseConstants.MIN_TITLE_LENGTH}.\n`;
        }
        return validation;
    }

    private checkViolationTitleMaxLength(title: string): Message {
        const validation: Message = { title: DatabaseConstants.SUCCESS_MESSAGE, body: '' };
        if (title.length > DatabaseConstants.MAX_TITLE_LENGTH) {
            validation.title = DatabaseConstants.ERROR_MESSAGE;
            validation.body = `Le titre est trop long. Votre titre est de longueur ${title.length}. Le maximum est de ${DatabaseConstants.MAX_TITLE_LENGTH}.\n`;
        }
        return validation;
    }

    private checkViolationTitleAscii(title: string): Message {
        const validation: Message = { title: DatabaseConstants.SUCCESS_MESSAGE, body: '' };
        if (!/^[\x00-\xFF]*$/.test(title)) {
            validation.title = DatabaseConstants.ERROR_MESSAGE;
            validation.body = 'Votre titre ne peut pas avoir de caractères spéciaux.\n';
        }
        return validation;
    }
}
