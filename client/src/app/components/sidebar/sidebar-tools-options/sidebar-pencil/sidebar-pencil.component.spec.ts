import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MAX_SIZE_PENCIL, MIN_SIZE_PENCIL } from '@app/services/tools/pencil-service';
import { SidebarPencilComponent } from './sidebar-pencil.component';

describe('SidebarPencilComponent', () => {
    let component: SidebarPencilComponent;
    let fixture: ComponentFixture<SidebarPencilComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [SidebarPencilComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SidebarPencilComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('changePencilSize should set size to MAX_SIZE_PENCIL if over MAX_SIZE_PENCIL', () => {
        component.changePencilSize(MAX_SIZE_PENCIL + 1);
        expect(component.size).toEqual(MAX_SIZE_PENCIL);
    });

    it('changePencilSize should set size to MIN_SIZE_PENCIL if under MIN_SIZE_PENCIL', () => {
        component.changePencilSize(MIN_SIZE_PENCIL - 1);
        expect(component.size).toEqual(MIN_SIZE_PENCIL);
    });

    it('changePencilSize should set size to value if between MAX and MIN_SIZE_PENCIL', () => {
        const medianSize = MIN_SIZE_PENCIL + (MAX_SIZE_PENCIL - MIN_SIZE_PENCIL) / 2;
        component.changePencilSize(medianSize);
        expect(component.size).toEqual(medianSize);
    });

    it('inputDiv should be assigned value of validated size', () => {
        const medianSize = MIN_SIZE_PENCIL + (MAX_SIZE_PENCIL - MIN_SIZE_PENCIL) / 2;
        component.changePencilSize(medianSize);

        // tslint:disable:no-string-literal
        expect(component['inputDiv'].value).toBe(medianSize.toString());
        // tslint:enable:no-string-literal
    });
});
