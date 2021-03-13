import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SaveCompletePageComponent } from './save-complete-page/save-complete-page.component';
import { SaveDrawingComponent } from './save-drawing.component';
import { SaveErrorPageComponent } from './save-error-page/save-error-page.component';
import { SaveSavingPageComponent } from './save-saving-page/save-saving-page.component';

describe('SaveDrawingComponent', () => {
    let httpMock: HttpTestingController;
    let component: SaveDrawingComponent;
    let fixture: ComponentFixture<SaveDrawingComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            declarations: [SaveDrawingComponent, SaveSavingPageComponent, SaveCompletePageComponent, SaveErrorPageComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();
        httpMock = TestBed.inject(HttpTestingController);
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SaveDrawingComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
