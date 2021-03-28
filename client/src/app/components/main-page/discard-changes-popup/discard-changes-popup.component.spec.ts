import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef } from '@angular/material/dialog';
import { DiscardChangesPopupComponent } from './discard-changes-popup.component';

describe('DiscardChangesPopupComponent', () => {
    let component: DiscardChangesPopupComponent;
    let fixture: ComponentFixture<DiscardChangesPopupComponent>;
    let matDialogRefSpy: jasmine.SpyObj<MatDialogRef<DiscardChangesPopupComponent>>;

    beforeEach(async(() => {
        matDialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);
        TestBed.configureTestingModule({
            declarations: [DiscardChangesPopupComponent],
            providers: [{ provide: MatDialogRef, useValue: matDialogRefSpy }],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(DiscardChangesPopupComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('cancel should pass false when closing', () => {
        component.cancel();

        expect(matDialogRefSpy.close).toHaveBeenCalled();
        expect(matDialogRefSpy.close).toHaveBeenCalledWith(false);
    });

    it('discardChanges should pass true when closing', () => {
        component.discardChanges();

        expect(matDialogRefSpy.close).toHaveBeenCalled();
        expect(matDialogRefSpy.close).toHaveBeenCalledWith(true);
    });
});
