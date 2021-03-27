import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'app-export-complete-page',
    templateUrl: './export-complete-page.component.html',
    styleUrls: ['./export-complete-page.component.scss'],
})
export class ExportCompletePageComponent implements OnInit {
    @Input() reason: string;
    @Input() imageUrl: string;

    constructor() {}

    ngOnInit(): void {}
}
