import { TitleValidatorService } from '@app/services/database/title-validator/title-validator.service';
import { expect } from 'chai';

describe('Drawing database service', () => {
    let titleValidator: TitleValidatorService;

    beforeEach(async () => {
        titleValidator = new TitleValidatorService();
    });

    it('checkTitleValid should handle invalid title min length error', () => {
        const testTitle = '';
        try {
            titleValidator.checkTitleValid(testTitle);
        } catch (error) {
            expect((error as Error).message).to.include('Le titre est trop court');
        }
    });

    it('checkTitleValid should handle invalid title max length error', () => {
        const testTitle = '123456789012345678901';
        try {
            titleValidator.checkTitleValid(testTitle);
        } catch (error) {
            expect((error as Error).message).to.include('Le titre est trop long');
        }
    });

    it('checkTitleValid should handle ascii invalid character title error', () => {
        const testTitle = String.fromCharCode(35895);
        try {
            titleValidator.checkTitleValid(testTitle);
        } catch (error) {
            expect((error as Error).message).to.include('Votre titre ne peut pas avoir de caractères spéciaux.');
        }
    });
});
