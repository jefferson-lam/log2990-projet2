import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SelectionComponent } from '@app/components/selection/selection.component';
import { DirectionalMovementDirective } from './directional-movement.directive';

describe('DirectionalMovementDirective', () => {
    let fixture: ComponentFixture<SelectionComponent>;

    beforeEach(() => {
        fixture = TestBed.configureTestingModule({
            declarations: [SelectionComponent],
        }).createComponent(SelectionComponent);
        fixture.detectChanges();
    });

    it('should create an instance', () => {
        const selectionCanvas = fixture.nativeElement.querySelector('#selectionLayer');
        const directive = new DirectionalMovementDirective(selectionCanvas);
        expect(directive).toBeTruthy();
    });
});
