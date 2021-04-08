import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import * as ExportDrawingConstants from '@app/constants/export-drawing-constants';
import { ImgurService } from './imgur.service';

fdescribe('ImgurService', () => {
    let service: ImgurService;
    let httpMock: HttpTestingController;

    const goodDataMock = {
        data: {
            id: 'IKSivKJ',
            title: null,
            description: null,
            type: 'image/png',
            animated: false,
            views: 0,
            bandwidth: 0,
            vote: null,
            favorite: false,
            nsfw: null,
            section: null,
            account_url: null,
            account_id: 0,
            is_ad: false,
            in_most_viral: false,
            has_sound: false,
            tags: [],
            ad_type: 0,
            ad_url: '',
            edited: '0',
            in_gallery: false,
            name: '',
            link: 'https://i.imgur.com/IKSivKJ.png',
        },
        success: true,

        status: 200,
    };

    const badDataMock = {
        data: {
            id: null,
            title: null,
            description: null,
        },
        success: false,
        // tslint:disable-next-line:no-magic-numbers
        status: 400,
    };

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

        service.exportDrawing(image);
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
        expect(service.serviceSettings[1]).toEqual('https://i.imgur.com/IKSivKJ.png');
    });

    it('setExportProgress should set exportProgress correctly', () => {
        service.setExportProgress(ExportDrawingConstants.ExportProgress.COMPLETE);
        expect(service.serviceSettings[0]).toEqual(ExportDrawingConstants.ExportProgress.COMPLETE);
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
