import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { MatChipInputEvent } from '@angular/material/chips';
import { ImageFormat } from '@app/classes/image-format';
import * as CarouselConstants from '@app/constants/carousel-constants';
import { DatabaseService } from '@app/services/database/database.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { LocalServerService } from '@app/services/local-server/local-server.service';
import { Drawing } from '@common/communication/database';
import { Message } from '@common/communication/message';
import { ServerDrawing } from '@common/communication/server-drawing';
import * as ServerConstants from '@common/validation/server-constants';

@Component({
    selector: 'app-main-page-carrousel',
    templateUrl: './main-page-carrousel.component.html',
    styleUrls: ['./main-page-carrousel.component.scss'],
})
export class MainPageCarrouselComponent {
    @ViewChild('tagInput') tagInput: ElementRef<HTMLInputElement>;
    @Input() newTagAdded: boolean;
    @Input() deleteDrawingTrue: boolean;

    tagErrorPresent: boolean = false;
    tagErrorMessage: string = '';
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
        this.resetShowcasedDrawings();
    }

    addTag(event: MatChipInputEvent): void {
        const input = event.input;
        const tag = event.value.trim();
        input.value = '';

        if (this.tagsInSearch.includes(tag)) {
            this.setErrorInTag('Étiquette déjà incluse. Veuillez mettre une étiquette différente.');
            return;
        }

        if (tag === '') {
            this.tagErrorPresent = false;
        } else if (this.checkIfTagExists(tag)) {
            this.tagErrorPresent = false;
            this.tagsInSearch.push(tag);

            this.resetShowcasedDrawings();
        } else {
            this.setErrorInTag('Étiquette non trouvée parmi les dessins. Veuillez ajouter une étiquette existante.');
        }
    }

    removeTag(tag: string): void {
        const index = this.tagsInSearch.indexOf(tag);
        this.tagErrorPresent = false;
        if (index >= 0) {
            this.tagsInSearch.splice(index, 1);
        }
        this.resetShowcasedDrawings();
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

    async deleteDrawing(): Promise<void> {
        const indexToDelete = this.previewDrawings.length > 1 ? 1 : 0;
        const idDrawingToDelete = this.showCasedDrawings[indexToDelete].id;
        try {
            const result: Message = await this.database.dropDrawing(idDrawingToDelete).toPromise();
            if (result === undefined || result.title === ServerConstants.ERROR_MESSAGE) {
                const errorMessage: Message = {
                    title: ServerConstants.ERROR_MESSAGE,
                    body: 'Image not in server',
                };
                throw errorMessage;
            }
            this.imageNotInServer = false;
            if (this.showCasedDrawings.length > 1) {
                this.showCasedDrawings.splice(1, 1);
            } else {
                this.showCasedDrawings.splice(0, 1);
            }
            this.previewDrawings.splice((this.drawingCounter + 1) % this.previewDrawings.length, 1);
        } catch (error) {
            console.log(error);
            switch ((error as Message).body) {
                case 'Timeout has occurred':
                    console.log('TIMEOUT!!!');
                    break;
                case 'Image not in server':
                    this.imageNotInServer = true;
                    break;
            }
        }
    }

    openEditorWithDrawing(dataUrl: string): void {
        this.drawingService.setInitialImage(dataUrl);
    }

    private checkIfTagExists(tag: string): boolean {
        for (const drawing of this.previewDrawings) {
            if (drawing.tags?.includes(tag)) {
                return true;
            }
        }
        return false;
    }

    private setErrorInTag(errorMessage: string): void {
        this.tagErrorPresent = true;
        this.tagErrorMessage = errorMessage;
    }

    private async resetShowcasedDrawings(): Promise<void> {
        // Clean drawings currently in carousel
        this.previewDrawings = [];
        this.showCasedDrawings = [];
        this.drawingCounter = 0;
        this.drawingLoading = true;
        let drawingsWithMatchingTags: Drawing[];

        if (this.tagsInSearch.length > 0) {
            try {
                const resultMessage: Message = await this.database.getDrawingsByTags(this.tagsInSearch).toPromise();
                drawingsWithMatchingTags = JSON.parse(resultMessage.body);
                this.drawingLoading = false;
                this.noValidDrawing = drawingsWithMatchingTags.length === 0;
                for (const drawing of drawingsWithMatchingTags) {
                    this.addDrawingToDisplay(drawing._id, drawing);
                }
            } catch (error) {
                // handle error
                console.log(error);
            }
            return;
        }

        try {
            const resultMessage: Message = await this.database.getDrawings().toPromise();
            drawingsWithMatchingTags = JSON.parse(resultMessage.body);
            for (const drawing of drawingsWithMatchingTags) {
                this.addDrawingToDisplay(drawing._id, drawing);
            }
            this.drawingLoading = false;
        } catch (error) {
            // handle error
            console.log(error);
        }
    }

    private async addDrawingToDisplay(id: string, drawing: Drawing): Promise<void> {
        try {
            const getDrawingsByIdPromise = await this.localServerService.getDrawingById(id).toPromise();
            const result: Message = getDrawingsByIdPromise;
            if (result.title !== ServerConstants.ERROR_MESSAGE) {
                const serverDrawing: ServerDrawing = JSON.parse(result.body);
                const newPreviewDrawing: ImageFormat = { image: serverDrawing.image, name: drawing.title, tags: drawing.tags, id };
                this.previewDrawings.push(newPreviewDrawing);
                if (this.showCasedDrawings.length < CarouselConstants.MAX_CAROUSEL_SIZE) {
                    this.showCasedDrawings.push(newPreviewDrawing);
                }
            }
        } catch (error) {
            console.log(error);
        }
    }
}
