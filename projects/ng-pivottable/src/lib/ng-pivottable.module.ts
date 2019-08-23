import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common'
import { NgPivottableComponent } from './ng-pivottable.component';
import { NgUIPivottableComponent } from './ng-ui-pivottable.component';



@NgModule({
  declarations: [NgPivottableComponent, NgUIPivottableComponent],
  imports: [CommonModule],
  exports: [NgPivottableComponent, NgUIPivottableComponent]
})
export class NgPivottableModule { }
