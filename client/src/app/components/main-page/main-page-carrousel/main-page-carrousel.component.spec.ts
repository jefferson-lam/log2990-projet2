import { HttpClientModule } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatChipsModule } from '@angular/material/chips';
import { BrowserModule } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { DatabaseService } from '@app/services/database/database.service';
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

    beforeEach(async(() => {
        databaseServiceSpy = jasmine.createSpyObj('DatabaseService', ['getDrawingsByTags', 'getDrawings']);
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

        localServerServiceSpy = jasmine.createSpyObj('localServerService', ['getDrawingById']);
        localServerServiceSpy.getDrawingById.and.returnValue(of({ id: '123', image: 'testpng' }));
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
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('resetShowcasedDrawings should call getDrawingsByTag if tagsValue has more than one tag', () => {
        component.tags = ['test1', 'test2'];
        component['resetShowcasedDrawings']();
        expect(databaseServiceSpy.getDrawingsByTags).toHaveBeenCalledWith(component.tags);
    });

    it('resetShowcasedDrawings should call getDrawings if tagsValue has no tags', () => {
        component.tags = [];
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
});
