import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SettingsManagerService } from '@app/services/manager/settings-manager';
import { TextService } from '@app/services/tools/text/text-service';
import { SidebarTextComponent } from './sidebar-text.component';

describe('SidebarTextComponent', () => {
    let service: TextService;
    let textComponent: SidebarTextComponent;
    let fixture: ComponentFixture<SidebarTextComponent>;
    let settingsManagerService: SettingsManagerService;
    let fontFamilyChangedSubscribeSpy: jasmine.Spy;
    let textAlignChangedSubscribeSpy: jasmine.Spy;
    let fontSizeChangedSubscribeSpy: jasmine.Spy;
    let inputFromKeyboardChangedSpy: jasmine.Spy;
    let textBoldChangedSubscribeSpy: jasmine.Spy;
    let textItalicChangedSpy: jasmine.Spy;
    const TEST_FONT_FAMILY = 'Arial';
    const TEST_TEXT_INPUT = 'HELLO WORLD';
    const TEST_FONT_WEIGHT = 'bold';
    const TEST_FONT_SIZE = 50;
    const TEST_TEXT_ALIGN = 'center';
    const TEST_ITALIC = 'italic';

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [SidebarTextComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();
    }));

    beforeEach(() => {
        const drawContainer = document.createElement('div');
        drawContainer.id = 'drawing-container';
        document.body.append(drawContainer);
        service = TestBed.inject(TextService);
        service.placeHolderSpan = document.createElement('span');
        service.placeHolderSpan.id = 'placeHolderSpan';
        document.body.append(service.placeHolderSpan);

        service.placeHolderSpan.style.position = 'absolute';
        service.placeHolderSpan.setAttribute('role', 'textbox');
        service.placeHolderSpan.contentEditable = 'true';
        service.placeHolderSpan.style.textAlign = TEST_TEXT_ALIGN;
        service.placeHolderSpan.style.fontFamily = TEST_FONT_FAMILY;
        service.placeHolderSpan.style.fontSize = TEST_FONT_SIZE + 'px';
        service.placeHolderSpan.style.fontWeight = TEST_FONT_WEIGHT;
        service.inputFromKeyboard = TEST_TEXT_INPUT;
        service.placeHolderSpan.style.fontStyle = 'normal';
        service.placeHolderSpan.style.visibility = 'hidden';
        service.placeHolderSpan.innerText = 'Ajoutez du texte ici...';
        service.placeHolderSpan.style.zIndex = '2';
        service.placeHolderSpan.style.color = 'blue';

        fixture = TestBed.createComponent(SidebarTextComponent);

        textComponent = fixture.componentInstance;
        fixture.detectChanges();
        settingsManagerService = TestBed.inject(SettingsManagerService);
        fontFamilyChangedSubscribeSpy = spyOn(textComponent.fontFamilyChanged, 'subscribe');
        fontSizeChangedSubscribeSpy = spyOn(textComponent.fontSizeChanged, 'subscribe');
        textAlignChangedSubscribeSpy = spyOn(textComponent.textAlignChanged, 'subscribe');
        inputFromKeyboardChangedSpy = spyOn(textComponent.inputFromKeyboardChanged, 'subscribe');
        textBoldChangedSubscribeSpy = spyOn(textComponent.textBoldChanged, 'subscribe');
        textItalicChangedSpy = spyOn(textComponent.textItalicChanged, 'subscribe');
    });

    it('should create', () => {
        expect(textComponent).toBeTruthy();
    });

    it('should call subscribe method when created at first', () => {
        textComponent.ngOnInit();
        expect(fontFamilyChangedSubscribeSpy).toHaveBeenCalled();
        expect(fontSizeChangedSubscribeSpy).toHaveBeenCalled();
        expect(textAlignChangedSubscribeSpy).toHaveBeenCalled();
        expect(inputFromKeyboardChangedSpy).toHaveBeenCalled();
        expect(textBoldChangedSubscribeSpy).toHaveBeenCalled();
        expect(textItalicChangedSpy).toHaveBeenCalled();
    });

    it('emitFontOptions should emit font weight and font style', () => {
        const emitItalicSpy = spyOn(textComponent.textItalicChanged, 'emit');
        const emitBoldSpy = spyOn(textComponent.textBoldChanged, 'emit');
        textComponent.fontStyle = TEST_ITALIC;
        textComponent.fontOptions = 'normal';
        textComponent.emitFontOptions();
        expect(emitItalicSpy).toHaveBeenCalled();
        expect(emitBoldSpy).toHaveBeenCalled();
    });

    it('emitFontOptions should emit font style', () => {
        const emitItalicSpy = spyOn(textComponent.textItalicChanged, 'emit');
        const emitBoldSpy = spyOn(textComponent.textBoldChanged, 'emit');
        textComponent.fontOptions = 'italic';
        textComponent.emitFontOptions();
        expect(emitItalicSpy).toHaveBeenCalled();
        expect(emitBoldSpy).not.toHaveBeenCalled();
    });

    it('emitFontOptions should emit font weight', () => {
        const emitItalicSpy = spyOn(textComponent.textItalicChanged, 'emit');
        const emitBoldSpy = spyOn(textComponent.textBoldChanged, 'emit');
        textComponent.fontOptions = 'bold';
        textComponent.emitFontOptions();
        expect(emitItalicSpy).not.toHaveBeenCalled();
        expect(emitBoldSpy).toHaveBeenCalled();
    });

    it('emitFontFamily should emit font family', () => {
        const emitSpy = spyOn(textComponent.fontFamilyChanged, 'emit');
        textComponent.fontFamily = TEST_FONT_FAMILY;
        textComponent.emitFontFamily();
        expect(emitSpy).toHaveBeenCalled();
    });

    it('emitFontSize should emit font size', () => {
        const emitSpy = spyOn(textComponent.fontSizeChanged, 'emit');
        textComponent.fontSize = TEST_FONT_SIZE;
        textComponent.emitFontSize();
        expect(emitSpy).toHaveBeenCalled();
    });

    it('emitTexAlign should emit alignment', () => {
        const emitSpy = spyOn(textComponent.textAlignChanged, 'emit');
        textComponent.textAlign = TEST_TEXT_ALIGN;
        textComponent.emitTexAlign();
        expect(emitSpy).toHaveBeenCalled();
    });

    it('emitFontWeight should emit font weight to bold', () => {
        const emitSpy = spyOn(textComponent.textBoldChanged, 'emit');
        textComponent.fontWeight = TEST_FONT_WEIGHT;
        textComponent.fontOptions = 'bold';
        textComponent.emitFontWeight();
        expect(emitSpy).toHaveBeenCalled();
        expect(textComponent.fontWeight).toEqual('bold');
    });

    it('emitFontWeight should emit font weight to normal', () => {
        const emitSpy = spyOn(textComponent.textBoldChanged, 'emit');
        textComponent.fontOptions = 'normal';
        textComponent.emitFontWeight();
        expect(emitSpy).toHaveBeenCalled();
    });

    it('emitFontStyle should emit font style to italic', () => {
        const emitSpy = spyOn(textComponent.textItalicChanged, 'emit');
        textComponent.fontStyle = TEST_ITALIC;
        textComponent.fontOptions = 'italic';
        textComponent.emitFontStyle();
        expect(emitSpy).toHaveBeenCalled();
    });

    it('emitFontStyle should emit font style to normal', () => {
        const emitSpy = spyOn(textComponent.textItalicChanged, 'emit');
        textComponent.fontStyle = TEST_ITALIC;
        textComponent.fontOptions = 'normal';
        textComponent.emitFontStyle();
        expect(emitSpy).toHaveBeenCalled();
    });

    it('emitFontStyle should set font options to normal', () => {
        const emitSpy = spyOn(textComponent.textItalicChanged, 'emit');
        textComponent.fontOptions = 'normal';
        textComponent.emitFontStyle();
        expect(emitSpy).toHaveBeenCalled();
        expect(textComponent.fontStyle).toEqual('normal');
    });

    it('emitInputFromKeyboard should emit text input', () => {
        const emitSpy = spyOn(textComponent.inputFromKeyboardChanged, 'emit');
        textComponent.inputFromKeyboard = TEST_TEXT_INPUT;
        textComponent.emitInputFromKeyboard();
        expect(emitSpy).toHaveBeenCalled();
    });

    it('should call setFontFamily() from settingsManager after font family change', () => {
        const setFontFamilySpy = spyOn(settingsManagerService, 'setFontFamily');
        textComponent.ngOnInit();
        textComponent.emitFontFamily();
        expect(setFontFamilySpy).toHaveBeenCalled();
    });

    it('should call setFontSize() from settingsManager after font size change', () => {
        const setFontSizeSpy = spyOn(settingsManagerService, 'setFontSize');
        textComponent.ngOnInit();
        textComponent.emitFontSize();
        expect(setFontSizeSpy).toHaveBeenCalled();
    });

    it('should call setTextAlign() from settingsManager after alignment change', () => {
        const setTextAlignSpy = spyOn(settingsManagerService, 'setTextAlign');
        textComponent.ngOnInit();
        textComponent.emitTexAlign();
        expect(setTextAlignSpy).toHaveBeenCalled();
    });

    it('should call setTextBold() from settingsManager after font weight change to italic', () => {
        const setTextBoldSpy = spyOn(settingsManagerService, 'setTextBold');
        textComponent.fontOptions = 'bold';
        textComponent.ngOnInit();
        textComponent.emitFontWeight();
        expect(setTextBoldSpy).toHaveBeenCalled();
    });

    it('should call setTextBold() from settingsManager after font weight change to normal', () => {
        const setTextBoldSpy = spyOn(settingsManagerService, 'setTextBold');
        textComponent.fontOptions = 'normal';
        textComponent.ngOnInit();
        textComponent.emitFontWeight();
        expect(setTextBoldSpy).toHaveBeenCalled();
    });

    it('should call setTextItalic() from settingsManager after font style change to italic', () => {
        const setTextItalicSpy = spyOn(settingsManagerService, 'setTextItalic');
        textComponent.fontOptions = 'italic';
        textComponent.ngOnInit();
        textComponent.emitFontStyle();
        expect(setTextItalicSpy).toHaveBeenCalled();
    });

    it('should call setTextItalic() from settingsManager after font style change to normal', () => {
        const setTextItalicSpy = spyOn(settingsManagerService, 'setTextItalic');
        textComponent.fontOptions = 'normal';
        textComponent.ngOnInit();
        textComponent.emitFontStyle();
        expect(setTextItalicSpy).toHaveBeenCalled();
    });

    it('should call setInputFromKeyboard() from settingsManager after text input change', () => {
        const setInputSpy = spyOn(settingsManagerService, 'setInputFromKeyboard');
        textComponent.ngOnInit();
        textComponent.emitInputFromKeyboard();
        expect(setInputSpy).toHaveBeenCalled();
    });
});
