import { Component } from '@angular/core';
import { ImageFormat } from '@app/classes/image-format';

@Component({
    selector: 'app-carousel-gallery',
    templateUrl: './carousel-gallery.component.html',
    styleUrls: ['./carousel-gallery.component.scss'],
})
export class CarouselGalleryComponent {
    // @Output() chosen: EventEmitter<Drawing>;
    // @Input() drawing: Drawing;
    deleted: boolean;
    constructor() {
        this.deleted = false;
        // this.chosen = new EventEmitter<Drawing>();
    }

    previewDrawing: ImageFormat[] = [
        { image: 'image1' },
        { image: 'https://gsr.dev/material2-carousel/assets/demo.png' },
        { image: 'https://gsr.dev/material2-carousel/assets/demo.png' },
        { image: 'https://gsr.dev/material2-carousel/assets/demo.png' },
        { image: 'https://gsr.dev/material2-carousel/assets/demo.png' },
    ];

    showcaseNextDrawing(): void {
        console.log('something');
    }

    // get previewURL(): SafeResourceUrl {
    //   return this.sanitizer.bypassSecurityTrustResourceUrl(this.drawing.previewURL);
    // }

    // delete(): void {
    //   this.apiService.deleteDrawing(this.drawing._id);
    //   this.deleted = true;
    // }
    //
    // choose(): void {
    //     this.chosen.emit(this.drawing);
    // }
}
