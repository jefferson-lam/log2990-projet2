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

export type ParsedType = {
    data: DataType;
    status: number;
    success: boolean;
};

export type DataType = {
    account_id: number;
    account_url: string;
    ad_type: number;
    ad_url: string;
    animated: boolean;
    bandwidth: number;
    datetime: number;
    deletehash: string;
    description: string;
    edited: string;
    favorite: boolean;
    has_sound: boolean;
    height: number;
    id: string;
    in_gallery: boolean;
    in_most_viral: boolean;
    is_ad: boolean;
    link: string;
    name: string;
    nsfw: boolean;
    section: string;
    size: number;
    tags: string[];
    title: string;
    type: string;
    views: number;
    vote: string;
    width: number;
};
