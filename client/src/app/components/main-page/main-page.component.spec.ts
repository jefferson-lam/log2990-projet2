import { HttpClientModule } from '@angular/common/http';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterTestingModule } from '@angular/router/testing';
import { IndexService } from '@app/services/index/index.service';
import { of } from 'rxjs';
import { MainPageComponent } from './main-page.component';
import SpyObj = jasmine.SpyObj;

TestBed.configureTestingModule({
    declarations: [MainPageComponent],
    imports: [MatTooltipModule, MatIconModule],
    providers: [],
});

describe('MainPageComponent', () => {
    let component: MainPageComponent;
    let fixture: ComponentFixture<MainPageComponent>;
    let indexServiceSpy: SpyObj<IndexService>;
    const dialogStub = jasmine.createSpyObj('MatDialog', ['open']);

    beforeEach(async(() => {
        indexServiceSpy = jasmine.createSpyObj('IndexService', ['basicGet', 'basicPost']);
        indexServiceSpy.basicGet.and.returnValue(of({ title: '', body: '' }));
        indexServiceSpy.basicPost.and.returnValue(of());
        TestBed.configureTestingModule({
            imports: [RouterTestingModule, HttpClientModule],
            declarations: [MainPageComponent],
            providers: [
                { provide: IndexService, useValue: indexServiceSpy },
                { provide: MatDialog, useValue: dialogStub },
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

    it('should call basicGet when calling getMessagesFromServer', () => {
        component.getMessagesFromServer();
        expect(indexServiceSpy.basicGet).toHaveBeenCalled();
    });

    it('should call basicPost when calling sendTimeToServer', () => {
        component.sendTimeToServer();
        expect(indexServiceSpy.basicPost).toHaveBeenCalled();
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
        component.onCtrlGKeyDown(eventSpy);

        expect(carouselSpy).toHaveBeenCalled();
    });

    it('ngOnInit should call subscribe', () => {
        const subscribeSpy = spyOn(component.dialog.afterAllClosed, 'subscribe').and.callThrough();
        component.ngOnInit();

        expect(subscribeSpy).toHaveBeenCalled();
    });
});
