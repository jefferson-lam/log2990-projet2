import { HttpClientModule } from '@angular/common/http';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import SpyObj = jasmine.SpyObj;
import { DiscardChangesPopupComponent } from '@app/components/main-page/discard-changes-popup/discard-changes-popup.component';
import { EMPTY, Observable, Subject } from 'rxjs';
import { MainPageComponent } from './main-page.component';

// tslint:disable: no-string-literal
// tslint:disable: no-any
describe('MainPageComponent', () => {
    let component: MainPageComponent;
    let fixture: ComponentFixture<MainPageComponent>;
    let dialogSpy: SpyObj<MatDialog>;
    let routerSpy: Router;

    beforeEach(async(() => {
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
        localStorage.setItem('autosave', 'teststring');

        component.ngOnInit();
        localStorage.clear();

        expect(component.ongoingDrawing).toBeTrue();
    });

    it('ngOnInit should call subscribe', () => {
        const subscribeSpy = spyOn(dialogSpy.afterAllClosed, 'subscribe').and.callThrough();
        component.ngOnInit();
        fixture.detectChanges();
        expect(subscribeSpy).toHaveBeenCalled();
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
        localStorage.setItem('autosave', 'teststring');
        const discardSubject = new Subject();
        dialogSpy.open.and.returnValue({ afterClosed: () => discardSubject.asObservable() } as any);

        component.newDrawing();
        discardSubject.next(true);
        localStorage.clear();

        expect(resetSpy).toHaveBeenCalled();
        expect(removeSpy).toHaveBeenCalled();
        expect(removeSpy).toHaveBeenCalledWith('autosave');
        expect(removeSpy).toHaveBeenCalledWith('initialDrawing');
        expect(routerSpy.navigate).toHaveBeenCalled();
        expect(routerSpy.navigate).toHaveBeenCalledWith(['/', 'editor']);
    });

    it('newDrawing should do nothing if autosavedrawing and pop up returns false', () => {
        const resetSpy = spyOn(component.undoRedoService, 'reset');
        const removeSpy = spyOn(localStorage, 'removeItem');
        localStorage.setItem('autosave', 'teststring');
        const discardSubject = new Subject();
        dialogSpy.open.and.returnValue({ afterClosed: () => discardSubject.asObservable() } as any);

        component.newDrawing();
        discardSubject.next(false);
        localStorage.clear();

        expect(resetSpy).not.toHaveBeenCalled();
        expect(removeSpy).not.toHaveBeenCalled();
        expect(routerSpy.navigate).not.toHaveBeenCalled();
        expect(routerSpy.navigate).not.toHaveBeenCalledWith(['/', 'editor']);
    });

    it('newDrawing should open pop up if autosave drawing exists', () => {
        localStorage.setItem('autosave', 'teststring');
        dialogSpy.open.and.returnValue({ afterClosed: () => EMPTY } as any);

        component.newDrawing();

        localStorage.clear();

        expect(dialogSpy.open).toHaveBeenCalled();
    });

    it('newDrawing should start new drawing if not autosavedrawing', () => {
        const resetSpy = spyOn(component.undoRedoService, 'reset');
        localStorage.clear();
        const removeSpy = spyOn(localStorage, 'removeItem');

        component.newDrawing();

        expect(resetSpy).toHaveBeenCalled();
        expect(removeSpy).toHaveBeenCalled();
        expect(removeSpy).toHaveBeenCalledWith('initialDrawing');
        expect(removeSpy).toHaveBeenCalled();
        expect(routerSpy.navigate).toHaveBeenCalled();
        expect(routerSpy.navigate).toHaveBeenCalledWith(['/', 'editor']);
    });

    it('on carousel button click, should open carrousel interface', () => {
        const backSpy = spyOn(component, 'openCarousel').and.callThrough();
        fixture.detectChanges();
        const btn = fixture.debugElement.nativeElement.querySelector('#carousel-button');
        btn.click();
        fixture.detectChanges();
        expect(backSpy).toHaveBeenCalledWith();
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
        localStorage.setItem('autosave', 'teststring');
        const setSpy = spyOn(localStorage, 'setItem');

        component.continueDrawing();
        localStorage.removeItem('autosave');

        expect(routerSpy.navigate).toHaveBeenCalled();
        expect(routerSpy.navigate).toHaveBeenCalledWith(['/', 'editor']);
        expect(setSpy).toHaveBeenCalled();
        expect(setSpy).toHaveBeenCalledWith('initialDrawing', 'teststring');
    });

    it('should open Carousel on control+g', () => {
        const carouselSpy = spyOn(component, 'openCarousel');
        const eventSpy = jasmine.createSpyObj('event', ['preventDefault'], { ctrlKey: true, code: 'KeyG', key: '' });
        component.isPopUpOpen = false;
        component.onCtrlGKeyDown(eventSpy);

        expect(carouselSpy).toHaveBeenCalled();
    });

    it('should not open Carousel on control+g if pop up is open', () => {
        const carouselSpy = spyOn(component, 'openCarousel');
        const eventSpy = jasmine.createSpyObj('event', ['preventDefault'], { ctrlKey: true, code: 'KeyG', key: '' });
        component.isPopUpOpen = true;
        component.onCtrlGKeyDown(eventSpy);

        expect(carouselSpy).not.toHaveBeenCalled();
    });

    it('when all popups are closed, isPopUpOpen is set to false', () => {
        dialogSpy._getAfterAllClosed.and.callFake(() => {
            return component.dialog['_afterAllClosedAtThisLevel'];
        });
        component.isPopUpOpen = true;

        component.dialog._getAfterAllClosed().next();

        expect(component.isPopUpOpen).toBeFalse();
    });
});
