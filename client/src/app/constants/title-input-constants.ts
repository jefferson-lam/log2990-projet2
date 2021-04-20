import * as DatabaseConstants from '@common/validation/database-constants';

export const MIN_LENGTH_REQUIREMENT = 'Un titre est obligatoire.';

export const MAX_LENGTH_REQUIREMENT = `Doit avoir ${DatabaseConstants.MAX_TITLE_LENGTH} caractères ou moins.`;

export const NO_SPECIAL_CARACTER_REQUIREMENT = 'Ne peut pas contenir de caractères spéciaux.';
