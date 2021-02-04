import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MainPageCarrouselComponent } from './main-page-carrousel.component';

describe('MainPageCarrouselComponent', () => {
    let component: MainPageCarrouselComponent;
    let fixture: ComponentFixture<MainPageCarrouselComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [MainPageCarrouselComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(MainPageCarrouselComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
