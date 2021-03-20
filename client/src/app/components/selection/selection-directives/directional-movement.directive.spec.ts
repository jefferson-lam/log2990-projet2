import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SelectionComponent } from '@app/components/selection/selection.component';
import { ResizerHandlerService } from '@app/services/resizer/resizer-handler.service';
import { DirectionalMovementDirective } from './directional-movement.directive';

describe('DirectionalMovementDirective', () => {
    let fixture: ComponentFixture<SelectionComponent>;
    let resizerHandlerService: ResizerHandlerService;

    beforeEach(() => {
        resizerHandlerService = TestBed.inject(ResizerHandlerService);
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
