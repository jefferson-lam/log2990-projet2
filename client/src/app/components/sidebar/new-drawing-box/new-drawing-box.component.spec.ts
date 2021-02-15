import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { NewDrawingBoxComponent } from './new-drawing-box.component';

describe('NewDrawingBoxComponent', () => {
    let component: NewDrawingBoxComponent;
    let fixture: ComponentFixture<NewDrawingBoxComponent>;
    let drawServiceSpy: jasmine.SpyObj<DrawingService>;

    beforeEach(async(() => {
        drawServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas']);
        TestBed.configureTestingModule({
            declarations: [NewDrawingBoxComponent],
            providers: [{ provide: DrawingService, useValue: drawServiceSpy }],
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

    it("should call clear canvas of base and preview layer of component's drawing service", () => {
        component.clearCanvas();
        expect(drawServiceSpy.clearCanvas).toHaveBeenCalled();
    });
});
