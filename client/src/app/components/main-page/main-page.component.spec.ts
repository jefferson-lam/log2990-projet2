import { HttpClientModule } from '@angular/common/http';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable, Subject } from 'rxjs';
import { MainPageComponent } from './main-page.component';
import SpyObj = jasmine.SpyObj;

// tslint:disable: no-string-literal
describe('MainPageComponent', () => {
    let component: MainPageComponent;
    let fixture: ComponentFixture<MainPageComponent>;
    let dialogSpy: SpyObj<MatDialog>;

    beforeEach(async(() => {
        dialogSpy = jasmine.createSpyObj('MatDialog', ['open', 'closeAll', '_getAfterAllClosed'], ['afterAllClosed', '_afterAllClosedAtThisLevel']);
        (Object.getOwnPropertyDescriptor(dialogSpy, '_afterAllClosedAtThisLevel')?.get as jasmine.Spy<() => Subject<any>>).and.returnValue(
            new Subject<any>(),
        );
        (Object.getOwnPropertyDescriptor(dialogSpy, 'afterAllClosed')?.get as jasmine.Spy<() => Observable<void>>).and.returnValue(
            dialogSpy['_afterAllClosedAtThisLevel'].asObservable(),
        );
        TestBed.configureTestingModule({
            imports: [RouterTestingModule, HttpClientModule],
            declarations: [MainPageComponent],
            providers: [{ provide: MatDialog, useValue: dialogSpy }],
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

    it('on click, should open carrousel interface', () => {
        const backSpy = spyOn(component, 'openCarousel').and.callThrough();
        fixture.detectChanges();
        const btn = fixture.debugElement.nativeElement.querySelector('#carousel-button');
        btn.click();
        fixture.detectChanges();
        expect(backSpy).toHaveBeenCalledWith();
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

    it('ngOnInit should call subscribe', () => {
        const subscribeSpy = spyOn(dialogSpy.afterAllClosed, 'subscribe').and.callThrough();
        component.ngOnInit();
        fixture.detectChanges();
        expect(subscribeSpy).toHaveBeenCalled();
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
