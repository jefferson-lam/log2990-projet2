import { CdkScrollable, ScrollDispatcher } from '@angular/cdk/scrolling';
import { Component, HostListener } from '@angular/core';
import { ShortcutManagerService } from '@app/services/manager/shortcut-manager.service';
import { ToolManagerService } from '@app/services/manager/tool-manager-service';

@Component({
    selector: 'app-editor',
    templateUrl: './editor.component.html',
    styleUrls: ['./editor.component.scss'],
})
export class EditorComponent {
    constructor(public shortcutManager: ShortcutManagerService, private toolManager: ToolManagerService, private scroller: ScrollDispatcher) {
        this.scroller.scrolled().subscribe((element) => {
            if (!(element instanceof CdkScrollable)) return;
            if (element.getElementRef().nativeElement.id !== 'drawing-container') return;
            this.toolManager.scrolled(element.measureScrollOffset('left'), element.measureScrollOffset('top'));
        });
    }

    @HostListener('window:keydown.g', ['$event'])
    onGKeyDown(): void {
        this.shortcutManager.onGKeyDown();
    }

    @HostListener('window:keydown.control.a', ['$event'])
    onCtrlAKeyDown(event: KeyboardEvent): void {
        this.shortcutManager.onCtrlAKeyDown(event);
    }

    @HostListener('window:keydown.control.e', ['$event'])
    onCtrlEKeyDown(event: KeyboardEvent): void {
        this.shortcutManager.onCtrlEKeyDown(event);
    }

    @HostListener('window:keydown.control.g', ['$event'])
    onCtrlGKeyDown(event: KeyboardEvent): void {
        this.shortcutManager.onCtrlGKeyDown(event);
    }

    @HostListener('window:keydown.control.o', ['$event'])
    onCtrlOKeyDown(event: KeyboardEvent): void {
        this.shortcutManager.onCtrlOKeyDown(event);
    }

    @HostListener('window:keydown.control.s', ['$event'])
    onCtrlSKeyDown(event: KeyboardEvent): void {
        this.shortcutManager.onCtrlSKeyDown(event);
    }

    @HostListener('window:keydown.control.shift.z', ['$event'])
    onCtrlShiftZKeyDown(event: KeyboardEvent): void {
        this.shortcutManager.onCtrlShiftZKeyDown(event);
    }

    @HostListener('window:keydown.control.z', ['$event'])
    onCtrlZKeyDown(event: KeyboardEvent): void {
        this.shortcutManager.onCtrlZKeyDown(event);
    }

    @HostListener('window:keydown.alt', ['$event'])
    onAltDown(event: KeyboardEvent): void {
        this.shortcutManager.onAltDown(event);
    }

    @HostListener('window:keyup.alt', ['$event'])
    onAltUp(): void {
        this.shortcutManager.onAltUp();
    }

    @HostListener('window:keydown.control.c', ['$event'])
    onCtrlCKeyDown(event: KeyboardEvent): void {
        this.shortcutManager.onCtrlCKeyDown(event);
    }

    @HostListener('window:keydown.control.v', ['$event'])
    onCtrlVKeyDown(event: KeyboardEvent): void {
        this.shortcutManager.onCtrlVKeyDown(event);
    }

    @HostListener('window:keydown.escape', ['$event'])
    onEscapeKeyDown(): void {
        this.shortcutManager.onEscapeKeyDown();
    }

    @HostListener('window:keydown.control.x', ['$event'])
    onCtrlXKeyDown(event: KeyboardEvent): void {
        this.shortcutManager.onCtrlXKeyDown(event);
    }

    @HostListener('window:keydown.delete', ['$event'])
    onDeleteKeyDown(event: KeyboardEvent): void {
        this.shortcutManager.onDeleteKeyDown(event);
    }

    @HostListener('window:keydown.-', ['$event'])
    onMinusKeyDown(): void {
        this.shortcutManager.onMinusKeyDown();
    }

    @HostListener('window:keydown.+', ['$event'])
    onPlusKeyDown(): void {
        this.shortcutManager.onPlusKeyDown();
    }

    @HostListener('window:keydown.m', ['$event'])
    onMKeyDown(): void {
        this.shortcutManager.onMKeyDown();
    }

    @HostListener('window:keydown.=', ['$event'])
    onEqualKeyDown(): void {
        this.shortcutManager.onEqualKeyDown();
    }

    @HostListener('window:keydown', ['$event'])
    onKeyboardDown(event: KeyboardEvent): void {
        if (!event.ctrlKey) this.shortcutManager.onKeyboardDown(event);
    }
}
