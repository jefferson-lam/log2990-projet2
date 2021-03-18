import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { ImageFormat } from '@app/classes/image-format';
import * as CarouselConstants from '@app/constants/carousel-constants';
import { DatabaseService } from '@app/services/database/database.service';
import { LocalServerService } from '@app/services/local-server/local-server.service';
import { Drawing } from '@common/communication/database';
import { Message } from '@common/communication/message';
import { ServerDrawing } from '@common/communication/server-drawing';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
    selector: 'app-main-page-carrousel',
    templateUrl: './main-page-carrousel.component.html',
    styleUrls: ['./main-page-carrousel.component.scss'],
})
export class MainPageCarrouselComponent implements OnInit {
    @ViewChild('tagInput') tagInput: ElementRef<HTMLInputElement>;
    @Input() newTagAdded: boolean;
    @Input() deleteDrawingTrue: boolean;

    tagCtrl: FormControl = new FormControl();
    filteredTags: Observable<string[]>;

    visible: boolean = true;
    selectable: boolean = true;
    removable: boolean = true;
    deleteClick: boolean;

    separatorKeysCodes: number[] = [ENTER, COMMA];
    allTags: string[] = [''];
    tagValue: string[] = [];

    deleted: boolean = false;
    drawingCounter: number = 0;
    fetchedDrawingByTag: string[];
    showCasedDrawings: ImageFormat[];

    previewDrawing: ImageFormat[] = [
        // { image: 'https://secure.img1-fg.wfcdn.com/im/27616071/compr-r85/3125/31254990/dalmatian-puppy-statue.jpg', name: 'patate' },
        // { image: 'https://i.pinimg.com/originals/8c/7a/e2/8c7ae28680cd917192d6de5ef3d8cd7f.jpg', name: 'face' },
        // { image: 'https://wallpapercave.com/wp/wp2473639.jpg', name: 'lilo' },
        // { image: 'https://en.bcdn.biz/Images/2016/11/15/776342f0-86f5-4522-84c9-a02d6b11c766.jpg', name: 'tomato' },
        // { image: 'https://images.amcnetworks.com/bbcamerica.com/wp-content/uploads/2013/06/Toast.jpg', name: 'hello' },
        // { image: 'https://www.petmd.com/sites/default/files/styles/article_image/public/petmd-puppy-weight.jpg?itok=IwMOwGSX', name: 'carotte' },
    ];

    constructor(private database: DatabaseService, private localServerService: LocalServerService) {
        this.filteredTags = this.tagCtrl.valueChanges.pipe(
            startWith(null),
            map((tag: string | null) => (tag ? this._filter(tag) : this.allTags.slice())),
        );
        this.resetShowcasedDrawings();
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
        this.resetShowcasedDrawings();
    }

    removeTag(tag: string): void {
        const index = this.tagValue.indexOf(tag);

        if (index >= 0) {
            this.tagValue.splice(index, 1);
        }
        this.resetShowcasedDrawings();
    }

    resetShowcasedDrawings(): void {
        // Clean drawings currently in carousel
        this.previewDrawing = [];
        this.showCasedDrawings = [];
        this.drawingCounter = 0;

        const tags: string[] = this.tagValue;
        let drawingsWithMatchingTags: Drawing[];
        if (tags.length > 0) {
            this.database.getDrawingsByTags(tags).subscribe({
                next: (result: Message) => {
                    drawingsWithMatchingTags = JSON.parse(result.body);
                },
                complete: () => {
                    for (const drawing of drawingsWithMatchingTags) {
                        this.addDrawingToDisplay(drawing._id, drawing);
                    }
                },
            });
        } else {
            this.database.getDrawings().subscribe({
                next: (result: Message) => {
                    drawingsWithMatchingTags = JSON.parse(result.body);
                },
                complete: () => {
                    for (const drawing of drawingsWithMatchingTags) {
                        this.addDrawingToDisplay(drawing._id, drawing);
                    }
                },
            });
        }
    }

    private addDrawingToDisplay(id: string, drawing: Drawing): void {
        this.localServerService.getDrawingById(id).subscribe({
            next: (serverDrawing: ServerDrawing) => {
                if (serverDrawing !== null) {
                    const newPreviewDrawing: ImageFormat = { image: serverDrawing.image, name: drawing.title, tags: drawing.tags };
                    this.previewDrawing.push(newPreviewDrawing);
                    if (this.showCasedDrawings.length < CarouselConstants.MAX_CAROUSEL_SIZE) {
                        this.showCasedDrawings.push(newPreviewDrawing);
                    }
                }
            },
        });
    }

    showcasePrevDrawing(): void {
        if (this.previewDrawing.length <= CarouselConstants.MAX_CAROUSEL_SIZE) return;
        this.showCasedDrawings.pop();

        // Determine new drawingCounter value
        if (this.drawingCounter === 0) {
            this.drawingCounter = this.previewDrawing.length - 1;
        } else {
            this.drawingCounter--;
        }
        this.showCasedDrawings.unshift(this.previewDrawing[this.drawingCounter]);
    }

    showcaseNextDrawing(): void {
        if (this.previewDrawing.length <= CarouselConstants.MAX_CAROUSEL_SIZE) return;
        this.showCasedDrawings.shift();
        let newDrawingIndex: number;
        if (this.drawingCounter + CarouselConstants.MAX_CAROUSEL_SIZE >= this.previewDrawing.length) {
            newDrawingIndex = (this.drawingCounter + CarouselConstants.MAX_CAROUSEL_SIZE) % this.previewDrawing.length;
        } else {
            newDrawingIndex = this.drawingCounter + CarouselConstants.MAX_CAROUSEL_SIZE;
        }
        this.showCasedDrawings.push(this.previewDrawing[newDrawingIndex]);
        this.drawingCounter++;
        if (this.drawingCounter > this.previewDrawing.length - 1) {
            this.drawingCounter = 0;
        }
    }

    deleteDrawing(): void {
        this.previewDrawing.splice(-1, 1);
    }

    openDrawingEditor(): void {
        console.log('opens_canvas_with_drawing');
    }

    private _filter(value: string): string[] {
        const filterValue = value.toLowerCase();
        return this.allTags.filter((tag) => tag.toLowerCase().indexOf(filterValue) === 0);
    }
}
