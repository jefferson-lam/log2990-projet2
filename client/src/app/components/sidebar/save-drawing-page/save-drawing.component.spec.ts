import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { MatDialogRef } from '@angular/material/dialog';
import * as SaveDrawingConstants from '@app/constants/save-drawing-constants';
import { DatabaseService } from '@app/services/database/database.service';
import { of, throwError } from 'rxjs';
import { SaveCompletePageComponent } from './save-complete-page/save-complete-page.component';
import { SaveDrawingComponent } from './save-drawing.component';
import { SaveErrorPageComponent } from './save-error-page/save-error-page.component';
import { SaveSavingPageComponent } from './save-saving-page/save-saving-page.component';
import { TagInputComponent } from './tag-input/tag-input.component';
import { TitleInputComponent } from './title-input/title-input.component';
import SpyObj = jasmine.SpyObj;

// tslint:disable:no-string-literal
// tslint:disable:no-any
describe('SaveDrawingComponent', () => {
    let component: SaveDrawingComponent;
    let fixture: ComponentFixture<SaveDrawingComponent>;
    let databaseServiceSpy: SpyObj<DatabaseService>;
    let fakeTagInputFixture: ComponentFixture<TagInputComponent>;
    let tagInputComponent: TagInputComponent;
    let fakeTitleInputFixture: ComponentFixture<TitleInputComponent>;
    let titleInputComponent: TitleInputComponent;
    let matDialogRefStub: MatDialogRef<any>;

    beforeEach(async(() => {
        databaseServiceSpy = jasmine.createSpyObj('DatabaseService', ['getDrawings', 'getDrawing', 'saveDrawing', 'dropDrawing']);
        matDialogRefStub = {} as MatDialogRef<any>;
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [
                { provide: DatabaseService, useValue: databaseServiceSpy },
                { provide: MatDialogRef, useValue: matDialogRefStub },
            ],
            declarations: [SaveDrawingComponent, SaveSavingPageComponent, SaveCompletePageComponent, SaveErrorPageComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SaveDrawingComponent);
        component = fixture.componentInstance;

        // Create tag fixture and inject it into save drawing
        fakeTagInputFixture = TestBed.createComponent(TagInputComponent);
        tagInputComponent = fakeTagInputFixture.componentInstance;
        component['tagInput'] = tagInputComponent;
        component['tagInput'].tags = [];

        // Create title fixture and inject it into save drawing
        fakeTitleInputFixture = TestBed.createComponent(TitleInputComponent);
        titleInputComponent = fakeTitleInputFixture.componentInstance;
        component['titleInput'] = titleInputComponent;
        component['titleInput'].title = 'testTitle';
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('verifyTitleValid should set isSavePossible to true if areTagsValid is already true', () => {
        const TITLE_IS_VALID = true;
        component.areTagsValid = true;
        component.verifyTitleValid(TITLE_IS_VALID);
        expect(component.isSavePossible).toBeTrue();
    });

    it('verifyTitleValid should set isSavePossible to false if areTagsValid is already false', () => {
        const TITLE_IS_VALID = true;
        component.areTagsValid = false;
        component.verifyTitleValid(TITLE_IS_VALID);
        expect(component.isSavePossible).toBeFalse();
    });

    it('verifyTagsValid should set isSavePossible to true if areTagsValid is already true', () => {
        const TAGS_ARE_VALID = true;
        component.isTitleValid = true;
        component.verifyTagsValid(TAGS_ARE_VALID);
        expect(component.isSavePossible).toBeTrue();
    });

    it('verifyTagsValid should set isSavePossible to false if areTagsValid is already false', () => {
        const TAGS_ARE_VALID = true;
        component.isTitleValid = false;
        component.verifyTagsValid(TAGS_ARE_VALID);
        expect(component.isSavePossible).toBeFalse();
    });

    it('should call saveDrawings when calling saveDrawings', () => {
        databaseServiceSpy.saveDrawing.and.returnValue(of({ title: 'Success', body: '' }));
        component.saveDrawing();
        expect(databaseServiceSpy.saveDrawing).toHaveBeenCalled();
    });

    it('should handle case where error message is received', async () => {
        databaseServiceSpy.saveDrawing.and.returnValue(of({ title: 'Error', body: '' }));
        component.saveDrawing();
        expect(databaseServiceSpy.saveDrawing).toHaveBeenCalled();
    });

    it('should handle setTimeoutError on saveDrawing', fakeAsync(() => {
        databaseServiceSpy.saveDrawing.and.returnValue(throwError(new Error('Timeout')));
        component.saveDrawing();
        tick(SaveDrawingConstants.TIMEOUT_MAX_TIME + 1);
        expect(component.saveProgress).toEqual(SaveDrawingConstants.SaveProgress.ERROR);
    }));

    it('should handle errors on saveDrawing', () => {
        databaseServiceSpy.saveDrawing.and.returnValue(throwError(new Error('Random')));
        component.saveDrawing();
        expect(component.saveProgress).toEqual(SaveDrawingConstants.SaveProgress.ERROR);
    });
});
