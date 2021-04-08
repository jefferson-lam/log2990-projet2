import { Component, OnInit } from '@angular/core';
import { ImgurService } from '@app/services/imgur/imgur.service';

@Component({
    selector: 'app-export-complete-page',
    templateUrl: './export-complete-page.component.html',
    styleUrls: ['./export-complete-page.component.scss'],
})
export class ExportCompletePageComponent implements OnInit {
    imageUrl: string;

    constructor(private imgurService: ImgurService) {
        this.imgurService = imgurService;
    }

    ngOnInit(): void {
        this.imgurService.serviceSettingsObservable.subscribe((serviceSettings: [number, string]) => {
            this.imageUrl = serviceSettings[1];
            this.setUrlText();
        });
    }

    setUrlText(): void {
        const urlHeader = document.getElementById('urlLink') as HTMLElement;
        urlHeader.innerText = this.imageUrl;
    }

    resetValues(): void {
        this.imgurService.resetServiceSettings();
    }
}
