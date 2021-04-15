import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef } from '@angular/material/dialog';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';
import { DiscardChangesPopupComponent } from './discard-changes-popup.component';

describe('DiscardChangesPopupComponent', () => {
    let component: DiscardChangesPopupComponent;
    let fixture: ComponentFixture<DiscardChangesPopupComponent>;
    let matDialogRefSpy: jasmine.SpyObj<MatDialogRef<DiscardChangesPopupComponent>>;
    let undoRedoServiceSpy: jasmine.SpyObj<UndoRedoService>;

    beforeEach(async(() => {
        undoRedoServiceSpy = jasmine.createSpyObj('UndoRedoService', ['reset']);
        matDialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);
        TestBed.configureTestingModule({
            declarations: [DiscardChangesPopupComponent],
            providers: [
                { provide: MatDialogRef, useValue: matDialogRefSpy },
                { provide: UndoRedoService, useValue: undoRedoServiceSpy },
            ],
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

    it('discardChanges should reset undoRedoService', () => {
        component.discardChanges();

        expect(undoRedoServiceSpy.reset).toHaveBeenCalled();
    });

    it('discardChanges should remove localStorage item autosave', () => {
        localStorage.setItem('autosave', 'test string');
        component.discardChanges();

        expect(localStorage.getItem('autosave')).toBeNull();
    });
});
