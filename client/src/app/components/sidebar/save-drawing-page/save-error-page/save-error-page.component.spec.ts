import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SaveErrorPageComponent } from './save-error-page.component';

describe('SavePageErrorComponent', () => {
    let component: SaveErrorPageComponent;
    let fixture: ComponentFixture<SaveErrorPageComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [SaveErrorPageComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SaveErrorPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
