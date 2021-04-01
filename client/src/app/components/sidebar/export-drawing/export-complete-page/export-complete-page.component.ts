import { Component, OnInit } from '@angular/core';
import { ImgurService } from '@app/services/imgur/imgur.service';

@Component({
    selector: 'app-export-complete-page',
    templateUrl: './export-complete-page.component.html',
    styleUrls: ['./export-complete-page.component.scss'],
})
export class ExportCompletePageComponent implements OnInit {
    imageUrl: string;

    constructor(private imgurService: ImgurService) {}

    ngOnInit(): void {
        this.imgurService.urlObservable.subscribe((url: string) => {
            console.log('complete-page:' + url);
            this.imageUrl = url;
            this.setUrlText();
        });
    }

    setUrlText() {
        let urlHeader = document.getElementById('urlLink') as HTMLElement;
        urlHeader.innerText = this.imageUrl;
    }
}
