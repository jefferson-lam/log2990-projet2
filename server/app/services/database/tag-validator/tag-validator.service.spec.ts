import { TagValidatorService } from '@app/services/database/tag-validator/tag-validator.service';
import * as DatabaseConstants from '@common/validation/database-constants';
import { expect } from 'chai';

describe('Drawing database service', () => {
    let tagValidator: TagValidatorService;

    beforeEach(async () => {
        tagValidator = new TagValidatorService();
    });

    it('checkTagsValid should handle invalid tag amount error', () => {
        const testTags: string[] = [];
        for (let i = 0; i < DatabaseConstants.MAX_TAGS_COUNT + 1; i++) {
            testTags.push('test');
        }
        try {
            tagValidator.checkTagsValid(testTags);
        } catch (error) {
            expect((error as Error).message).to.include('Vous avez trop de tags');
        }
    });

    it('checkTagsValid should handle invalid tag max length error', () => {
        let testTag = '';
        for (let i = 0; i < DatabaseConstants.MAX_TAG_LENGTH + 1; i++) {
            testTag += 'g';
        }
        const testTags = [testTag];
        try {
            tagValidator.checkTagsValid(testTags);
        } catch (error) {
            expect((error as Error).message).to.include('Le tag est trop long');
        }
    });

    it('checkTagsValid should handle invalid tag min length error', () => {
        const testTags = ['', 'function'];
        try {
            tagValidator.checkTagsValid(testTags);
        } catch (error) {
            expect((error as Error).message).to.include('Le tag est trop court');
        }
    });

    it('checkTagsValid should handle ascii invalid character title error', () => {
        const testTags = [String.fromCharCode(35895), 'function'];
        try {
            tagValidator.checkTagsValid(testTags);
        } catch (error) {
            expect((error as Error).message).to.include('ne peut pas avoir de caractères spéciaux');
        }
    });
});
