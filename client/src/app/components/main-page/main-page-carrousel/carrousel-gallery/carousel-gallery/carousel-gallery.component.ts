import { Component, Input, OnInit } from '@angular/core';
import { ImageFormat } from '@app/classes/image-format';
import * as CarouselConstants from '@app/constants/carousel-constants';

@Component({
    selector: 'app-carousel-gallery',
    templateUrl: './carousel-gallery.component.html',
    styleUrls: ['./carousel-gallery.component.scss'],
})
export class CarouselGalleryComponent implements OnInit {
    @Input() tagValue: string;
    @Input() newTagAdded: boolean;
    deleted: boolean = false;
    drawingCounter: number = 0;
    fetchedDrawingByTag: string[];
    showCasedDrawings: ImageFormat[];

    previewDrawing: ImageFormat[] = [
        { image: 'https://secure.img1-fg.wfcdn.com/im/27616071/compr-r85/3125/31254990/dalmatian-puppy-statue.jpg', name: 'patate' },
        { image: 'https://i.pinimg.com/originals/8c/7a/e2/8c7ae28680cd917192d6de5ef3d8cd7f.jpg', name: 'face' },
        { image: 'https://wallpapercave.com/wp/wp2473639.jpg', name: 'lilo' },
        { image: 'https://en.bcdn.biz/Images/2016/11/15/776342f0-86f5-4522-84c9-a02d6b11c766.jpg', name: 'tomato' },
        { image: 'https://images.amcnetworks.com/bbcamerica.com/wp-content/uploads/2013/06/Toast.jpg', name: 'hello' },
        { image: 'https://www.petmd.com/sites/default/files/styles/article_image/public/petmd-puppy-weight.jpg?itok=IwMOwGSX', name: 'carotte' },
    ];

    ngOnInit(): void {
        this.showCasedDrawings = [
            { image: 'https://secure.img1-fg.wfcdn.com/im/27616071/compr-r85/3125/31254990/dalmatian-puppy-statue.jpg', name: 'patate' },
            { image: 'https://i.pinimg.com/originals/8c/7a/e2/8c7ae28680cd917192d6de5ef3d8cd7f.jpg', name: 'face' },
            { image: 'https://wallpapercave.com/wp/wp2473639.jpg', name: 'lilo' },
        ];
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

    openDrawingEditor(): void {
        console.log('opens_canvas_with_drawing');
    }
}
