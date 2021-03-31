import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Tool } from '@app/classes/tool';
import * as TextConstants from '@app/constants/text-constants';
import { SettingsManagerService } from '@app/services/manager/settings-manager';

@Component({
    selector: 'app-sidebar-text',
    templateUrl: './sidebar-text.component.html',
    styleUrls: ['./sidebar-text.component.scss'],
})
export class SidebarTextComponent implements OnInit {
    max: number = TextConstants.MAX_FONT_SIZE;
    min: number = TextConstants.MIN_FONT_SIZE;
    fontSize: number = TextConstants.INIT_FONT_SIZE;
    tickInterval: number = TextConstants.TICK_INTERVALS;
    fillMode: number | undefined;
    fontStyle: string = 'Arial';
    textAlignment: string = 'left';
    textBold: boolean = false;
    textItalic: boolean = false;
    inputFromKeyboard: string;
    currentTool: Tool;

    @Output() fontStyleChanged: EventEmitter<string> = new EventEmitter();
    @Output() fontSizeChanged: EventEmitter<number> = new EventEmitter();
    @Output() textAlignmentChanged: EventEmitter<string> = new EventEmitter();
    @Output() inputFromKeyboardChanged: EventEmitter<string> = new EventEmitter();
    @Output() textBoldChanged: EventEmitter<boolean> = new EventEmitter();
    @Output() textItalicChanged: EventEmitter<boolean> = new EventEmitter();

    constructor(public settingsManager: SettingsManagerService) {}

    ngOnInit(): void {
        this.fontStyleChanged.subscribe((newFont: string) => this.settingsManager.setFontStyle(newFont));
        this.fontSizeChanged.subscribe((newSize: number) => this.settingsManager.setFontSize(newSize));
        this.textAlignmentChanged.subscribe((newAlignment: string) => this.settingsManager.setTextAlignment(newAlignment));
        this.inputFromKeyboardChanged.subscribe((newInput: string) => this.settingsManager.setInputFromKeyboard(newInput));
        this.textBoldChanged.subscribe((newBoldStyle: boolean) => this.settingsManager.setTextBold(newBoldStyle));
        this.textItalicChanged.subscribe((newItalicStyle: boolean) => this.settingsManager.setTextItalic(newItalicStyle));
    }

    emitFontStyle(): void {
        this.fontStyleChanged.emit(this.fontStyle);
    }

    emitFontSize(): void {
        this.fontSizeChanged.emit(this.fontSize);
    }

    emitTexAlignement(): void {
        this.textAlignmentChanged.emit(this.textAlignment);
    }

    emitTextBold(): void {
        this.textBoldChanged.emit(this.textBold);
    }

    emitTextItalic(): void {
        this.textItalicChanged.emit(this.textItalic);
    }

    emitInputFromKeyboard(): void {
        this.inputFromKeyboardChanged.emit(this.inputFromKeyboard);
    }
}
