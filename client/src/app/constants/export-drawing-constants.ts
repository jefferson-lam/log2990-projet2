export enum ExportProgress {
    CHOOSING_SETTING,
    COMPLETE,
    ERROR,
}

export enum PopUpToggle {
    NONE,
    COMPLETE,
    ERROR,
}

export const OK_STATUS = 200;

export const BAD_REQUEST = 400;

export const EXPORT_PROGRESS = 0;

export const URL = 1;

export type PostRequest = {
    method: string;
    headers: Headers;
    body: FormData;
};
