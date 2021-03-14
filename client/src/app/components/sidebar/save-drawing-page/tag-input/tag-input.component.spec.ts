import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TagInputComponent } from './tag-input.component';

describe('TagValidatorComponent', () => {
    let component: TagInputComponent;
    let fixture: ComponentFixture<TagInputComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [TagInputComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TagInputComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
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
});
