import { HttpClientModule } from '@angular/common/http';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import SpyObj = jasmine.SpyObj;
import { DiscardChangesPopupComponent } from '@app/components/main-page/discard-changes-popup/discard-changes-popup.component';
import { PopupManagerService } from '@app/services/manager/popup-manager.service';
import { EMPTY, Observable, Subject } from 'rxjs';
import { MainPageComponent } from './main-page.component';

// tslint:disable: no-string-literal
// tslint:disable: no-any
describe('MainPageComponent', () => {
    let component: MainPageComponent;
    let fixture: ComponentFixture<MainPageComponent>;
    let popupManagerSpy: jasmine.SpyObj<PopupManagerService>;
    let dialogSpy: SpyObj<MatDialog>;
    let routerSpy: Router;
    const mockImageURL = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAADElEQVQImWNgoBMAAABpAAFEI8ARAAAAAElFTkSuQmCC';

    beforeEach(async(() => {
        popupManagerSpy = jasmine.createSpyObj(
            'PopupManagerService',
            ['openDiscardChangesPopUp', 'openCarrouselPopUp', 'openNewDrawingPopUp'],
            ['isPopupOpen'],
        );
        routerSpy = jasmine.createSpyObj('Router', ['navigate']);
        dialogSpy = jasmine.createSpyObj('MatDialog', ['open', 'closeAll', '_getAfterAllClosed'], ['afterAllClosed', '_afterAllClosedAtThisLevel']);
        (Object.getOwnPropertyDescriptor(dialogSpy, '_afterAllClosedAtThisLevel')?.get as jasmine.Spy<() => Subject<any>>).and.returnValue(
            new Subject<any>(),
        );
        (Object.getOwnPropertyDescriptor(dialogSpy, 'afterAllClosed')?.get as jasmine.Spy<() => Observable<void>>).and.returnValue(
            dialogSpy['_afterAllClosedAtThisLevel'].asObservable(),
        );
        TestBed.configureTestingModule({
            imports: [RouterTestingModule, HttpClientModule],
            declarations: [MainPageComponent, DiscardChangesPopupComponent],
            providers: [
                { provide: MatDialog, useValue: dialogSpy },
                { provide: Router, useValue: routerSpy },
                { provide: PopupManagerService, useValue: popupManagerSpy },
            ],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(MainPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it("should have as title 'LOG2990'", () => {
        expect(component.title).toEqual('LOG2990');
    });

    it('ngOnInit should set ongoingDrawing to false if localStorage does not have item autosave', () => {
        localStorage.removeItem('autosave');

        component.ngOnInit();

        expect(component.ongoingDrawing).toBeFalse();
    });

    it('ngOnInit should set ongoingDrawing to true if localStorage has item autosave', () => {
        localStorage.setItem('autosave', mockImageURL);

        component.ngOnInit();
        localStorage.clear();

        expect(component.ongoingDrawing).toBeTrue();
    });

    it('on new drawing button click, should call newDrawing', () => {
        const newDrawingSpy = spyOn(component, 'newDrawing').and.callThrough();
        fixture.detectChanges();
        const btn = fixture.debugElement.nativeElement.querySelector('#creation-button');
        btn.click();
        fixture.detectChanges();
        expect(newDrawingSpy).toHaveBeenCalledWith();
    });

    it('newDrawing should start new drawing if autosavedrawing and pop up returns true', () => {
        const resetSpy = spyOn(component.undoRedoService, 'reset');
        const removeSpy = spyOn(localStorage, 'removeItem');
        localStorage.setItem('autosave', mockImageURL);
        const discardSubject = new Subject();
        popupManagerSpy.openDiscardChangesPopUp.and.returnValue({ afterClosed: () => discardSubject.asObservable() } as any);

        component.newDrawing();
        discardSubject.next(true);
        localStorage.clear();

        expect(resetSpy).toHaveBeenCalled();
        expect(removeSpy).toHaveBeenCalled();
        expect(removeSpy).toHaveBeenCalledWith('autosave');
        expect(routerSpy.navigate).toHaveBeenCalled();
        expect(routerSpy.navigate).toHaveBeenCalledWith(['/', 'editor']);
    });

    it('newDrawing should do nothing if autosavedrawing and pop up returns false', () => {
        const resetSpy = spyOn(component.undoRedoService, 'reset');
        const removeSpy = spyOn(localStorage, 'removeItem');
        localStorage.setItem('autosave', mockImageURL);
        const discardSubject = new Subject();
        popupManagerSpy.openDiscardChangesPopUp.and.returnValue({ afterClosed: () => discardSubject.asObservable() } as any);

        component.newDrawing();
        discardSubject.next(false);
        localStorage.clear();

        expect(resetSpy).not.toHaveBeenCalled();
        expect(removeSpy).not.toHaveBeenCalled();
        expect(routerSpy.navigate).not.toHaveBeenCalled();
        expect(routerSpy.navigate).not.toHaveBeenCalledWith(['/', 'editor']);
    });

    it('newDrawing should open pop up if autosave drawing exists', () => {
        localStorage.setItem('autosave', mockImageURL);
        popupManagerSpy.openDiscardChangesPopUp.and.returnValue({ afterClosed: () => EMPTY } as any);

        component.newDrawing();

        localStorage.clear();

        expect(popupManagerSpy.openDiscardChangesPopUp).toHaveBeenCalled();
    });

    it('newDrawing should start new drawing if not autosavedrawing', () => {
        const resetSpy = spyOn(component.undoRedoService, 'reset');
        localStorage.clear();

        component.newDrawing();

        expect(resetSpy).toHaveBeenCalled();
        expect(routerSpy.navigate).toHaveBeenCalled();
        expect(routerSpy.navigate).toHaveBeenCalledWith(['/', 'editor']);
    });

    it('on carrousel button click, should open carrousel interface', () => {
        fixture.detectChanges();
        const btn = fixture.debugElement.nativeElement.querySelector('#carousel-button');
        btn.click();
        fixture.detectChanges();
        expect(popupManagerSpy.openCarrouselPopUp).toHaveBeenCalled();
    });

    it('continue drawing button should not be created if no ongoingDrawing', () => {
        component.ongoingDrawing = false;
        fixture.detectChanges();
        const btn = fixture.debugElement.nativeElement.querySelector('#continue-button');
        fixture.detectChanges();
        expect(btn).toBeNull();
    });

    it('on continue drawing button click, should call continueDrawing', () => {
        component.ongoingDrawing = true;
        const continueDrawingSpy = spyOn(component, 'continueDrawing');
        fixture.detectChanges();
        const btn = fixture.debugElement.nativeElement.querySelector('#continue-button');
        btn.click();
        fixture.detectChanges();
        expect(continueDrawingSpy).toHaveBeenCalledWith();
    });

    it('continueDrawing should navigate to editor', () => {
        localStorage.setItem('autosave', mockImageURL);

        component.continueDrawing();
        localStorage.removeItem('autosave');

        expect(routerSpy.navigate).toHaveBeenCalled();
        expect(routerSpy.navigate).toHaveBeenCalledWith(['/', 'editor']);
    });

    it('should call openCarrouselPopUp on control+g as well as prevent default', () => {
        const eventSpy = jasmine.createSpyObj('event', ['preventDefault'], { ctrlKey: true, code: 'KeyG', key: '' });
        component.onCtrlGKeyDown(eventSpy);

        expect(popupManagerSpy.openCarrouselPopUp).toHaveBeenCalled();
        expect(eventSpy.preventDefault).toHaveBeenCalled();
    });
});
