import { DragDropModule } from '@angular/cdk/drag-drop';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSliderModule } from '@angular/material/slider';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './components/app/app.component';
import { DrawingComponent } from './components/drawing/drawing.component';
import { EditorComponent } from './components/editor/editor.component';
import { MainPageCarrouselComponent } from './components/main-page/main-page-carrousel/main-page-carrousel.component';
import { MainPageComponent } from './components/main-page/main-page.component';
import { NewDrawingBoxComponent } from './components/sidebar/new-drawing-box/new-drawing-box.component';
import { SidebarToolsOptionsComponent } from './components/sidebar/sidebar-tools-options/sidebar-tools-options.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { SidebarPencilComponent } from './components/sidebar/sidebar-tools-options-2.0/sidebar-pencil/sidebar-pencil.component';
import { SidebarEraserComponent } from './components/sidebar/sidebar-tools-options-2.0/sidebar-eraser/sidebar-eraser.component';
import { SidebarRectangleComponent } from './components/sidebar/sidebar-tools-options-2.0/sidebar-rectangle/sidebar-rectangle.component';
import { SidebarEllipseComponent } from './components/sidebar/sidebar-tools-options-2.0/sidebar-ellipse/sidebar-ellipse.component';
import { SidebarLineComponent } from './components/sidebar/sidebar-tools-options-2.0/sidebar-line/sidebar-line.component';

@NgModule({
    declarations: [AppComponent, EditorComponent, SidebarComponent, DrawingComponent, MainPageComponent, MainPageCarrouselComponent, SidebarToolsOptionsComponent, NewDrawingBoxComponent, SidebarPencilComponent, SidebarEraserComponent, SidebarRectangleComponent, SidebarEllipseComponent, SidebarLineComponent],
    entryComponents: [MainPageCarrouselComponent],
    imports: [
        BrowserModule,
        HttpClientModule,
        AppRoutingModule,
        MatButtonModule,
        MatIconModule,
        MatSidenavModule,
        BrowserAnimationsModule,
        MatFormFieldModule,
        MatInputModule,
        MatDialogModule,
        MatToolbarModule,
        MatCardModule,
        MatTooltipModule,
        MatSliderModule,
        MatRadioModule,
        MatCheckboxModule,
        DragDropModule,
    ],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
