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
    let textBoldChangedSubscribeSpy: jasmine.Spy;
    let textItalicChangedSpy: jasmine.Spy;
    const TEST_FONT_FAMILY = 'Arial';
    const TEST_FONT_WEIGHT = 'bold';
    const TEST_FONT_SIZE = 50;
    const TEST_TEXT_ALIGN = 'center';

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
        expect(textBoldChangedSubscribeSpy).toHaveBeenCalled();
        expect(textItalicChangedSpy).toHaveBeenCalled();
    });

    it('emitFontWeight should emit font weight bold', () => {
        const emitBoldSpy = spyOn(textComponent.textBoldChanged, 'emit');
        textComponent.textBold = true;
        textComponent.emitFontWeight();
        expect(emitBoldSpy).toHaveBeenCalled();
        expect(textComponent.fontWeight).toEqual('bold');
    });

    it('emitFontWeight should emit font weight normal', () => {
        const emitBoldSpy = spyOn(textComponent.textBoldChanged, 'emit');
        textComponent.textBold = false;
        textComponent.emitFontWeight();
        expect(emitBoldSpy).toHaveBeenCalled();
        expect(textComponent.fontWeight).toEqual('normal');
    });

    it('emitFontStyle should emit font style italic', () => {
        const emitItalicSpy = spyOn(textComponent.textItalicChanged, 'emit');
        textComponent.textItalic = true;
        textComponent.emitFontStyle();
        expect(emitItalicSpy).toHaveBeenCalled();
        expect(textComponent.fontStyle).toEqual('italic');
    });

    it('emitFontStyle should emit font style italic', () => {
        const emitItalicSpy = spyOn(textComponent.textItalicChanged, 'emit');
        textComponent.textItalic = false;
        textComponent.emitFontStyle();
        expect(emitItalicSpy).toHaveBeenCalled();
        expect(textComponent.fontStyle).toEqual('normal');
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
        textComponent.fontWeight = 'bold';
        textComponent.ngOnInit();
        textComponent.emitFontWeight();
        expect(setTextBoldSpy).toHaveBeenCalled();
    });

    it('should call setTextBold() from settingsManager after font weight change to normal', () => {
        const setTextBoldSpy = spyOn(settingsManagerService, 'setTextBold');
        textComponent.fontWeight = 'normal';
        textComponent.ngOnInit();
        textComponent.emitFontWeight();
        expect(setTextBoldSpy).toHaveBeenCalled();
    });

    it('should call setTextItalic() from settingsManager after font style change to italic', () => {
        const setTextItalicSpy = spyOn(settingsManagerService, 'setTextItalic');
        textComponent.fontStyle = 'italic';
        textComponent.ngOnInit();
        textComponent.emitFontStyle();
        expect(setTextItalicSpy).toHaveBeenCalled();
    });

    it('should call setTextItalic() from settingsManager after font style change to normal', () => {
        const setTextItalicSpy = spyOn(settingsManagerService, 'setTextItalic');
        textComponent.fontStyle = 'normal';
        textComponent.ngOnInit();
        textComponent.emitFontStyle();
        expect(setTextItalicSpy).toHaveBeenCalled();
    });
});
