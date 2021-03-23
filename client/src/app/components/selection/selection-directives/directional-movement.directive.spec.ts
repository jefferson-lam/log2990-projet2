import { DebugElement } from '@angular/core';
import { ComponentFixture, fakeAsync, flush, TestBed, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { SelectionComponent } from '@app/components/selection/selection.component';
import { DirectionalMovementDirective } from './directional-movement.directive';

describe('DirectionalMovementDirective', () => {
    let fixture: ComponentFixture<SelectionComponent>;
    let directive: DirectionalMovementDirective;
    let selectionCanvas: DebugElement;
    let delaySpy: jasmine.Spy;

    const FIRST_PRESS_DELAY = 500;
    const CONTINUOUS_PRESS_DELAY = 100;
    const NUM_PIXELS = 3;

    beforeEach(() => {
        fixture = TestBed.configureTestingModule({
            declarations: [DirectionalMovementDirective, SelectionComponent],
        }).createComponent(SelectionComponent);
        fixture.detectChanges();
        selectionCanvas = fixture.debugElement.query(By.directive(DirectionalMovementDirective));
        directive = new DirectionalMovementDirective(selectionCanvas);
        delaySpy = spyOn(directive, 'delay').and.callThrough();
    });

    it('should create an instance', () => {
        expect(directive).toBeTruthy();
    });

    it('onKeyboardDown should immediately return if Escape key is pressed', () => {
        const eventSpy = jasmine.createSpyObj('event', ['preventDefault'], { key: 'Escape' });
        expect(() => {
            directive.onKeyboardDown(eventSpy);
        }).not.toThrow();
    });

    it('onKeyBoardDown should move selection left by NUM_PIXELS pixels if released immediately after specified timeout', fakeAsync((): void => {
        const eventSpy = jasmine.createSpyObj('event', ['preventDefault'], { key: 'ArrowLeft', timeStamp: '100' });

        selectionCanvas.nativeElement.style.left = '10px';
        selectionCanvas.nativeElement.style.top = '10px';
        selectionCanvas.nativeElement.style.right = '10px';

        const INITIAL_LEFT_POSITION = selectionCanvas.nativeElement.style.left;
        const INITIAL_TOP_POSITION = selectionCanvas.nativeElement.style.top;

        const EXPECTED_LEFT_END_POSITION = parseInt(INITIAL_LEFT_POSITION, 10) - NUM_PIXELS + 'px';
        const EXPECTED_TOP_POSITION = INITIAL_TOP_POSITION;

        directive.onKeyboardDown(eventSpy);
        expect(selectionCanvas.nativeElement.style.left).toEqual(EXPECTED_LEFT_END_POSITION);
        expect(selectionCanvas.nativeElement.style.top).toEqual(INITIAL_TOP_POSITION);

        tick(FIRST_PRESS_DELAY);
        expect(selectionCanvas.nativeElement.style.left).toEqual(EXPECTED_LEFT_END_POSITION);
        expect(selectionCanvas.nativeElement.style.top).toEqual(EXPECTED_TOP_POSITION);
        flush();
    }));

    it('onKeyBoardDown should move selection right by NUM_PIXELS pixels if released immediately after specified timeout', fakeAsync((): void => {
        const eventSpyPressDown = jasmine.createSpyObj('event', ['preventDefault'], { key: 'ArrowRight', timeStamp: '100' });

        selectionCanvas.nativeElement.style.left = '10px';
        selectionCanvas.nativeElement.style.top = '10px';
        selectionCanvas.nativeElement.style.right = '10px';

        const INITIAL_LEFT_POSITION = selectionCanvas.nativeElement.style.left;
        const INITIAL_TOP_POSITION = selectionCanvas.nativeElement.style.top;

        const EXPECTED_LEFT_END_POSITION = parseInt(INITIAL_LEFT_POSITION, 10) + NUM_PIXELS + 'px';
        const EXPECTED_TOP_END_POSITION = INITIAL_TOP_POSITION;

        directive.onKeyboardDown(eventSpyPressDown);
        expect(selectionCanvas.nativeElement.style.left).toEqual(EXPECTED_LEFT_END_POSITION);
        expect(selectionCanvas.nativeElement.style.top).toEqual(INITIAL_TOP_POSITION);

        tick(FIRST_PRESS_DELAY);
        expect(selectionCanvas.nativeElement.style.left).toEqual(EXPECTED_LEFT_END_POSITION);
        expect(selectionCanvas.nativeElement.style.top).toEqual(EXPECTED_TOP_END_POSITION);

        const eventSpyPressUp = jasmine.createSpyObj('event', ['preventDefault'], { key: 'ArrowRight', timeStamp: '100' });
        directive.onKeyboardUp(eventSpyPressUp);
        expect(directive.keyPressed.get('ArrowRight')).toBe(0);

        // Make sure that selection canvas hasn't moved with keyboard up
        expect(selectionCanvas.nativeElement.style.left).toEqual(EXPECTED_LEFT_END_POSITION);
        expect(selectionCanvas.nativeElement.style.top).toEqual(EXPECTED_TOP_END_POSITION);

        flush();
    }));

    it('onKeyBoardDown should move selection down by NUM_PIXELS pixels if released immediately after specified timeout', fakeAsync((): void => {
        const eventSpy = jasmine.createSpyObj('event', ['preventDefault'], { key: 'ArrowDown', timeStamp: '100' });

        selectionCanvas.nativeElement.style.left = '10px';
        selectionCanvas.nativeElement.style.top = '10px';
        selectionCanvas.nativeElement.style.right = '10px';

        const INITIAL_LEFT_POSITION = selectionCanvas.nativeElement.style.left;
        const INITIAL_TOP_POSITION = selectionCanvas.nativeElement.style.top;

        const EXPECTED_TOP_END_POSITION = parseInt(INITIAL_LEFT_POSITION, 10) + NUM_PIXELS + 'px';
        const EXPECTED_LEFT_END_POSITION = INITIAL_TOP_POSITION;

        directive.onKeyboardDown(eventSpy);
        expect(selectionCanvas.nativeElement.style.left).toEqual(INITIAL_LEFT_POSITION);
        expect(selectionCanvas.nativeElement.style.top).toEqual(EXPECTED_TOP_END_POSITION);

        tick(FIRST_PRESS_DELAY);
        expect(selectionCanvas.nativeElement.style.left).toEqual(EXPECTED_LEFT_END_POSITION);
        expect(selectionCanvas.nativeElement.style.top).toEqual(EXPECTED_TOP_END_POSITION);

        const eventSpyPressUp = jasmine.createSpyObj('event', ['preventDefault'], { key: 'ArrowRight', timeStamp: '100' });
        directive.onKeyboardUp(eventSpyPressUp);
        expect(directive.keyPressed.get('ArrowRight')).toBe(0);

        // Make sure that selection canvas hasn't moved with keyboard up
        expect(selectionCanvas.nativeElement.style.left).toEqual(EXPECTED_LEFT_END_POSITION);
        expect(selectionCanvas.nativeElement.style.top).toEqual(EXPECTED_TOP_END_POSITION);
        flush();
    }));

    it('onKeyBoardDown should move selection up by NUM_PIXELS pixels if released immediately after specified timeout', fakeAsync((): void => {
        const eventSpy = jasmine.createSpyObj('event', ['preventDefault'], { key: 'ArrowUp', timeStamp: '100' });

        selectionCanvas.nativeElement.style.left = '10px';
        selectionCanvas.nativeElement.style.top = '10px';
        selectionCanvas.nativeElement.style.right = '10px';

        const INITIAL_LEFT_POSITION = selectionCanvas.nativeElement.style.left;
        const INITIAL_TOP_POSITION = selectionCanvas.nativeElement.style.top;

        const EXPECTED_TOP_END_POSITION = parseInt(INITIAL_LEFT_POSITION, 10) - NUM_PIXELS + 'px';
        const EXPECTED_LEFT_END_POSITION = INITIAL_TOP_POSITION;

        directive.onKeyboardDown(eventSpy);
        expect(selectionCanvas.nativeElement.style.left).toEqual(INITIAL_LEFT_POSITION);
        expect(selectionCanvas.nativeElement.style.top).toEqual(EXPECTED_TOP_END_POSITION);

        tick(FIRST_PRESS_DELAY);
        expect(selectionCanvas.nativeElement.style.left).toEqual(EXPECTED_LEFT_END_POSITION);
        expect(selectionCanvas.nativeElement.style.top).toEqual(EXPECTED_TOP_END_POSITION);

        const eventSpyPressUp = jasmine.createSpyObj('event', ['preventDefault'], { key: 'ArrowRight', timeStamp: '100' });
        directive.onKeyboardUp(eventSpyPressUp);
        expect(directive.keyPressed.get('ArrowRight')).toBe(0);

        // Make sure that selection canvas hasn't moved with keyboard up
        expect(selectionCanvas.nativeElement.style.left).toEqual(EXPECTED_LEFT_END_POSITION);
        expect(selectionCanvas.nativeElement.style.top).toEqual(EXPECTED_TOP_END_POSITION);
        flush();
    }));

    it('onKeyBoardDown should skip continuous translation of canvas if hasMovedOnce is true', fakeAsync((): void => {
        const eventSpy = jasmine.createSpyObj('event', ['preventDefault'], { key: 'ArrowLeft', timeStamp: '100' });
        const functionName = 'hasMovedOnce';

        selectionCanvas.nativeElement.style.left = '10px';
        selectionCanvas.nativeElement.style.top = '10px';
        selectionCanvas.nativeElement.style.right = '10px';
        directive[functionName] = true;

        directive.onKeyboardDown(eventSpy);
        tick(FIRST_PRESS_DELAY);
        directive.onKeyboardDown(eventSpy);
        expect(delaySpy).not.toHaveBeenCalledWith(CONTINUOUS_PRESS_DELAY);
        flush();
    }));

    it('onKeyBoardDown should move selection left by increments of NUM_PIXELS if held down', fakeAsync((): void => {
        const eventSpy = jasmine.createSpyObj('event', ['preventDefault'], { key: 'ArrowLeft', timeStamp: '100' });
        const functionName = 'hasMovedOnce';

        selectionCanvas.nativeElement.style.left = '10px';
        selectionCanvas.nativeElement.style.top = '10px';
        selectionCanvas.nativeElement.style.right = '10px';

        const INITIAL_LEFT_POSITION = selectionCanvas.nativeElement.style.left;
        const INITIAL_TOP_POSITION = selectionCanvas.nativeElement.style.top;

        const EXPECTED_LEFT_END_POSITION = parseInt(INITIAL_LEFT_POSITION, 10) - NUM_PIXELS * NUM_PIXELS + 'px';
        const EXPECTED_TOP_POSITION = INITIAL_TOP_POSITION;

        directive.onKeyboardDown(eventSpy);
        tick(FIRST_PRESS_DELAY);
        tick(CONTINUOUS_PRESS_DELAY);

        directive.onKeyboardDown(eventSpy);
        tick(CONTINUOUS_PRESS_DELAY);
        expect(directive[functionName]).toBeFalse();
        expect(selectionCanvas.nativeElement.style.left).toEqual(EXPECTED_LEFT_END_POSITION);
        expect(selectionCanvas.nativeElement.style.top).toEqual(EXPECTED_TOP_POSITION);
        flush();
    }));
});
