import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-save-drawing',
    templateUrl: './save-drawing.component.html',
    styleUrls: ['./save-drawing.component.scss'],
})
export class SaveDrawingComponent implements OnInit {
    tags: Array<string> = new Array();
    constructor() {}

    ngOnInit(): void {}

    addTag(tag: string): void {
        this.tags.push(tag);
        console.log(this.tags);
    }
}
