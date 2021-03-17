import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
    selector: 'app-main-page-carrousel',
    templateUrl: './main-page-carrousel.component.html',
    styleUrls: ['./main-page-carrousel.component.scss'],
})
export class MainPageCarrouselComponent {
    tagCtrl = new FormControl();
    filteredTags: Observable<string[]>;

    visible: boolean = true;
    selectable: boolean = true;
    removable: boolean = true;

    separatorKeysCodes: number[] = [ENTER, COMMA];
    allTags: string[] = [''];
    tagValue: string[] = [];

    @ViewChild('tagInput') tagInput: ElementRef<HTMLInputElement>;
    constructor() {
        this.filteredTags = this.tagCtrl.valueChanges.pipe(
            startWith(null),
            map((tag: string | null) => (tag ? this._filter(tag) : this.allTags.slice())),
        );
    }

    addTag(event: MatChipInputEvent): void {
        const input = event.input;
        const value = event.value;

        if ((value || '').trim()) {
            this.tagValue.push(value.trim());
        }

        if (input) {
            input.value = '';
        }

        this.tagCtrl.setValue(null);
    }

    removeTag(tag: string): void {
        const index = this.tagValue.indexOf(tag);

        if (index >= 0) {
            this.tagValue.splice(index, 1);
        }
    }

    private _filter(value: string): string[] {
        const filterValue = value.toLowerCase();
        return this.allTags.filter((tag) => tag.toLowerCase().indexOf(filterValue) === 0);
    }
}
