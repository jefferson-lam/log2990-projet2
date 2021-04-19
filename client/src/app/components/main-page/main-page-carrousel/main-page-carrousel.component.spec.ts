import { HttpClientModule } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, fakeAsync, flush, TestBed, tick } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { BrowserModule } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { DiscardChangesPopupComponent } from '@app/components/main-page/discard-changes-popup/discard-changes-popup.component';
import { DatabaseService } from '@app/services/database/database.service';
import { LocalServerService } from '@app/services/local-server/local-server.service';
import { of, Subject } from 'rxjs';
import { MainPageCarrouselComponent } from './main-page-carrousel.component';

import SpyObj = jasmine.SpyObj;
// tslint:disable: max-file-line-count
// tslint:disable: no-string-literal
describe('MainPageCarrouselComponent', () => {
    let component: MainPageCarrouselComponent;
    let fixture: ComponentFixture<MainPageCarrouselComponent>;
    let databaseServiceSpy: SpyObj<DatabaseService>;
    let localServerServiceSpy: SpyObj<LocalServerService>;
    let matDialogRefSpy: SpyObj<MatDialogRef<DiscardChangesPopupComponent>>;
    let dialogSpy: SpyObj<MatDialog>;
    let routerSpy: SpyObj<Router>;
    const mockImageURL = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAADElEQVQImWNgoBMAAABpAAFEI8ARAAAAAElFTkSuQmCC';
    const TICK_TIME = 50;

    beforeEach(async(() => {
        routerSpy = jasmine.createSpyObj('Router', ['navigate']);
        matDialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);
        dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
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

        localServerServiceSpy = jasmine.createSpyObj('localServerService', ['getDrawingById', 'deleteDrawing']);
        localServerServiceSpy.getDrawingById.and.returnValue(
            of({
                title: 'Success',
                body:
                    '{"image":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAADElEQVQImWNgoBMAAABpAAFEI8ARAAAAAElFTkSuQmCC","name":"TEST","tags":["test1","test2"],"id":"0"}',
            }),
        );

        localServerServiceSpy.deleteDrawing.and.returnValue(of({ title: 'Success', body: 'Drawing successfully deleted' }));
        TestBed.configureTestingModule({
            declarations: [MainPageCarrouselComponent],
            imports: [RouterTestingModule, HttpClientModule, BrowserModule, FormsModule, ReactiveFormsModule, MatChipsModule],
            providers: [
                { provide: DatabaseService, useValue: databaseServiceSpy },
                { provide: LocalServerService, useValue: localServerServiceSpy },
                { provide: MatDialog, useValue: dialogSpy },
                { provide: Router, useValue: routerSpy },
                { provide: MatDialogRef, useValue: matDialogRefSpy },
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
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

    it('showcasePreviousDrawing should not fire when there are no showcasedDrawings', () => {
        const popSpy = spyOn(component.showCasedDrawings, 'pop');
        component.showCasedDrawings = [];
        component.showcasePreviousDrawing();
        expect(popSpy).not.toHaveBeenCalled();
    });

    it('openDrawing should close if autosavedrawing', () => {
        localStorage.setItem('autosave', mockImageURL);

        component.openDrawing(mockImageURL);
        localStorage.clear();

        expect(matDialogRefSpy.close).toHaveBeenCalled();
        expect(matDialogRefSpy.close).toHaveBeenCalledWith({ autosave: true, data: mockImageURL });
    });

    it('openDrawing should do nothing if autosavedrawing and pop up returns false', () => {
        localStorage.setItem('autosave', mockImageURL);
        const setSpy = spyOn(localStorage, 'setItem');
        const discardSubject = new Subject();
        dialogSpy.open.and.returnValue({ afterClosed: () => discardSubject.asObservable() } as MatDialogRef<DiscardChangesPopupComponent>);

        component.openDrawing(mockImageURL);
        discardSubject.next(false);
        localStorage.clear();

        expect(setSpy).not.toHaveBeenCalled();
        expect(routerSpy.navigate).not.toHaveBeenCalled();
        expect(routerSpy.navigate).not.toHaveBeenCalledWith(['/', 'editor']);
    });

    it('openDrawing should set drawing if not autosavedrawing', () => {
        localStorage.clear();
        const setSpy = spyOn(localStorage, 'setItem');

        component.openDrawing(mockImageURL);

        expect(setSpy).toHaveBeenCalled();
        expect(setSpy).toHaveBeenCalledWith('autosave', mockImageURL);
        expect(routerSpy.navigate).toHaveBeenCalled();
        expect(routerSpy.navigate).toHaveBeenCalledWith(['/', 'editor']);
    });

    it('showCaseNextDrawing should not move to any drawing whatsoever if number of drawings in showcase is 0.', () => {
        component.showCasedDrawings = [];

        component.showcaseNextDrawing();

        expect(component.showCasedDrawings.length).toEqual(0);
    });

    it('deleteDrawing should throw error when calling dropDrawing from database', fakeAsync(() => {
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

        databaseServiceSpy.dropDrawing.and.returnValue(
            of({
                title: 'Error',
                body: 'Image not in server',
            }),
        );

        const spySplice = spyOn(component.previewDrawings, 'splice');
        component.deleteDrawing();
        tick(TICK_TIME);
        expect(spySplice).not.toHaveBeenCalled();
        flush();
    }));

    it('deleteDrawing should throw error when timeout has occured', fakeAsync(() => {
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

        databaseServiceSpy.dropDrawing.and.returnValue(
            of({
                title: 'Error',
                body: 'Timeout has occured',
            }),
        );

        const spySplice = spyOn(component.previewDrawings, 'splice');
        component.deleteDrawing();
        tick(TICK_TIME);
        expect(spySplice).not.toHaveBeenCalled();
        flush();
    }));

    it('deleteDrawing should throw error when calling deleteDrawing from local-server', fakeAsync(() => {
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

        localServerServiceSpy.deleteDrawing.and.returnValue(
            of({
                title: 'Error during local save',
                body: 'Image',
            }),
        );

        const spySplice = spyOn(component.previewDrawings, 'splice');
        component.deleteDrawing();
        tick(TICK_TIME);
        expect(spySplice).not.toHaveBeenCalled();
        flush();
    }));

    it('deleteDrawing should delete selected drawing', fakeAsync(() => {
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
        const spySplice = spyOn(component.previewDrawings, 'splice');
        component.deleteDrawing();
        tick(TICK_TIME);
        expect(spySplice).toHaveBeenCalled();
        expect(component.imageNotInServer).toBeFalse();
        flush();
    }));

    it('deleteDrawing should delete drawing when there is only one', fakeAsync(() => {
        component.previewDrawings = [{ image: '', name: '', id: '1' }];
        component.showCasedDrawings = [{ image: '', name: '', id: '1' }];
        const spySplice = spyOn(component.showCasedDrawings, 'splice');

        component.deleteDrawing();
        tick(TICK_TIME);
        expect(spySplice).toHaveBeenCalled();
        tick(TICK_TIME);
        expect(component.imageNotInServer).toBeFalse();
        flush();
    }));

    it('removeTag should catch error getDrawingsByTags in resetShowcasedDrawings', fakeAsync(() => {
        databaseServiceSpy.getDrawingsByTags.and.returnValue(
            of({
                title: 'Error',
                body: '',
            }),
        );
        tick(TICK_TIME);
        component.tagsInSearch = ['test1', 'test2', 'test3', 'test4'];
        const spySplice = spyOn(component.tagsInSearch, 'splice');
        component.removeTag('test3');
        tick(TICK_TIME);
        expect(spySplice).toHaveBeenCalled();
        flush();
    }));

    it('removeTag should catch error getDrawings in resetShowcasedDrawings', fakeAsync(() => {
        component.previewDrawings = [{ image: '', name: '', id: '1' }];
        component.showCasedDrawings = [{ image: '', name: '', id: '1' }];
        databaseServiceSpy.getDrawings.and.returnValue(
            of({
                title: 'Error',
                body: '',
            }),
        );
        component.tagsInSearch = [];
        const spySplice = spyOn(component.tagsInSearch, 'splice');
        component.removeTag('test');
        tick(TICK_TIME);
        expect(spySplice).not.toHaveBeenCalled();
        flush();
    }));
});
