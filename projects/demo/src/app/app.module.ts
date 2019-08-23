import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgPivottableModule } from 'ng-pivottable';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    NgPivottableModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
