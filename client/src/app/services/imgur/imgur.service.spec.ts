import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import * as ExportDrawingConstants from '@app/constants/export-drawing-constants';
import { ImgurService } from './imgur.service';

describe('ImgurService', () => {
    let service: ImgurService;
    let httpMock: HttpTestingController;

    // tslint:disable:no-magic-numbers
    const goodDataMock = {
        data: {
            account_id: 0,
            account_url: '',
            ad_type: 0,
            ad_url: '',
            animated: false,
            bandwidth: 0,
            datetime: 1616804031,
            deletehash: 'JPlKmsg4gesCGRz',
            description: '',
            edited: '0',
            favorite: false,
            has_sound: false,
            height: 800,
            id: 'IKSivKJ',
            in_gallery: false,
            in_most_viral: false,
            is_ad: false,
            link: 'https://i.imgur.com/IKSivKJ.png',
            name: '',
            nsfw: false,
            section: '',
            size: 100,
            tags: [],
            title: '',
            type: 'image/png',
            views: 0,
            vote: '',
            width: 1000,
        },
        success: true,

        status: ExportDrawingConstants.OK_STATUS,
    };
    // tslint:enable:no-magic-numbers

    const badDataMock = {
        data: {
            account_id: 0,
            account_url: '',
            ad_type: 0,
            ad_url: '',
            animated: false,
            bandwidth: 0,
            datetime: 0,
            deletehash: '',
            description: '',
            edited: '0',
            favorite: false,
            has_sound: false,
            height: 0,
            id: '',
            in_gallery: false,
            in_most_viral: false,
            is_ad: false,
            link: '',
            name: '',
            nsfw: false,
            section: '',
            size: 0,
            tags: [''],
            title: '',
            type: 'image/png',
            views: 0,
            vote: '',
            width: 0,
        },
        success: false,
        status: ExportDrawingConstants.BAD_REQUEST,
    } as ExportDrawingConstants.ParsedType;

    const stringImg = 'uselessData,thisistheimage';

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [ImgurService],
        });
        service = TestBed.inject(ImgurService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should send image to imgur server', () => {
        const canvas = document.createElement('canvas');
        let image = 'data,';
        image += canvas.toDataURL();
        const imageName = 'name';

        service.exportDrawing(image, imageName);
        expect(service.isSendingRequest).toEqual(false);
    });

    it('should set exportProgress and url correctly if status = 200', () => {
        const setUrlFromResponseSpy = spyOn(service, 'setUrlFromResponse');
        const setExportProgressSpy = spyOn(service, 'setExportProgress');

        service.setDataFromResponse(goodDataMock);
        expect(setUrlFromResponseSpy).toHaveBeenCalled();
        expect(setExportProgressSpy).toHaveBeenCalledWith(ExportDrawingConstants.ExportProgress.COMPLETE);
    });

    it('should set exportProgress and url correctly if status != 200', () => {
        const setUrlFromResponseSpy = spyOn(service, 'setUrlFromResponse');
        const setExportProgressSpy = spyOn(service, 'setExportProgress');

        service.setDataFromResponse(badDataMock);
        expect(setUrlFromResponseSpy).not.toHaveBeenCalled();
        expect(service.url).toEqual('none');
        expect(setExportProgressSpy).toHaveBeenCalledWith(ExportDrawingConstants.ExportProgress.ERROR);
    });

    it('setUrlFromResponse should set url correctly', () => {
        service.setUrlFromResponse(goodDataMock);
        expect(service.serviceSettings[ExportDrawingConstants.URL]).toEqual('https://i.imgur.com/IKSivKJ.png');
    });

    it('setExportProgress should set exportProgress correctly', () => {
        service.setExportProgress(ExportDrawingConstants.ExportProgress.COMPLETE);
        expect(service.serviceSettings[ExportDrawingConstants.EXPORT_PROGRESS]).toEqual(ExportDrawingConstants.ExportProgress.COMPLETE);
    });

    it('imageStringSplit should split string correctly', () => {
        const result = service.imageStringSplit(stringImg);
        expect(result).toEqual('thisistheimage');
    });

    it('resetServiceSettings should split string correctly', () => {
        const nextSpy = spyOn(service.serviceSettingsSource, 'next');

        service.resetServiceSettings();

        expect(nextSpy).toHaveBeenCalled();
        expect(service.serviceSettings[0]).toEqual(ExportDrawingConstants.ExportProgress.CHOOSING_SETTING);
        expect(service.serviceSettings[1]).toEqual('none');
    });
});
