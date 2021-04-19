import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, Input } from '@angular/core';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ImageFormat } from '@app/classes/image-format';
import * as CarouselConstants from '@app/constants/carousel-constants';
import { DatabaseService } from '@app/services/database/database.service';
import { LocalServerService } from '@app/services/local-server/local-server.service';
import { Drawing } from '@common/communication/database';
import { Message } from '@common/communication/message';
import { ServerDrawing } from '@common/communication/server-drawing';
import * as DatabaseConstants from '@common/validation/database-constants';
import * as ServerConstants from '@common/validation/server-constants';

@Component({
    selector: 'app-main-page-carrousel',
    templateUrl: './main-page-carrousel.component.html',
    styleUrls: ['./main-page-carrousel.component.scss'],
})
export class MainPageCarrouselComponent {
    @Input() newTagAdded: boolean;
    @Input() deleteDrawingTrue: boolean;

    tagErrorPresent: boolean;
    tagErrorMessage: string;
    serverErrorMessage: string;
    deleted: boolean;
    selectable: boolean;
    removable: boolean;

    separatorKeysCodes: number[];
    private tagsInSearch: string[];

    private drawingCounter: number;
    private showCasedDrawings: ImageFormat[];
    placeHolderDrawing: ImageFormat;
    previewDrawings: ImageFormat[];

    constructor(
        private database: DatabaseService,
        private localServerService: LocalServerService,
        private router: Router,
        public matDialogRef: MatDialogRef<MainPageCarrouselComponent>,
    ) {
        this.tagErrorPresent = false;
        this.tagErrorMessage = '';
        this.serverErrorMessage = '';
        this.deleted = false;
        this.selectable = true;
        this.removable = true;
        this.separatorKeysCodes = [ENTER, COMMA];
        this.tagsInSearch = [];
        this.drawingCounter = 0;
        this.placeHolderDrawing = new ImageFormat();
        this.previewDrawings = [];
        this.resetShowcasedDrawings();
        this.matDialogRef.disableClose = true;
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
        if (this.showCasedDrawings.length === 0) {
            return;
        }
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
        if (this.showCasedDrawings.length === 0) {
            return;
        }
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
            let result: Message = await this.database.dropDrawing(idDrawingToDelete).toPromise();
            if (result === undefined || result.title === DatabaseConstants.ERROR_MESSAGE) {
                const errorMessage: Message = {
                    title: DatabaseConstants.ERROR_MESSAGE,
                    body: 'Image not in server',
                };
                throw errorMessage;
            }
            result = await this.localServerService.deleteDrawing(idDrawingToDelete).toPromise();
            if (result === undefined || result.title === ServerConstants.ERROR_MESSAGE) {
                const errorMessage: Message = {
                    title: ServerConstants.ERROR_MESSAGE,
                    body: 'Image not in server',
                };
                throw errorMessage;
            }
            if (this.showCasedDrawings.length > 1) {
                this.showCasedDrawings.splice(1, 1);
            } else {
                this.showCasedDrawings.splice(0, 1);
            }
            this.previewDrawings.splice((this.drawingCounter + 1) % this.previewDrawings.length, 1);
            this.resetShowcasedDrawings();
        } catch (error) {
            this.setErrorInServer("L'image n'est pas disponible. Sélectionnez une autre image.");
        }
    }

    openDrawing(dataUrl: string): void {
        if (localStorage.getItem('autosave')) {
            this.matDialogRef.close({ autosave: true, data: dataUrl });
        } else {
            localStorage.setItem('autosave', dataUrl);
            this.router.navigate(['/', 'editor']);
        }
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

    private setErrorInServer(errorMessage: string): void {
        this.serverErrorMessage = errorMessage;
    }

    private async resetShowcasedDrawings(): Promise<void> {
        // Clean drawings currently in carousel
        this.previewDrawings = [];
        this.showCasedDrawings = [];
        this.drawingCounter = 0;
        let drawingsWithMatchingTags: Drawing[];

        if (this.tagsInSearch.length > 0) {
            try {
                const resultMessage: Message = await this.database.getDrawingsByTags(this.tagsInSearch).toPromise();
                drawingsWithMatchingTags = JSON.parse(resultMessage.body);

                for (const drawing of drawingsWithMatchingTags) {
                    await this.addDrawingToDisplay(drawing._id, drawing);
                }
            } catch (error) {
                this.setErrorInServer("Le serveur n'est pas disponible.");
            }
            return;
        }

        try {
            const resultMessage: Message = await this.database.getDrawings().toPromise();
            drawingsWithMatchingTags = JSON.parse(resultMessage.body);

            for (const drawing of drawingsWithMatchingTags) {
                await this.addDrawingToDisplay(drawing._id, drawing);
            }
        } catch (error) {
            this.setErrorInServer("Le serveur n'est pas disponible.");
        }
    }

    private async addDrawingToDisplay(id: string, drawing: Drawing): Promise<void> {
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
    }
}
