import { TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Tool } from '@app/classes/tool';
import { DiscardChangesPopupComponent } from '@app/components/main-page/discard-changes-popup/discard-changes-popup.component';
import { MainPageCarrouselComponent } from '@app/components/main-page/main-page-carrousel/main-page-carrousel.component';
import { NewDrawingBoxComponent } from '@app/components/sidebar/new-drawing-box/new-drawing-box.component';
import { SaveDrawingComponent } from '@app/components/sidebar/save-drawing-page/save-drawing.component';
import { ToolInfoComponent } from '@app/components/sidebar/tool-info/tool-info.component';
import { ToolManagerService } from '@app/services/manager/tool-manager-service';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';
import { EMPTY, Observable, Subject } from 'rxjs';
import { PopupManagerService } from './popup-manager.service';

// tslint:disable:no-any
// tslint:disable:max-file-line-count
describe('PopupManagerService', () => {
    let service: PopupManagerService;
    let dialogSpy: jasmine.SpyObj<MatDialog>;
    let routerSpy: jasmine.SpyObj<Router>;
    let undoRedoServiceSpy: jasmine.SpyObj<UndoRedoService>;
    let pileSizeSubject: Subject<number[]>;
    let toolManagerSpy: jasmine.SpyObj<ToolManagerService>;
    let onToolChangeSpy: jasmine.Spy;
    let baseCanvas: HTMLCanvasElement;
    let carrousselSubject: Subject<any>;
    let discardSubject: Subject<boolean>;
    let setSpy: jasmine.Spy;
    const mockImageURL = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAADElEQVQImWNgoBMAAABpAAFEI8ARAAAAAElFTkSuQmCC';

    beforeEach(() => {
        pileSizeSubject = new Subject<number[]>();
        undoRedoServiceSpy = jasmine.createSpyObj('UndoRedoService', ['reset', 'isUndoPileEmpty'], {
            initialImage: undefined,
            pileSizeObservable: pileSizeSubject.asObservable(),
        });
        toolManagerSpy = jasmine.createSpyObj('ToolManagerService', [], ['currentTool']);
        (Object.getOwnPropertyDescriptor(toolManagerSpy, 'currentTool')?.get as jasmine.Spy<() => Tool>).and.returnValue({
            // tslint:disable-next-line:no-empty
            onToolChange(): void {},
        } as Tool);
        routerSpy = jasmine.createSpyObj('Router', ['navigate']);
        dialogSpy = jasmine.createSpyObj(
            'MatDialog',
            ['open', 'closeAll', '_getAfterAllClosed'],
            ['afterAllClosed', '_afterAllClosedAtThisLevel', '_afterOpenedAtThisLevel', 'afterOpened'],
        );
        (Object.getOwnPropertyDescriptor(dialogSpy, '_afterAllClosedAtThisLevel')?.get as jasmine.Spy<() => Subject<void>>).and.returnValue(
            new Subject<void>(),
        );
        (Object.getOwnPropertyDescriptor(dialogSpy, 'afterAllClosed')?.get as jasmine.Spy<() => Observable<void>>).and.returnValue(
            // tslint:disable-next-line:no-string-literal
            dialogSpy['_afterAllClosedAtThisLevel'].asObservable(),
        );
        (Object.getOwnPropertyDescriptor(dialogSpy, 'afterOpened')?.get as jasmine.Spy<() => Subject<MatDialogRef<any>>>).and.returnValue(
            new Subject<MatDialogRef<any>>(),
        );
        TestBed.configureTestingModule({
            providers: [
                { provide: MatDialog, useValue: dialogSpy },
                { provide: Router, useValue: routerSpy },
                { provide: UndoRedoService, useValue: undoRedoServiceSpy },
                { provide: ToolManagerService, useValue: toolManagerSpy },
            ],
        });
        service = TestBed.inject(PopupManagerService);

        baseCanvas = document.createElement('canvas');
        baseCanvas.width = 1;
        baseCanvas.height = 1;
        baseCanvas.id = 'canvas';
        document.body.append(baseCanvas);
        carrousselSubject = new Subject();
        discardSubject = new Subject();
        setSpy = spyOn(localStorage, 'setItem');
        onToolChangeSpy = spyOn(toolManagerSpy.currentTool, 'onToolChange');
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('when pile size changes newDrawingPossible is set false if undoPile empty and initialImage undefined', () => {
        undoRedoServiceSpy.isUndoPileEmpty.and.returnValue(true);
        pileSizeSubject.next([0, 0]);

        expect(service.newDrawingPossible).toBeFalse();
    });

    it('when pile size changes newDrawingPossible is set true if undoPile empty and initialImage not undefined', () => {
        (Object.getOwnPropertyDescriptor(undoRedoServiceSpy, 'initialImage')?.get as jasmine.Spy<() => HTMLImageElement | undefined>).and.returnValue(
            new Image(),
        );
        undoRedoServiceSpy.isUndoPileEmpty.and.returnValue(true);
        pileSizeSubject.next([0, 0]);

        expect(service.newDrawingPossible).toBeTrue();
    });

    it('when pile size changes newDrawingPossible is set true if undoPile not empty and initialImage undefined', () => {
        undoRedoServiceSpy.isUndoPileEmpty.and.returnValue(false);
        pileSizeSubject.next([1, 0]);

        expect(service.newDrawingPossible).toBeTrue();
    });

    it('when all popups are closed, isPopUpOpen is set to false', () => {
        dialogSpy._getAfterAllClosed.and.callFake(() => {
            // tslint:disable-next-line:no-string-literal
            return service.dialog['_afterAllClosedAtThisLevel'];
        });
        service.isPopUpOpen = true;

        service.dialog._getAfterAllClosed().next();

        expect(service.isPopUpOpen).toBeFalse();
    });

    it('when a popups is opened, isPopUpOpen is set to true', () => {
        service.isPopUpOpen = false;

        dialogSpy.afterOpened.next({} as MatDialogRef<any>);

        expect(service.isPopUpOpen).toBeTrue();
    });

    it('openCarrouselPopUp should not open MainPageCarrouselComponent if isPopUpOpen', () => {
        service.isPopUpOpen = true;
        service.openCarrouselPopUp();

        expect(dialogSpy.open).not.toHaveBeenCalled();
    });

    it('openCarrouselPopUp should open MainPageCarrouselComponent if isPopUpOpen false', () => {
        dialogSpy.open.and.returnValue({ afterClosed: () => EMPTY } as any);

        service.openCarrouselPopUp();

        expect(dialogSpy.open).toHaveBeenCalled();
        expect(dialogSpy.open).toHaveBeenCalledWith(MainPageCarrouselComponent, { height: '700px', width: '1800px' });
    });

    it('openCarrouselPopUp should do nothing if MainPageCarrouselComponent return false for autosave', () => {
        const discardChangesSpy = spyOn(service, 'openDiscardChangesPopUp');
        dialogSpy.open.and.returnValue({ afterClosed: () => carrousselSubject.asObservable() } as MatDialogRef<MainPageCarrouselComponent>);

        service.openCarrouselPopUp();
        carrousselSubject.next({ autosave: false, data: mockImageURL });
        localStorage.clear();

        expect(setSpy).not.toHaveBeenCalled();
        expect(discardChangesSpy).not.toHaveBeenCalled();
    });

    it('openCarrouselPopUp should open DiscardChangesComponent if MainPageCarrouselComponent return true for autosave', () => {
        const discardChangesSpy = spyOn(service, 'openDiscardChangesPopUp');
        dialogSpy.open.and.returnValue({ afterClosed: () => carrousselSubject.asObservable() } as MatDialogRef<MainPageCarrouselComponent>);

        service.openCarrouselPopUp();
        carrousselSubject.next({ autosave: true, data: mockImageURL });
        localStorage.clear();

        expect(setSpy).not.toHaveBeenCalled();
        expect(discardChangesSpy).toHaveBeenCalled();
    });

    it('openCarrouselPopUp should set localStorage autosave if open DiscardChangesComponent returns true for discard', () => {
        const discardChangesSpy = spyOn(service, 'openDiscardChangesPopUp').and.returnValue({
            afterClosed: () => discardSubject.asObservable(),
        } as MatDialogRef<DiscardChangesPopupComponent>);
        dialogSpy.open.and.returnValue({ afterClosed: () => carrousselSubject.asObservable() } as MatDialogRef<MainPageCarrouselComponent>);

        service.openCarrouselPopUp();
        carrousselSubject.next({ autosave: true, data: mockImageURL });
        discardSubject.next(true);
        localStorage.clear();

        expect(setSpy).toHaveBeenCalled();
        expect(setSpy).toHaveBeenCalledWith('autosave', mockImageURL);
        expect(discardChangesSpy).toHaveBeenCalled();
    });

    it('openCarrouselPopUp should not set localStorage autosave if open DiscardChangesComponent returns false for discard', () => {
        const discardChangesSpy = spyOn(service, 'openDiscardChangesPopUp').and.returnValue({
            afterClosed: () => discardSubject.asObservable(),
        } as MatDialogRef<DiscardChangesPopupComponent>);
        dialogSpy.open.and.returnValue({ afterClosed: () => carrousselSubject.asObservable() } as MatDialogRef<MainPageCarrouselComponent>);

        service.openCarrouselPopUp();
        carrousselSubject.next({ autosave: true, data: mockImageURL });
        discardSubject.next(false);
        localStorage.clear();

        expect(discardChangesSpy).toHaveBeenCalled();
        expect(setSpy).not.toHaveBeenCalled();
    });

    it('openDiscardChangesPopUp should not open DiscardChangesPopupComponent if isPopUpOpen', () => {
        service.isPopUpOpen = true;

        const result = service.openDiscardChangesPopUp();

        expect(dialogSpy.open).not.toHaveBeenCalled();
        expect(result).toBeUndefined();
    });

    it('openDiscardChangesPopUp should open DiscardChangesPopupComponent if isPopUpOpen false', () => {
        dialogSpy.open.and.returnValue({ afterClosed: () => EMPTY } as any);

        const result = service.openDiscardChangesPopUp();

        expect(dialogSpy.open).toHaveBeenCalled();
        expect(dialogSpy.open).toHaveBeenCalledWith(DiscardChangesPopupComponent);
        expect(result).not.toBeUndefined();
    });

    it('openDiscardChangesPopUp should not navigate to editor if not discarded', () => {
        dialogSpy.open.and.returnValue({ afterClosed: () => discardSubject.asObservable() } as any);

        service.openDiscardChangesPopUp();
        discardSubject.next(false);

        expect(routerSpy.navigate).not.toHaveBeenCalled();
    });

    it('openDiscardChangesPopUp should navigate to editor if discarded', () => {
        dialogSpy.open.and.returnValue({ afterClosed: () => discardSubject.asObservable() } as any);

        service.openDiscardChangesPopUp();
        discardSubject.next(true);

        expect(routerSpy.navigate).toHaveBeenCalled();
        expect(routerSpy.navigate).toHaveBeenCalledWith(['/', 'editor']);
    });

    it("openExportPopUp should open export pop up if pop up isn't open", () => {
        service.openExportPopUp();

        expect(dialogSpy.open).toHaveBeenCalled();
    });

    it("openExportPopUp should call onToolChange if pop up isn't open", () => {
        service.openExportPopUp();

        expect(onToolChangeSpy).toHaveBeenCalled();
    });

    it('openExportPopUp should not open anything if pop up is open', () => {
        service.isPopUpOpen = true;
        service.openExportPopUp();

        expect(dialogSpy.open).not.toHaveBeenCalled();
    });

    it("openNewDrawingPopUp should call onToolChange if newDrawingPossible and pop up isn't open", () => {
        service.newDrawingPossible = true;
        service.openNewDrawingPopUp();

        expect(onToolChangeSpy).toHaveBeenCalled();
    });

    it("openNewDrawingPopUp should open NewDrawingBoxComponent if newDrawingPossible and pop up isn't open", () => {
        service.newDrawingPossible = true;
        service.openNewDrawingPopUp();

        expect(dialogSpy.open).toHaveBeenCalled();
        expect(dialogSpy.open).toHaveBeenCalledWith(NewDrawingBoxComponent);
    });

    it('openNewDrawingPopUp should not open anything if newDrawingPossible false', () => {
        service.newDrawingPossible = false;
        service.openNewDrawingPopUp();

        expect(dialogSpy.open).not.toHaveBeenCalled();
    });

    it('openNewDrawingPopUp should not open anything if pop up is open', () => {
        service.isPopUpOpen = true;
        service.openNewDrawingPopUp();

        expect(undoRedoServiceSpy.isUndoPileEmpty).not.toHaveBeenCalled();
        expect(dialogSpy.open).not.toHaveBeenCalled();
        expect(service.isPopUpOpen).toBeTrue();
    });

    it("openSavePopUp should open SaveDrawingComponent if pop up isn't open", () => {
        service.openSavePopUp();

        expect(onToolChangeSpy).toHaveBeenCalled();
        expect(dialogSpy.open).toHaveBeenCalled();
        expect(dialogSpy.open).toHaveBeenCalledWith(SaveDrawingComponent);
    });

    it('openSavePopUp should not open anything if pop up is open', () => {
        service.isPopUpOpen = true;
        service.openSavePopUp();

        expect(dialogSpy.open).not.toHaveBeenCalled();
        expect(service.isPopUpOpen).toBeTrue();
    });

    it("openToolInfoPopUp should open ToolInfoComponent if pop up isn't open", () => {
        service.openToolInfoPopUp();

        expect(onToolChangeSpy).toHaveBeenCalled();
        expect(dialogSpy.open).toHaveBeenCalled();
        expect(dialogSpy.open).toHaveBeenCalledWith(ToolInfoComponent);
    });

    it('openToolInfoPopUp should not open anything if pop up is open', () => {
        service.isPopUpOpen = true;
        service.openToolInfoPopUp();

        expect(dialogSpy.open).not.toHaveBeenCalled();
        expect(service.isPopUpOpen).toBeTrue();
    });
});
