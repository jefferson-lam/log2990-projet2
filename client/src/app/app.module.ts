import { DragDropModule } from '@angular/cdk/drag-drop';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatOptionModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ResizerComponent } from '@app/components/resizer/resizer.component';
import { ExportDrawingComponent } from '@app/components/sidebar/export-drawing/export-drawing.component';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './components/app/app.component';
import { ColorPickerModule } from './components/color-picker/color-picker.module';
import { DrawingComponent } from './components/drawing/drawing.component';
import { EditorComponent } from './components/editor/editor.component';
import { DiscardChangesPopupComponent } from './components/main-page/discard-changes-popup/discard-changes-popup.component';
import { MainPageCarrouselComponent } from './components/main-page/main-page-carrousel/main-page-carrousel.component';
import { MainPageComponent } from './components/main-page/main-page.component';
import { DirectionalMovementDirective } from './components/selection/selection-directives/directional-movement.directive';
import { KeyboardListenerDirective } from './components/selection/selection-directives/keyboard-listener.directive';
import { SelectionComponent } from './components/selection/selection.component';
import { ExportCompletePageComponent } from './components/sidebar/export-drawing/export-complete-page/export-complete-page.component';
import { ExportErrorPageComponent } from './components/sidebar/export-drawing/export-error-page/export-error-page.component';
import { NewDrawingBoxComponent } from './components/sidebar/new-drawing-box/new-drawing-box.component';
import { SaveCompletePageComponent } from './components/sidebar/save-drawing-page/save-complete-page/save-complete-page.component';
import { SaveDrawingComponent } from './components/sidebar/save-drawing-page/save-drawing.component';
import { SaveErrorPageComponent } from './components/sidebar/save-drawing-page/save-error-page/save-error-page.component';
import { SaveSavingPageComponent } from './components/sidebar/save-drawing-page/save-saving-page/save-saving-page.component';
import { TagInputComponent } from './components/sidebar/save-drawing-page/tag-input/tag-input.component';
import { TitleInputComponent } from './components/sidebar/save-drawing-page/title-input/title-input.component';
import { SidebarAerosolComponent } from './components/sidebar/sidebar-tools-options-2.0/sidebar-aerosol/sidebar-aerosol.component';
import { SidebarEllipseSelectionComponent } from './components/sidebar/sidebar-tools-options-2.0/sidebar-ellipse-selection/sidebar-ellipse-selection/sidebar-ellipse-selection.component';
import { SidebarEllipseComponent } from './components/sidebar/sidebar-tools-options-2.0/sidebar-ellipse/sidebar-ellipse.component';
import { SidebarEraserComponent } from './components/sidebar/sidebar-tools-options-2.0/sidebar-eraser/sidebar-eraser.component';
import { SidebarGridComponent } from './components/sidebar/sidebar-tools-options-2.0/sidebar-grid/sidebar-grid.component';
import { SidebarLassoSelectionComponent } from './components/sidebar/sidebar-tools-options-2.0/sidebar-lasso-selection/sidebar-lasso-selection/sidebar-lasso-selection.component';
import { SidebarLineComponent } from './components/sidebar/sidebar-tools-options-2.0/sidebar-line/sidebar-line.component';
import { SidebarMagnetismComponent } from './components/sidebar/sidebar-tools-options-2.0/sidebar-magnetism/sidebar-magnetism.component';
import { SidebarPaintBucketComponent } from './components/sidebar/sidebar-tools-options-2.0/sidebar-paint-bucket/sidebar-paint-bucket/sidebar-paint-bucket.component';
import { SidebarPencilComponent } from './components/sidebar/sidebar-tools-options-2.0/sidebar-pencil/sidebar-pencil.component';
import { SidebarPipetteComponent } from './components/sidebar/sidebar-tools-options-2.0/sidebar-pipette/sidebar-pipette.component';
import { SidebarPolygoneComponent } from './components/sidebar/sidebar-tools-options-2.0/sidebar-polygone/sidebar-polygone.component';
import { SidebarRectangleSelectionComponent } from './components/sidebar/sidebar-tools-options-2.0/sidebar-rectangle-selection/sidebar-rectangle-selection/sidebar-rectangle-selection.component';
import { SidebarRectangleComponent } from './components/sidebar/sidebar-tools-options-2.0/sidebar-rectangle/sidebar-rectangle.component';
import { SidebarStampComponent } from './components/sidebar/sidebar-tools-options-2.0/sidebar-stamp/sidebar-stamp.component';
import { SidebarTextComponent } from './components/sidebar/sidebar-tools-options-2.0/sidebar-text/sidebar-text.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { ToolInfoComponent } from './components/sidebar/tool-info/tool-info.component';

@NgModule({
    declarations: [
        AppComponent,
        DiscardChangesPopupComponent,
        DrawingComponent,
        EditorComponent,
        ExportDrawingComponent,
        MainPageComponent,
        MainPageCarrouselComponent,
        NewDrawingBoxComponent,
        ResizerComponent,
        SidebarAerosolComponent,
        SidebarComponent,
        SidebarPencilComponent,
        SidebarEraserComponent,
        SidebarRectangleComponent,
        SidebarEllipseComponent,
        SidebarLineComponent,
        SelectionComponent,
        SaveDrawingComponent,
        SaveCompletePageComponent,
        SaveSavingPageComponent,
        SaveErrorPageComponent,
        SidebarPolygoneComponent,
        TagInputComponent,
        TitleInputComponent,
        KeyboardListenerDirective,
        SidebarPipetteComponent,
        DirectionalMovementDirective,
        SidebarRectangleSelectionComponent,
        SidebarEllipseSelectionComponent,
        SidebarLassoSelectionComponent,
        SidebarPaintBucketComponent,
        ExportCompletePageComponent,
        ExportErrorPageComponent,
        SidebarGridComponent,
        SidebarMagnetismComponent,
        SidebarStampComponent,
        SidebarTextComponent,
        ToolInfoComponent,
    ],
    entryComponents: [MainPageCarrouselComponent, ExportCompletePageComponent],
    imports: [
        AppRoutingModule,
        BrowserAnimationsModule,
        BrowserModule,
        ColorPickerModule,
        DragDropModule,
        FormsModule,
        HttpClientModule,
        MatButtonModule,
        MatCardModule,
        MatCheckboxModule,
        MatDialogModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatOptionModule,
        MatRadioModule,
        MatSelectModule,
        MatSidenavModule,
        MatSliderModule,
        MatToolbarModule,
        MatTooltipModule,
        ReactiveFormsModule,
        MatGridListModule,
        MatAutocompleteModule,
        MatChipsModule,
        MatRadioModule,
        MatProgressSpinnerModule,
        MatSlideToggleModule,
    ],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
