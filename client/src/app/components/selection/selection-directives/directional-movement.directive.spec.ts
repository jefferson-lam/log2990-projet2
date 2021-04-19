import { CUSTOM_ELEMENTS_SCHEMA, DebugElement } from '@angular/core';
import { ComponentFixture, fakeAsync, flush, TestBed, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { SelectionComponent } from '@app/components/selection/selection.component';
import * as DirectionalMovementConstants from '@app/constants/directional-movement-constants';
import { ShortcutManagerService } from '@app/services/manager/shortcut-manager.service';
import { DirectionalMovementDirective } from './directional-movement.directive';
import createSpyObj = jasmine.createSpyObj;

// tslint:disable: no-string-literal
// tslint:disable: no-any
describe('DirectionalMovementDirective', () => {
    let fixture: ComponentFixture<SelectionComponent>;
    let directive: DirectionalMovementDirective;
    let selectionCanvas: DebugElement;
    let emitSpy: jasmine.Spy;
    let shortcutManagerSpy: jasmine.SpyObj<ShortcutManagerService>;

    const initialPosition = { x: '10px', y: '10px' };
    const movement = { x: 1, y: 1 };

    beforeEach(() => {
        shortcutManagerSpy = createSpyObj('ShortcutManagerService', [
            'isShortcutAllowed',
            'selectionMovementOnArrowDown',
            'selectionMovementOnKeyboardUp',
        ]);
        fixture = TestBed.configureTestingModule({
            declarations: [DirectionalMovementDirective, SelectionComponent],
            providers: [{ provide: ShortcutManagerService, useValue: shortcutManagerSpy }],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        }).createComponent(SelectionComponent);
        fixture.detectChanges();
        selectionCanvas = fixture.debugElement.query(By.directive(DirectionalMovementDirective));
        directive = new DirectionalMovementDirective(selectionCanvas, shortcutManagerSpy);
        emitSpy = spyOn(directive.canvasMovement, 'emit');
    });

    it('should create an instance', () => {
        expect(directive).toBeTruthy();
    });

    it('onKeyBoardDown should call shortcutManager.selectionMovementOnArrowDown', fakeAsync((): void => {
        const eventSpy = jasmine.createSpyObj('event', ['preventDefault'], { key: 'ArrowLeft', timeStamp: '100' });

        directive.onKeyboardDown(eventSpy);

        expect(shortcutManagerSpy.selectionMovementOnArrowDown).toHaveBeenCalled();
    }));

    it('onKeyBoardUp should call shortcutManager.selectionMovementOnKeyboardUp', fakeAsync((): void => {
        const eventSpy = jasmine.createSpyObj('event', ['preventDefault'], { key: 'ArrowLeft', timeStamp: '100' });

        directive.onKeyboardUp(eventSpy);

        expect(shortcutManagerSpy.selectionMovementOnKeyboardUp).toHaveBeenCalled();
    }));

    it('translateLeft should move element left', () => {
        selectionCanvas.nativeElement.style.left = initialPosition.x;
        const expected = parseInt(initialPosition.x, 10) - movement.x + 'px';

        directive['translateLeft'](movement.x);

        expect(selectionCanvas.nativeElement.style.left).toBe(expected);
    });

    it('translateRight should move element right', () => {
        selectionCanvas.nativeElement.style.left = initialPosition.x;
        const expected = parseInt(initialPosition.x, 10) + movement.x + 'px';

        directive['translateRight'](movement.x);

        expect(selectionCanvas.nativeElement.style.left).toBe(expected);
    });

    it('translateUp should move element up', () => {
        selectionCanvas.nativeElement.style.top = initialPosition.y;
        const expected = parseInt(initialPosition.y, 10) - movement.y + 'px';

        directive['translateUp'](movement.y);

        expect(selectionCanvas.nativeElement.style.top).toBe(expected);
    });

    it('translateDown should move element down', () => {
        selectionCanvas.nativeElement.style.top = initialPosition.y;
        const expected = parseInt(initialPosition.y, 10) + movement.y + 'px';

        directive['translateDown'](movement.y);

        expect(selectionCanvas.nativeElement.style.top).toBe(expected);
    });

    it('delay should return promise with setTimeout call', fakeAsync(() => {
        const timeoutSpy = spyOn(window, 'setTimeout');
        directive.delay(DirectionalMovementConstants.FIRST_PRESS_DELAY_MS);
        tick(DirectionalMovementConstants.FIRST_PRESS_DELAY_MS);
        expect(timeoutSpy).toHaveBeenCalled();
        flush();
    }));

    it('translateSelection should call translate left if ArrowLeft pressed', () => {
        const leftSpy = spyOn<any>(directive, 'translateLeft');
        directive.keyPressed.set('ArrowLeft', 1);

        directive.translateSelection();

        expect(leftSpy).toHaveBeenCalled();
    });

    it('translateSelection should call translate up if ArrowUp pressed', () => {
        const upSpy = spyOn<any>(directive, 'translateUp');
        directive.keyPressed.set('ArrowUp', 1);

        directive.translateSelection();

        expect(upSpy).toHaveBeenCalled();
    });

    it('translateSelection should call translate right if ArrowRight pressed', () => {
        const rightSpy = spyOn<any>(directive, 'translateRight');
        directive.keyPressed.set('ArrowRight', 1);

        directive.translateSelection();

        expect(rightSpy).toHaveBeenCalled();
    });

    it('translateSelection should call translate down if ArrowDown pressed', () => {
        const downSpy = spyOn<any>(directive, 'translateDown');
        directive.keyPressed.set('ArrowDown', 1);

        directive.translateSelection();

        expect(downSpy).toHaveBeenCalled();
    });

    it('translateSelection should emit canvasMovement true', () => {
        spyOn<any>(directive, 'translateDown');
        directive.keyPressed.set('ArrowDown', 1);

        directive.translateSelection();

        expect(emitSpy).toHaveBeenCalled();
    });
});
