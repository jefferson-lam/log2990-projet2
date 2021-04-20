import * as DatabaseConstants from '@common/validation/database-constants';

export const DISTINCT_TAGS_REQUIREMENT = 'Ne peut pas avoir deux étiquettes identiques.';

export const MIN_LENGTH_REQUIREMENT = `Doit avoir au moins ${DatabaseConstants.MIN_TAG_LENGTH} caractère.`;

export const MAX_LENGTH_REQUIREMENT = `Doit avoir moins de ${DatabaseConstants.MAX_TAG_LENGTH} caractères.`;

export const NO_SPECIAL_CARACTER_REQUIREMENT = 'Ne peut pas contenir de caractères spéciaux.';

export const MAX_TAGS_COUNT_REQUIREMENT = `Ne peut pas avoir plus que ${DatabaseConstants.MAX_TAGS_COUNT} étiquettes.`;
