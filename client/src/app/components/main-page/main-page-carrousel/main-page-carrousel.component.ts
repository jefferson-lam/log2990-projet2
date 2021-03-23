import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { ImageFormat } from '@app/classes/image-format';
import * as CarouselConstants from '@app/constants/carousel-constants';
import { DatabaseService } from '@app/services/database/database.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { LocalServerService } from '@app/services/local-server/local-server.service';
import { Drawing } from '@common/communication/database';
import { Message } from '@common/communication/message';
import { ServerDrawing } from '@common/communication/server-drawing';
import * as DatabaseConstants from '@common/validation/database-constants';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
    selector: 'app-main-page-carrousel',
    templateUrl: './main-page-carrousel.component.html',
    styleUrls: ['./main-page-carrousel.component.scss'],
})
export class MainPageCarrouselComponent {
    @ViewChild('tagInput') tagInput: ElementRef<HTMLInputElement>;
    @Input() newTagAdded: boolean;
    @Input() deleteDrawingTrue: boolean;

    tagCtrl: FormControl = new FormControl();
    filteredTags: Observable<string[]>;

    existingTag: boolean = true;
    deleted: boolean = false;
    noValidDrawing: boolean = false;
    visible: boolean = true;
    selectable: boolean = true;
    removable: boolean = true;
    deleteClick: boolean;
    drawingLoading: boolean;
    imageNotInServer: boolean;
    imageCannotOpen: boolean;

    separatorKeysCodes: number[] = [ENTER, COMMA];
    allTags: string[] = [''];
    tagsInSearch: string[] = [];

    drawingCounter: number = 0;
    fetchedDrawingByTag: string[];
    showCasedDrawings: ImageFormat[];
    placeHolderDrawing: ImageFormat = new ImageFormat();
    previewDrawings: ImageFormat[] = [];

    constructor(private database: DatabaseService, private localServerService: LocalServerService, private drawingService: DrawingService) {
        this.filteredTags = this.tagCtrl.valueChanges.pipe(
            startWith(null),
            map((tag: string | null) => (tag ? this._filter(tag) : this.allTags.slice())),
        );
        this.resetShowcasedDrawings();
    }

    addTag(event: MatChipInputEvent): void {
        const input = event.input;
        const value = event.value;
        if (this.existingTag) {
            input.value = '';
        } else {
            if ((value || '').trim()) {
                this.tagsInSearch.push(value.trim());
            }
            if (input) {
                input.value = '';
            }

            this.tagCtrl.setValue(null);
        }

        this.resetShowcasedDrawings();
    }

    removeTag(tag: string): void {
        const index = this.tagsInSearch.indexOf(tag);

        if (index >= 0) {
            this.tagsInSearch.splice(index, 1);
        }
        this.resetShowcasedDrawings();
    }

    private resetShowcasedDrawings(): void {
        // Clean drawings currently in carousel
        this.previewDrawings = [];
        this.showCasedDrawings = [];
        this.drawingCounter = 0;
        this.drawingLoading = true;
        let drawingsWithMatchingTags: Drawing[];

        if (this.tagsInSearch.length > 0) {
            this.database.getDrawingsByTags(this.tagsInSearch).subscribe({
                next: (result: Message) => {
                    if (result.title === DatabaseConstants.ERROR_MESSAGE || result.body === JSON.stringify([])) {
                        this.existingTag = true;
                    } else {
                        this.existingTag = false;
                    }
                    drawingsWithMatchingTags = JSON.parse(result.body);
                },
                complete: () => {
                    this.drawingLoading = false;
                    this.noValidDrawing = drawingsWithMatchingTags.length === 0;
                    for (const drawing of drawingsWithMatchingTags) {
                        this.addDrawingToDisplay(drawing._id, drawing);
                    }

                    console.log(this.showCasedDrawings.length);
                    let currentCarrouselSize = this.showCasedDrawings.length;
                    while (currentCarrouselSize < CarouselConstants.MAX_CAROUSEL_SIZE) {
                        this.showCasedDrawings.push(this.placeHolderDrawing);
                        currentCarrouselSize++;
                    }
                },
            });
            return;
        }

        this.database.getDrawings().subscribe({
            next: (result: Message) => {
                drawingsWithMatchingTags = JSON.parse(result.body);
            },
            complete: () => {
                for (const drawing of drawingsWithMatchingTags) {
                    this.addDrawingToDisplay(drawing._id, drawing);
                }
                let currentCarrouselSize = drawingsWithMatchingTags.length;
                while (currentCarrouselSize < CarouselConstants.MAX_CAROUSEL_SIZE) {
                    this.showCasedDrawings.push(this.placeHolderDrawing);
                    currentCarrouselSize++;
                }

                this.drawingLoading = false;
            },
        });
    }

    private addDrawingToDisplay(id: string, drawing: Drawing): void {
        this.localServerService.getDrawingById(id).subscribe({
            next: (serverDrawing: ServerDrawing) => {
                if (serverDrawing !== null) {
                    const newPreviewDrawing: ImageFormat = { image: serverDrawing.image, name: drawing.title, tags: drawing.tags, id };
                    this.previewDrawings.push(newPreviewDrawing);
                    if (this.showCasedDrawings.length < CarouselConstants.MAX_CAROUSEL_SIZE) {
                        this.showCasedDrawings.push(newPreviewDrawing);
                    }
                }
            },
        });
    }

    showcasePreviousDrawing(): void {
        // Determine new drawingCounter value
        if (this.drawingCounter === 0) {
            this.drawingCounter = this.previewDrawings.length - 1;
        } else {
            this.drawingCounter--;
        }
        this.showCasedDrawings.pop();
        this.showCasedDrawings.unshift(this.previewDrawings[this.drawingCounter]);
    }

    showcaseNextDrawing(): void {
        let newDrawingIndex: number;
        if (this.drawingCounter + this.showCasedDrawings.length >= this.previewDrawings.length) {
            newDrawingIndex = (this.drawingCounter + this.showCasedDrawings.length) % this.previewDrawings.length;
        } else {
            newDrawingIndex = this.drawingCounter + this.showCasedDrawings.length;
        }
        this.showCasedDrawings.shift();
        this.showCasedDrawings.push(this.previewDrawings[newDrawingIndex]);
        this.drawingCounter++;
        if (this.drawingCounter > this.previewDrawings.length - 1) {
            this.drawingCounter = 0;
        }
    }

    deleteDrawing(): void {
        const indexToDelete = this.previewDrawings.length > 1 ? 1 : 0;
        const idDrawingToDelete = this.showCasedDrawings[indexToDelete].id;
        this.database.dropDrawing(idDrawingToDelete).subscribe({
            next: (result) => {
                console.log('@Hee-Min, Delete method in carrousel in progress: ' + result);
            },
        });
        this.showCasedDrawings.splice(1, 1);
        this.previewDrawings.splice((this.drawingCounter + 1) % this.previewDrawings.length, 1);
        this.resetShowcasedDrawings();
    }

    openEditorWithDrawing(dataUrl: string): void {
        this.drawingService.drawSavedImage(dataUrl);
    }

    private _filter(value: string): string[] {
        const filterValue = value.toLowerCase();
        return this.allTags.filter((tag) => tag.toLowerCase().indexOf(filterValue) === 0);
    }
}
