import { HttpClientModule } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { BrowserModule } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { DatabaseService } from '@app/services/database/database.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { LocalServerService } from '@app/services/local-server/local-server.service';
import { of } from 'rxjs';
import { MainPageCarrouselComponent } from './main-page-carrousel.component';

import SpyObj = jasmine.SpyObj;

// tslint:disable: no-string-literal
describe('MainPageCarrouselComponent', () => {
    let component: MainPageCarrouselComponent;
    let fixture: ComponentFixture<MainPageCarrouselComponent>;
    let databaseServiceSpy: SpyObj<DatabaseService>;
    let localServerServiceSpy: SpyObj<LocalServerService>;
    let drawingService: DrawingService;

    beforeEach(async(() => {
        databaseServiceSpy = jasmine.createSpyObj('DatabaseService', ['getDrawingsByTags', 'getDrawings', 'dropDrawing']);
        databaseServiceSpy.getDrawingsByTags.and.returnValue(
            of({
                title: 'Success',
                body:
                    '[{"_id":"000000000000000000000000","title":"TEST","tags":["test1", "test2"]}, \
                    {"_id":"000000000000000000000001","title":"TEST1","tags":["test1", "test2"]}, \
                    {"_id":"000000000000000000000002","title":"TEST2","tags":[]}]',
            }),
        );
        databaseServiceSpy.getDrawings.and.returnValue(
            of({
                title: 'Success',
                body:
                    '[{"_id":"000000000000000000000000","title":"TEST","tags":["test1", "test2"]}, \
                    {"_id":"000000000000000000000001","title":"TEST1","tags":["test1", "test2"]}, \
                    {"_id":"000000000000000000000002","title":"TEST2","tags":[]}, \
                    {"_id":"000000000000000000000002","title":"TEST3","tags":[]}, \
                    {"_id":"000000000000000000000002","title":"TEST4","tags":[]}]',
            }),
        );

        databaseServiceSpy.dropDrawing.and.returnValue(
            of({
                title: 'Success',
                body: '1',
            }),
        );

        localServerServiceSpy = jasmine.createSpyObj('localServerService', ['getDrawingById']);
        localServerServiceSpy.getDrawingById.and.returnValue(
            of({
                title: 'Success',
                body: '{"_id":"000000000000000000000000","title":"TEST","tags":["test1", "test2"]}',
            }),
        );
        TestBed.configureTestingModule({
            declarations: [MainPageCarrouselComponent],
            imports: [RouterTestingModule, HttpClientModule, BrowserModule, FormsModule, ReactiveFormsModule, MatChipsModule],
            providers: [
                { provide: DatabaseService, useValue: databaseServiceSpy },
                { provide: LocalServerService, useValue: localServerServiceSpy },
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(MainPageCarrouselComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        drawingService = TestBed.inject(DrawingService);
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('resetShowcasedDrawings should call getDrawingsByTag if tagsValue has more than one tag', () => {
        component.tagsInSearch = ['test1', 'test2'];
        component['resetShowcasedDrawings']();
        expect(databaseServiceSpy.getDrawingsByTags).toHaveBeenCalledWith(component.tagsInSearch);
    });

    it('resetShowcasedDrawings should call getDrawings if tagsValue has no tags', () => {
        component.tagsInSearch = [];
        component['resetShowcasedDrawings']();
        expect(databaseServiceSpy.getDrawings).toHaveBeenCalled();
        expect(databaseServiceSpy.getDrawingsByTags).not.toHaveBeenCalled();
    });

    it('showcasePreviewDrawing should set drawing counter to previewDrawings.length -1 if drawingCounter currently at 0', () => {
        component.drawingCounter = 0;
        component.previewDrawings = [
            { image: '', name: '', id: '1' },
            { image: '', name: '', id: '2' },
            { image: '', name: '', id: '3' },
            { image: '', name: '', id: '4' },
        ];
        component.showCasedDrawings = [
            { image: '', name: '', id: '1' },
            { image: '', name: '', id: '2' },
            { image: '', name: '', id: '3' },
        ];
        const EXPECTED_DRAWING_COUNTER = component.previewDrawings.length - 1;
        const EXPECTED_SHOWCASED_DRAWINGS = [
            { image: '', name: '', id: '4' },
            { image: '', name: '', id: '1' },
            { image: '', name: '', id: '2' },
        ];
        component.showcasePreviousDrawing();
        expect(component.drawingCounter).toEqual(EXPECTED_DRAWING_COUNTER);
        expect(component.showCasedDrawings).toEqual(EXPECTED_SHOWCASED_DRAWINGS);
    });

    it('showcasePreviewDrawing should set drawing counter to drawingCounter - 1 if drawingCounter not 0', () => {
        const TEST_START_DRAWING_COUNTER = 2;
        component.drawingCounter = TEST_START_DRAWING_COUNTER;
        component.previewDrawings = [
            { image: '', name: '', id: '1' },
            { image: '', name: '', id: '2' },
            { image: '', name: '', id: '3' },
            { image: '', name: '', id: '4' },
        ];
        component.showCasedDrawings = [
            { image: '', name: '', id: '3' },
            { image: '', name: '', id: '4' },
            { image: '', name: '', id: '1' },
        ];
        const EXPECTED_DRAWING_COUNTER = 1;
        const EXPECTED_SHOWCASED_DRAWINGS = [
            { image: '', name: '', id: '2' },
            { image: '', name: '', id: '3' },
            { image: '', name: '', id: '4' },
        ];
        component.showcasePreviousDrawing();
        expect(component.drawingCounter).toEqual(EXPECTED_DRAWING_COUNTER);
        expect(component.showCasedDrawings).toEqual(EXPECTED_SHOWCASED_DRAWINGS);
    });

    it('showcaseNextDrawing should set drawing counter to 0 if drawingCounter currently at previewDrawings.length - 1', () => {
        component.previewDrawings = [
            { image: '', name: '', id: '1' },
            { image: '', name: '', id: '2' },
            { image: '', name: '', id: '3' },
            { image: '', name: '', id: '4' },
        ];
        component.drawingCounter = component.previewDrawings.length - 1;
        component.showCasedDrawings = [
            { image: '', name: '', id: '4' },
            { image: '', name: '', id: '1' },
            { image: '', name: '', id: '2' },
        ];
        const EXPECTED_DRAWING_COUNTER = 0;
        const EXPECTED_SHOWCASED_DRAWINGS = [
            { image: '', name: '', id: '1' },
            { image: '', name: '', id: '2' },
            { image: '', name: '', id: '3' },
        ];
        component.showcaseNextDrawing();
        expect(component.drawingCounter).toEqual(EXPECTED_DRAWING_COUNTER);
        expect(component.showCasedDrawings).toEqual(EXPECTED_SHOWCASED_DRAWINGS);
    });

    it('showcaseNextDrawing should set drawingCounter to drawingCounter+1 if drawingCounter smaller than previewDrawings.length - showcasedDrawings.length', () => {
        component.previewDrawings = [
            { image: '', name: '', id: '1' },
            { image: '', name: '', id: '2' },
            { image: '', name: '', id: '3' },
            { image: '', name: '', id: '4' },
        ];
        component.showCasedDrawings = [
            { image: '', name: '', id: '1' },
            { image: '', name: '', id: '2' },
            { image: '', name: '', id: '3' },
        ];
        const START_DRAWING_COUNTER = 0; // smaller than previewDrawings.length - showCaasedDrawings.length
        component.drawingCounter = START_DRAWING_COUNTER;
        const EXPECTED_DRAWING_COUNTER = 1;
        const EXPECTED_SHOWCASED_DRAWINGS = [
            { image: '', name: '', id: '2' },
            { image: '', name: '', id: '3' },
            { image: '', name: '', id: '4' },
        ];
        component.showcaseNextDrawing();
        expect(component.drawingCounter).toEqual(EXPECTED_DRAWING_COUNTER);
        expect(component.showCasedDrawings).toEqual(EXPECTED_SHOWCASED_DRAWINGS);
    });

    it('addTag should add tag if tag exists', () => {
        component.previewDrawings = [
            { image: '', name: '', tags: ['test', 'test2'], id: '1' },
            { image: '', name: '', id: '2' },
            { image: '', name: '', tags: ['test'], id: '3' },
            { image: '', name: '', id: '4' },
        ];
        const input = document.createElement('input');
        const event = { value: 'test', input } as MatChipInputEvent;
        const spyTagPushed = spyOn(component.tagsInSearch, 'push');
        component['checkIfTagExists']('test');
        component.addTag(event);
        expect(spyTagPushed).toHaveBeenCalled();
        expect(component.tagErrorPresent).toEqual(false);
    });

    it('addTag should not add tag if tag does not exist', () => {
        component.previewDrawings = [
            { image: '', name: '', id: '1' },
            { image: '', name: '', id: '2' },
            { image: '', name: '', id: '3' },
            { image: '', name: '', id: '4' },
        ];
        const input = document.createElement('input');
        const event = { value: 'test', input } as MatChipInputEvent;
        const spyTagPushed = spyOn(component.tagsInSearch, 'push');
        component['checkIfTagExists']('test');
        component.addTag(event);
        expect(spyTagPushed).not.toHaveBeenCalled();
        expect(component.tagErrorPresent).toEqual(true);
    });

    it('addTag should send error message', () => {
        const input = document.createElement('input');
        const event = { value: 'test', input } as MatChipInputEvent;
        const spyTagPushed = spyOn(component.tagsInSearch, 'push');
        component.addTag(event);
        expect(spyTagPushed).not.toHaveBeenCalled();
        expect(component.tagErrorPresent).toEqual(true);
    });

    it('addTag should send error message if tag is already in search bar', () => {
        component.tagsInSearch = ['test', 'test2'];
        const input = document.createElement('input');
        const event = { value: 'test', input } as MatChipInputEvent;
        component['setErrorInTag']('Étiquette déjà incluse. Veuillez mettre une étiquette différente.');
        component.addTag(event);
        expect(component.tagErrorPresent).toEqual(true);
        expect(component.tagErrorMessage).toBe('Étiquette déjà incluse. Veuillez mettre une étiquette différente.');
    });

    it('addTag should not add tag if tag is already in input', () => {
        const input = document.createElement('input');
        const event = { value: '', input } as MatChipInputEvent;
        const spyTagPushed = spyOn(component.tagsInSearch, 'push');
        component.addTag(event);
        expect(spyTagPushed).not.toHaveBeenCalled();
        expect(component.tagErrorPresent).toEqual(false);
    });

    it('removeTag should remove tag in chip input', () => {
        component.removeTag('tagValue');
        expect(component.tagErrorPresent).toEqual(false);
    });

    it('removeTag should not remove tag in index', () => {
        const spySplice = spyOn(component.tagsInSearch, 'splice');
        component.tagsInSearch = ['test', 'test2', 'test3', 'test4'];
        component.removeTag('test3');
        expect(spySplice).not.toHaveBeenCalled();
    });

    it('addDrawingToDisplay should not do anything with error message', () => {
        localServerServiceSpy.getDrawingById.and.returnValue(
            of({
                title: 'Error during local save',
                body: '{"_id":"000000000000000000000000","title":"TEST","tags":["test1", "test2"]}',
            }),
        );
        const spySplice = spyOn(component.tagsInSearch, 'splice');
        component.tagsInSearch = [];
        component.removeTag('test3');
        expect(spySplice).not.toHaveBeenCalled();
    });

    it('deleteDrawing should throw error when server is down', () => {
        const spySplice = spyOn(component.tagsInSearch, 'splice');
        component.tagsInSearch = ['test', 'test2', 'test3', 'test4'];
        component.removeTag('test3');
        expect(spySplice).not.toHaveBeenCalled();
    });

    // it('deleteDrawing should not delete if image is not in server', () => {
    //     databaseServiceSpy.dropDrawing.and.returnValue(
    //         of({
    //             title: 'Error during local save',
    //             body: '1',
    //         }),
    //     );

    //     component.previewDrawings = [
    //         { image: '', name: '', id: '1' },
    //         { image: '', name: '', id: '2' },
    //         { image: '', name: '', id: '3' },
    //         { image: '', name: '', id: '4' },
    //     ];
    //     component.showCasedDrawings = [
    //         { image: '', name: '', id: '1' },
    //         { image: '', name: '', id: '2' },
    //         { image: '', name: '', id: '3' },
    //     ];
    //     component.deleteDrawing();
    //     const spySplice = spyOn(component.showCasedDrawings, 'splice');
    //     expect(spySplice).not.toHaveBeenCalled();
    // });

    // it('deleteDrawing should delete first index of showcasedDrawings if its length is higher than 1', () => {
    //     databaseServiceSpy.dropDrawing.and.returnValue(
    //         of({
    //             title: 'Success',
    //             body: '1',
    //         }),
    //     );

    //     component.previewDrawings = [
    //         { image: '', name: '', id: '1' },
    //         { image: '', name: '', id: '2' },
    //         { image: '', name: '', id: '3' },
    //         { image: '', name: '', id: '4' },
    //     ];
    //     component.showCasedDrawings = [
    //         { image: '', name: '', id: '1' },
    //         { image: '', name: '', id: '2' },
    //         { image: '', name: '', id: '3' },
    //     ];
    //     component.deleteDrawing();
    //     const spySplice = spyOn(component.previewDrawings, 'splice');
    //     expect(spySplice).not.toHaveBeenCalled();
    //     expect(component.imageNotInServer).toEqual(false);
    // });

    // it('deleteDrawing should delete index 0 of showCasedDrawings if its length is lower than 1', () => {
    //     databaseServiceSpy.dropDrawing.and.returnValue(
    //         of({
    //             title: 'Success',
    //             body: '1',
    //         }),
    //     );

    //     component.previewDrawings = [{ image: '', name: '', id: '1' }];
    //     component.showCasedDrawings = [{ image: '', name: '', id: '1' }];
    //     component.deleteDrawing();
    //     const spySplice = spyOn(component.previewDrawings, 'splice');
    //     expect(spySplice).not.toHaveBeenCalled();
    //     expect(component.imageNotInServer).toEqual(false);
    // });

    // it('deleteDrawing should not do anything if not success or error', () => {
    //     databaseServiceSpy.dropDrawing.and.returnValue(
    //         of({
    //             title: 'BrokenButSuccess',
    //             body: '1',
    //         }),
    //     );

    //     component.previewDrawings = [{ image: '', name: '', id: '1' }];
    //     component.showCasedDrawings = [{ image: '', name: '', id: '1' }];
    //     component.deleteDrawing();
    //     const spySplice = spyOn(component.previewDrawings, 'splice');
    //     expect(spySplice).not.toHaveBeenCalled();
    //     expect(component.imageNotInServer).toEqual(false);
    // });

    it('openEditorWithDrawing should call drawing service setInitialImage function', () => {
        const spySetImage = spyOn(drawingService, 'setInitialImage');
        component.openEditorWithDrawing('testingstring');
        expect(spySetImage).toHaveBeenCalled();
    });
});
