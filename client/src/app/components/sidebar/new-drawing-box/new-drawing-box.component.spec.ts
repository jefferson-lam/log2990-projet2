import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AutoSaveService } from '@app/services/auto-save/auto-save.service';
import { NewDrawingBoxComponent } from './new-drawing-box.component';

describe('NewDrawingBoxComponent', () => {
    let component: NewDrawingBoxComponent;
    let fixture: ComponentFixture<NewDrawingBoxComponent>;
    let autoSaveServiceSpy: jasmine.SpyObj<AutoSaveService>;

    beforeEach(async(() => {
        autoSaveServiceSpy = jasmine.createSpyObj('AutoSaveService', ['loadDrawing']);
        TestBed.configureTestingModule({
            declarations: [NewDrawingBoxComponent],
            providers: [{ provide: AutoSaveService, useValue: autoSaveServiceSpy }],
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

    it('newDrawing should remove autosave item from localStorage', () => {
        localStorage.setItem('autosave', 'test string');
        component.newDrawing();
        expect(localStorage.getItem('autosave')).toBeNull();
    });

    it('newDrawing should call autoSaveService loadDrawing', () => {
        component.newDrawing();
        expect(autoSaveServiceSpy.loadDrawing).toHaveBeenCalled();
    });
});
