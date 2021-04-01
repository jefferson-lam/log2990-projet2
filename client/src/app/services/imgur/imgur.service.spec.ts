import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ImgurService } from './imgur.service';

describe('ImgurService', () => {
    let service: ImgurService;
    let httpMock: HttpTestingController;
    //let url: string;
    const dataMock = {
        data: {
            id: 'IKSivKJ',
            title: null,
            description: null,
            datetime: 1616804031,
            type: 'image/png',
            animated: false,
            width: 1000,
            height: 800,
            size: 34254,
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
            deletehash: 'JPlKmsg4gesCGRz',
            name: '',
            link: 'https://i.imgur.com/IKSivKJ.png',
        },
        success: true,
        status: 200,
    };

    const stringImg = 'uselessData,thisistheimage';
    //const formData = new FormData();

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
        });
        service = TestBed.inject(ImgurService);
        httpMock = TestBed.inject(HttpTestingController);
        // url = service['IMGUR_URL'];
    });

    afterEach(() => {
        httpMock.verify();
    });

    // beforeAll(() => spyOn(window, 'fetch'));

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('exportDrawing should call fetch', () => {
        const fetchSpy = spyOn(window, 'fetch');

        service.exportDrawing(stringImg, 'name');
        expect(fetchSpy).toHaveBeenCalled();
    });

    // it('exportDrawing should do fetch request', () => {
    //     const headers = new Headers();
    //     headers.append('Authorization', 'Client-ID clientid');
    //     const formData = new FormData();
    //     formData.append('image', 'thisistheimage');

    //     let requestOptions = {
    //         method: 'POST',
    //         headers: headers,
    //         body: formData,
    //     };
    //     window.fetch('www.mockurl.com', requestOptions);

    //     expect('lolxd').service.exportDrawing(stringImg, 'name');
    //     expect().toEqual('https://i.imgur.com/IKSivKJ.png');
    //     expect(nextSpy).toHaveBeenCalled();
    //     expect(window.fetch).toHaveBeenCalledWith('/exportDrawing');
    //     expect(window.fetch).toHaveBeenCalledTimes(1);
    //     expect(await screen.findByText(/success/i)).toBeInTheDocument();
    // });

    it('setUrlFromResponse should set url correctly', () => {
        const nextSpy = spyOn(service.urlSource, 'next');

        service.setUrlFromResponse(dataMock);
        expect(service.url).toEqual('https://i.imgur.com/IKSivKJ.png');
        expect(nextSpy).toHaveBeenCalled();
    });

    it('setExportProgress should set exportProgress correctly', () => {
        const nextSpy = spyOn(service.exportProgressSource, 'next');

        service.setExportProgress(1);
        expect(service.exportProgress).toEqual(1);
        expect(nextSpy).toHaveBeenCalled();
    });

    it('imageStringSplit should split string correctly', () => {
        let result = service.imageStringSplit(stringImg);
        expect(result).toEqual('thisistheimage');
    });
});
