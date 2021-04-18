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
        this.fontSize = TextConstants.INIT_FONT_SIZE;
        this.fontStyle = 'normal';
        this.fontWeight = 'normal';
        this.textAlign = 'center';
        this.fontFamily = 'Arial';
        this.textBold = false;
        this.textItalic = false;
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
        this.textService.placeHolderSpan.id = 'placeHolderSpan';
        this.textService.placeHolderSpan.style.position = 'absolute';
        this.textService.placeHolderSpan.setAttribute('role', 'textbox');
        this.textService.placeHolderSpan.contentEditable = 'true';
        this.textService.placeHolderSpan.style.textAlign = this.textAlign;
        this.textService.placeHolderSpan.style.fontFamily = this.fontFamily;
        this.textService.placeHolderSpan.style.fontSize = this.fontSize + 'px';
        this.textService.placeHolderSpan.style.fontWeight = this.fontWeight;
        this.textService.placeHolderSpan.style.fontStyle = this.fontStyle;
        this.textService.placeHolderSpan.style.visibility = 'hidden';
        this.textService.placeHolderSpan.style.lineHeight = this.fontSize * TextConstants.LINE_HEIGHT_CONVERSION + 'px';
        this.textService.placeHolderSpan.style.color = this.textService.primaryColor;
        this.textService.placeHolderSpan.innerText = ' ';
        this.textService.placeHolderSpan.style.zIndex = '2';
        this.textService.placeHolderSpan.style.border = '1px solid black';
        this.textService.placeHolderSpan.style.whiteSpace = 'pre-line';
        this.textService.placeHolderSpan.style.minWidth = this.fontSize * TextConstants.MIN_BOX_WIDTH + 'px';

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
