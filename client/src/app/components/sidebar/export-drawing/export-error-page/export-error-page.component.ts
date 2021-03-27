import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'app-export-error-page',
    templateUrl: './export-error-page.component.html',
    styleUrls: ['./export-error-page.component.scss'],
})
export class ExportErrorPageComponent implements OnInit {
    @Input() reason: string;

    constructor() {}

    ngOnInit(): void {}
}
