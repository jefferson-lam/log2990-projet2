import { AfterViewInit, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Tool } from '@app/classes/tool';
import * as TextConstants from '@app/constants/text-constants';
import { SettingsManagerService } from '@app/services/manager/settings-manager';
import { ToolManagerService } from '@app/services/manager/tool-manager-service';
import { TextService } from '@app/services/tools/text/text-service';

@Component({
    selector: 'app-sidebar-text',
    templateUrl: './sidebar-text.component.html',
    styleUrls: ['./sidebar-text.component.scss'],
})
export class SidebarTextComponent implements OnInit, AfterViewInit {
    max: number = TextConstants.MAX_FONT_SIZE;
    min: number = TextConstants.MIN_FONT_SIZE;
    fontSize: number = TextConstants.INIT_FONT_SIZE;
    tickInterval: number = TextConstants.TICK_INTERVALS;
    fillMode: number | undefined;

    fontStyle: string = 'normal';
    fontWeight: string = 'normal';
    textAlign: string = 'center';
    fontFamily: string = 'Arial';
    fontOptions: string;
    textBold: boolean = false;
    textItalic: boolean = false;
    inputFromKeyboard: string;

    currentTool: Tool;

    @Output() fontFamilyChanged: EventEmitter<string> = new EventEmitter();
    @Output() fontSizeChanged: EventEmitter<number> = new EventEmitter();
    @Output() textAlignChanged: EventEmitter<string> = new EventEmitter();
    @Output() inputFromKeyboardChanged: EventEmitter<string> = new EventEmitter();
    @Output() textBoldChanged: EventEmitter<string> = new EventEmitter();
    @Output() textItalicChanged: EventEmitter<string> = new EventEmitter();

    constructor(public settingsManager: SettingsManagerService, public toolManagerService: ToolManagerService, private textService: TextService) {}

    ngOnInit(): void {
        this.fontFamilyChanged.subscribe((newFont: string) => this.settingsManager.setFontFamily(newFont));
        this.fontSizeChanged.subscribe((newSize: number) => this.settingsManager.setFontSize(newSize));
        this.textAlignChanged.subscribe((newAlign: string) => this.settingsManager.setTextAlign(newAlign));
        this.inputFromKeyboardChanged.subscribe((newInput: string) => this.settingsManager.setInputFromKeyboard(newInput));
        this.textBoldChanged.subscribe((newBoldStyle: string) => this.settingsManager.setTextBold(newBoldStyle));
        this.textItalicChanged.subscribe((newItalicStyle: string) => this.settingsManager.setTextItalic(newItalicStyle));
    }

    ngAfterViewInit(): void {
        this.textService.placeHolderSpan = document.createElement('span');
        this.textService.placeHolderSpan.id = 'placeHolderSpan';
        this.textService.placeHolderSpan.style.position = 'absolute';
        this.textService.placeHolderSpan.setAttribute('role', 'textbox');
        this.textService.placeHolderSpan.contentEditable = 'true';
        (document.getElementById('drawing-container') as HTMLElement).appendChild(this.textService.placeHolderSpan);
        this.textService.placeHolderSpan.style.textAlign = this.textAlign;
        this.textService.placeHolderSpan.style.fontFamily = this.fontFamily;
        this.textService.placeHolderSpan.style.fontSize = this.fontSize + 'px';
        this.textService.placeHolderSpan.style.textAlign = this.textAlign;
        this.textService.placeHolderSpan.style.fontWeight = this.fontWeight;
        this.textService.placeHolderSpan.style.fontStyle = this.fontStyle;
        this.textService.placeHolderSpan.style.visibility = 'hidden';
        this.textService.placeHolderSpan.innerText = 'Ajoutez du texte ici...';
        this.textService.inputFromKeyboard = this.textService.placeHolderSpan.innerText;
        this.textService.placeHolderSpan.style.zIndex = '2';
        this.textService.placeHolderSpan.style.color = this.textService.primaryColor;
    }

    emitFontOptions(): void {
        this.emitFontWeight();
        this.emitFontStyle();
    }

    emitFontFamily(): void {
        this.fontFamilyChanged.emit(this.fontFamily);
    }

    emitFontSize(): void {
        this.fontSizeChanged.emit(this.fontSize);
    }

    emitTexAlign(): void {
        this.textAlignChanged.emit(this.textAlign);
    }

    emitFontWeight(): void {
        if (this.fontOptions === 'bold') {
            this.fontWeight = this.fontOptions;
            this.textBoldChanged.emit(this.fontWeight);
        } else if (this.fontOptions === 'normal') {
            this.fontWeight = 'normal';
            this.textBoldChanged.emit(this.fontWeight);
        }
    }

    emitFontStyle(): void {
        if (this.fontOptions === 'italic') {
            this.fontStyle = this.fontOptions;
            this.textItalicChanged.emit(this.fontStyle);
        } else if (this.fontOptions === 'normal') {
            this.fontStyle = 'normal';
            this.textItalicChanged.emit(this.fontStyle);
        }
    }

    emitInputFromKeyboard(): void {
        this.inputFromKeyboardChanged.emit(this.inputFromKeyboard);
    }
}
