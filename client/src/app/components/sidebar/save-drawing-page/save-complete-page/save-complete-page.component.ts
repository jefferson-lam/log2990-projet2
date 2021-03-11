import { Component } from '@angular/core';

@Component({
    selector: 'app-save-complete-page',
    templateUrl: './save-complete-page.component.html',
    styleUrls: ['./save-complete-page.component.scss'],
})
export class SaveCompletePageComponent {
    message: string = 'Drawing Saved!';

    changeToFailedMessage(): void {
        this.message = 'Failed to save';
    }
}
