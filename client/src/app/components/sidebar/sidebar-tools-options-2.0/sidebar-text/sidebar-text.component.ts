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
    max: number;
    min: number;
    fontSize: number;
    tickInterval: number;
    fillMode: number | undefined;
    fontStyle: string;
    fontWeight: string;
    textAlign: string;
    fontFamily: string;
    textBold: boolean;
    textItalic: boolean;

    currentTool: Tool;

    @Output() fontFamilyChanged: EventEmitter<string>;
    @Output() fontSizeChanged: EventEmitter<number>;
    @Output() textAlignChanged: EventEmitter<string>;
    @Output() textBoldChanged: EventEmitter<string>;
    @Output() textItalicChanged: EventEmitter<string>;

    constructor(public settingsManager: SettingsManagerService, public toolManagerService: ToolManagerService, private textService: TextService) {
        this.max = TextConstants.MAX_FONT_SIZE;
        this.min = TextConstants.MIN_FONT_SIZE;
        this.tickInterval = TextConstants.TICK_INTERVALS;
        this.fontSize = this.textService.fontSize;
        this.fontStyle = this.textService.fontStyle;
        this.fontWeight = this.textService.fontWeight;
        this.textAlign = this.textService.textAlign;
        this.fontFamily = this.textService.fontFamily;
        this.textBold = this.textService.hasWeightChanged;
        this.textItalic = this.textService.hasStyleChanged;
        this.fontFamilyChanged = new EventEmitter();
        this.fontSizeChanged = new EventEmitter();
        this.textAlignChanged = new EventEmitter();
        this.textBoldChanged = new EventEmitter();
        this.textItalicChanged = new EventEmitter();
    }

    ngOnInit(): void {
        this.fontFamilyChanged.subscribe((newFont: string) => this.settingsManager.setFontFamily(newFont));
        this.fontSizeChanged.subscribe((newSize: number) => this.settingsManager.setFontSize(newSize));
        this.textAlignChanged.subscribe((newAlign: string) => this.settingsManager.setTextAlign(newAlign));
        this.textBoldChanged.subscribe((newBoldStyle: string) => this.settingsManager.setTextBold(newBoldStyle));
        this.textItalicChanged.subscribe((newItalicStyle: string) => this.settingsManager.setTextItalic(newItalicStyle));
    }

    ngAfterViewInit(): void {
        this.textService.placeHolderSpan = document.createElement('span');
        this.textService.placeHolderSpan.className = 'placeHolderSpan';
        this.textService.placeHolderSpan.style.position = 'absolute';
        this.textService.placeHolderSpan.setAttribute('role', 'textbox');
        this.textService.placeHolderSpan.contentEditable = 'true';

        (document.getElementById('drawing-container') as HTMLElement).appendChild(this.textService.placeHolderSpan);
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
        if (this.textBold) {
            this.fontWeight = 'bold';
        } else {
            this.fontWeight = 'normal';
        }
        this.textBoldChanged.emit(this.fontWeight);
    }

    emitFontStyle(): void {
        if (this.textItalic) {
            this.fontStyle = 'italic';
        } else {
            this.fontStyle = 'normal';
        }
        this.textItalicChanged.emit(this.fontStyle);
    }
}
