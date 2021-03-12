import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-save-complete-page',
    templateUrl: './save-complete-page.component.html',
    styleUrls: ['./save-complete-page.component.scss'],
})
export class SaveCompletePageComponent {
    @Input() reason: string;
}
