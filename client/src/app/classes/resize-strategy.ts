import { CdkDragMove } from '@angular/cdk/drag-drop';
import { Injectable } from '@angular/core';
import { SelectionComponent } from '@app/components/selection/selection.component';

// tslint:disable:no-empty
@Injectable({
    providedIn: 'root',
})
export class ResizeStrategy {
    resize(selectionComponent: SelectionComponent, event: CdkDragMove): void {}
}
