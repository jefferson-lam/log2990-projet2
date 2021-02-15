import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NewDrawingBoxComponent } from './new-drawing-box.component';

describe('NewDrawingBoxComponent', () => {
    let component: NewDrawingBoxComponent;
    let fixture: ComponentFixture<NewDrawingBoxComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [NewDrawingBoxComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(NewDrawingBoxComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
