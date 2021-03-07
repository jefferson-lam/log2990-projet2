import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-tag-manager',
    templateUrl: './tag-manager.component.html',
    styleUrls: ['./tag-manager.component.scss'],
})
export class TagManagerComponent implements OnInit {
    tags: Array<string> = new Array();
    constructor() {}

    ngOnInit(): void {}

    checkIsTagValid(tag: string): boolean {
        // TODO: Add check for tag
        if (this.tags.indexOf(tag) != -1) {
            return false;
        }
        return true;
    }

    addTag(tag: string): void {
        if (this.checkIsTagValid(tag)) {
            this.tags.push(tag);
        }
        console.log(this.tags);
    }

    deleteTag(tag: string): void {
        const index = this.tags.indexOf(tag, 0);
        if (index > -1) {
            this.tags.splice(index, 1);
        }
    }
}
