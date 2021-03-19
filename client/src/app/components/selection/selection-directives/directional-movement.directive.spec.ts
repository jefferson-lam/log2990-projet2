import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ResizerHandlerService } from '@app/services/resizer/resizer-handler.service';
import { SelectionComponent } from '../selection.component';
import { DirectionalMovementDirective } from './directional-movement.directive';

describe('DirectionalMovementDirective', () => {
    let fixture: ComponentFixture<SelectionComponent>;
    let resizerHandlerService: ResizerHandlerService;

    beforeEach(() => {
        fixture = TestBed.configureTestingModule({
            declarations: [SelectionComponent],
        }).createComponent(SelectionComponent);
        fixture.detectChanges();
    });

    it('should create an instance', () => {
        const selectionCanvas = fixture.nativeElement.querySelector('#selectionLayer');
        const directive = new DirectionalMovementDirective(selectionCanvas, resizerHandlerService);
        expect(directive).toBeTruthy();
    });
});
