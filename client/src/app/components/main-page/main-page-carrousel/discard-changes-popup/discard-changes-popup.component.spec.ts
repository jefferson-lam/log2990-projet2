import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';
import { DiscardChangesPopupComponent } from './discard-changes-popup.component';

describe('DiscardChangesPopupComponent', () => {
    let component: DiscardChangesPopupComponent;
    let fixture: ComponentFixture<DiscardChangesPopupComponent>;
    let router: jasmine.SpyObj<Router>;
    const drawingStub = new DrawingService();
    const undoRedoStub = new UndoRedoService(drawingStub);

    beforeEach(async(() => {
        router = jasmine.createSpyObj(Router, ['navigate']);
        TestBed.configureTestingModule({
            declarations: [DiscardChangesPopupComponent],
            providers: [
                { provide: Router, useValue: router },
                { provide: MAT_DIALOG_DATA, useValue: {} },
                { provide: UndoRedoService, useValue: undoRedoStub },
                { provide: DrawingService, useValue: drawingStub },
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

    it('discardChanges should call undoRedoService.reset', () => {
        const resetSpy = spyOn(component.undoRedoService, 'reset');

        component.discardChanges();

        expect(resetSpy).toHaveBeenCalled();
    });

    it('discardChanges should call drawingService.setInitialImage', () => {
        component.dataUrl = 'teststring';
        const setInitialImageSpy = spyOn(component.drawingService, 'setInitialImage');

        component.discardChanges();

        expect(setInitialImageSpy).toHaveBeenCalled();
        expect(setInitialImageSpy).toHaveBeenCalledWith('teststring');
    });

    it('discardChanges should call route.navigate', () => {
        component.discardChanges();

        expect(router.navigate).toHaveBeenCalled();
        expect(router.navigate).toHaveBeenCalledWith(['/', 'editor']);
    });
});
