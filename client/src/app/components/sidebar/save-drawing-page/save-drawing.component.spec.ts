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

import SpyObj = jasmine.SpyObj;

fdescribe('SaveDrawingComponent', () => {
    let component: SaveDrawingComponent;
    let fixture: ComponentFixture<SaveDrawingComponent>;
    let databaseServiceSpy: SpyObj<DatabaseService>;

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
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('addTag should add a tag into tags if it is valid.', () => {
        const testTag = 'testTag';
        component.addTag(testTag);
        expect(component.tags.length).toBeGreaterThan(0);
    });

    it('deleteTag should remove tag from tags if it exists.', () => {
        const testTag = 'testTag';
        component.tags.push(testTag);
        component.deleteTag(testTag);
        expect(component.tags).not.toContain(testTag);
    });

    it('should call saveDrawings when calling saveDrawings', () => {
        databaseServiceSpy.saveDrawing.and.returnValue(of({ title: 'Success', body: '' }));
        const testTitle = 'test';
        const testTags = ['test'];
        component.saveDrawing(testTitle, testTags);
        expect(databaseServiceSpy.saveDrawing).toHaveBeenCalled();
    });

    it('should handle case where error message is received', async () => {
        databaseServiceSpy.saveDrawing.and.returnValue(of({ title: 'Error', body: '' }));
        const testTitle = 'test';
        const testTags = ['test'];
        component.saveDrawing(testTitle, testTags);
        expect(databaseServiceSpy.saveDrawing).toHaveBeenCalled();
    });

    it('should handle setTimeoutError on saveDrawing', fakeAsync(() => {
        databaseServiceSpy.saveDrawing.and.returnValue(throwError(new Error('Timeout')));
        component.saveDrawing('testTitle', ['testTag']);
        tick(SaveDrawingConstants.TIMEOUT_MAX_TIME + 1);
        expect(component.saveProgress).toEqual(SaveDrawingConstants.SaveProgress.ERROR);
    }));
});
