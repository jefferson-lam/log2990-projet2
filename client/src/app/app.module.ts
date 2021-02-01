import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './components/app/app.component';
import { DrawingComponent } from './components/drawing/drawing.component';
import { EditorComponent } from './components/editor/editor.component';
import { MainPageCarrouselComponent } from './components/main-page/main-page-carrousel/main-page-carrousel.component';
import { MainPageComponent } from './components/main-page/main-page.component';
import { SidebarEraserComponent } from './components/sidebar/sidebar-tools-options/sidebar-eraser/sidebar-eraser.component';
import { SidebarPencilComponent } from './components/sidebar/sidebar-tools-options/sidebar-pencil/sidebar-pencil.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { MatCardModule } from '@angular/material/card';

@NgModule({
    declarations: [
        AppComponent,
        EditorComponent,
        SidebarComponent,
        DrawingComponent,
        MainPageComponent,
        SidebarPencilComponent,
        SidebarEraserComponent,
        MainPageCarrouselComponent,
    ],
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
  ],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
