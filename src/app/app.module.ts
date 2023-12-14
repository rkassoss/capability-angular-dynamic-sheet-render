import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { EmbededSheetService } from './embedded-sheet.service';
import { EmbededByObjectService } from './embedded-by-object.service';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [
    EmbededSheetService,
    EmbededByObjectService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }