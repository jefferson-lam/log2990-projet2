import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'app-export-complete-page',
    templateUrl: './export-complete-page.component.html',
    styleUrls: ['./export-complete-page.component.scss'],
})
export class ExportCompletePageComponent implements OnInit {
    @Input() imageUrl: string;

    constructor() {}

    ngOnInit(): void {
        this.setUrlText();
    }

    setUrlText() {
        let urlHeader = document.getElementById('urlLink') as HTMLElement;
        urlHeader.innerText = this.imageUrl;
        console.log(this.imageUrl);
    }
}
