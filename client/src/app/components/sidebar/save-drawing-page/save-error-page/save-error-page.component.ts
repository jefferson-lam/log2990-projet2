import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-save-error-page',
    templateUrl: './save-error-page.component.html',
    styleUrls: ['./save-error-page.component.scss'],
})
export class SaveErrorPageComponent {
    @Input() reason: string;
}
