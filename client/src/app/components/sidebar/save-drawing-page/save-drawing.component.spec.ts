import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import * as SaveDrawingConstants from '@app/constants/save-drawing-constants';
import { DatabaseService } from '@app/services/database/database.service';
import { of, throwError } from 'rxjs';
import { SaveCompletePageComponent } from './save-complete-page/save-complete-page.component';
import { SaveDrawingComponent } from './save-drawing.component';
import { SaveErrorPageComponent } from './save-error-page/save-error-page.component';
import { SaveSavingPageComponent } from './save-saving-page/save-saving-page.component';
import { TagInputComponent } from './tag-input/tag-input.component';

import SpyObj = jasmine.SpyObj;

describe('SaveDrawingComponent', () => {
    let component: SaveDrawingComponent;
    let fixture: ComponentFixture<SaveDrawingComponent>;
    let databaseServiceSpy: SpyObj<DatabaseService>;
    let fakeTagInputFixture: ComponentFixture<TagInputComponent>;
    let tagInputComponent: TagInputComponent;

    beforeEach(async(() => {
        databaseServiceSpy = jasmine.createSpyObj('DatabaseService', ['getDrawings', 'getDrawing', 'saveDrawing', 'dropDrawing']);
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [{ provide: DatabaseService, useValue: databaseServiceSpy }],
            declarations: [SaveDrawingComponent, SaveSavingPageComponent, SaveCompletePageComponent, SaveErrorPageComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SaveDrawingComponent);
        component = fixture.componentInstance;
        fakeTagInputFixture = TestBed.createComponent(TagInputComponent);
        tagInputComponent = fakeTagInputFixture.componentInstance;
        component['tagInput'] = tagInputComponent;
        component['tagInput'].tags = [];
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should call saveDrawings when calling saveDrawings', () => {
        databaseServiceSpy.saveDrawing.and.returnValue(of({ title: 'Success', body: '' }));
        const testTitle = 'test';
        component.saveDrawing(testTitle);
        expect(databaseServiceSpy.saveDrawing).toHaveBeenCalled();
    });

    it('should handle case where error message is received', async () => {
        databaseServiceSpy.saveDrawing.and.returnValue(of({ title: 'Error', body: '' }));
        const testTitle = 'test';
        component.saveDrawing(testTitle);
        expect(databaseServiceSpy.saveDrawing).toHaveBeenCalled();
    });

    it('should handle setTimeoutError on saveDrawing', fakeAsync(() => {
        databaseServiceSpy.saveDrawing.and.returnValue(throwError(new Error('Timeout')));
        component.saveDrawing('testTitle');
        tick(SaveDrawingConstants.TIMEOUT_MAX_TIME + 1);
        expect(component.saveProgress).toEqual(SaveDrawingConstants.SaveProgress.ERROR);
    }));

    it('should handle errors on saveDrawing', () => {
        databaseServiceSpy.saveDrawing.and.returnValue(throwError(new Error('Random')));
        component.saveDrawing('testTitle');
        expect(component.saveProgress).toEqual(SaveDrawingConstants.SaveProgress.ERROR);
    });
});
