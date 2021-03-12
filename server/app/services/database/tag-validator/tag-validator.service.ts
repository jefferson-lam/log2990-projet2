import { ValidatorService } from '@app/services/database/validator/validator.service';
import { Message } from '@common/communication/message';
import * as DatabaseConstants from '@common/validation/database-constants';
import { injectable } from 'inversify';

@injectable()
export class TagValidatorService extends ValidatorService {
    checkTagsValid(tags: string[]): Message {
        const validation = { title: DatabaseConstants.SUCCESS_MESSAGE, body: '' };
        const checkTagsCountAboveMax = this.checkTagsCountAboveMax(tags);
        if (this.isMessageError(checkTagsCountAboveMax)) {
            validation.title = DatabaseConstants.ERROR_MESSAGE;
            validation.body += checkTagsCountAboveMax.body;
            throw new Error(validation.body);
        }
        let errorCount = 0;
        for (const tag of tags) {
            const tagCheck = this.checkTagValid(tag);
            if (this.isMessageError(tagCheck)) {
                validation.body += tagCheck.body;
                errorCount++;
            }
        }
        if (errorCount > 0) {
            validation.title = DatabaseConstants.ERROR_MESSAGE;
            throw new Error(validation.body);
        }

        return validation;
    }

    private checkTagsCountAboveMax(tags: string[]): Message {
        const validation: Message = { title: DatabaseConstants.SUCCESS_MESSAGE, body: '' };
        if (tags.length > DatabaseConstants.MAX_TAGS_COUNT) {
            validation.title = DatabaseConstants.ERROR_MESSAGE;
            validation.body = `Vous avez trop de tags. Vous en avez ${tags.length}. Le maximum est de ${DatabaseConstants.MAX_TAGS_COUNT}`;
        }
        return validation;
    }

    private checkTagValid(tag: string): Message {
        const validation: Message = { title: DatabaseConstants.SUCCESS_MESSAGE, body: '' };
        const minTagValidation: Message = this.checkViolationTagMinLength(tag);
        const maxTagValidation: Message = this.checkViolationTagMaxLength(tag);
        const asciiTagValidation: Message = this.checkViolationTagAscii(tag);
        let errorCount = 0;
        if (this.isMessageError(minTagValidation)) {
            validation.body += minTagValidation.body;
            errorCount++;
        }
        if (this.isMessageError(maxTagValidation)) {
            validation.body += maxTagValidation.body;
            errorCount++;
        }
        if (this.isMessageError(asciiTagValidation)) {
            validation.body += asciiTagValidation.body;
            errorCount++;
        }
        if (errorCount > 0) {
            validation.title = DatabaseConstants.ERROR_MESSAGE;
        }
        return validation;
    }

    private checkViolationTagMinLength(tag: string): Message {
        const validation: Message = { title: DatabaseConstants.SUCCESS_MESSAGE, body: '' };
        if (tag.length < DatabaseConstants.MIN_TAG_LENGTH) {
            validation.title = DatabaseConstants.ERROR_MESSAGE;
            validation.body = `Le tag est trop court. Doit avoir une longueur minimum de ${DatabaseConstants.MIN_TAG_LENGTH} caractères`;
        }
        return validation;
    }

    private checkViolationTagMaxLength(tag: string): Message {
        const validation: Message = { title: DatabaseConstants.SUCCESS_MESSAGE, body: '' };
        if (tag.length > DatabaseConstants.MAX_TAG_LENGTH) {
            validation.title = DatabaseConstants.ERROR_MESSAGE;
            validation.body = `Le tag est trop long. Doit avoir une longeur maximum de ${DatabaseConstants.MIN_TAG_LENGTH}`;
        }
        return validation;
    }

    private checkViolationTagAscii(tag: string): Message {
        const validation: Message = { title: DatabaseConstants.SUCCESS_MESSAGE, body: '' };
        if (!/^[\x00-\xFF]*$/.test(tag)) {
            validation.title = DatabaseConstants.ERROR_MESSAGE;
            validation.body = `Tag ${tag} ne peut pas avoir de caractères spéciaux.\n`;
        }
        return validation;
    }
}
