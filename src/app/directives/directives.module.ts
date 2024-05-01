import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageDefaultDirective } from './image-default.directive';



@NgModule({
  declarations: [
    ImageDefaultDirective
  ],
  imports: [
    CommonModule
  ],
  exports: [
    ImageDefaultDirective
  ]
})
export class DirectivesModule { }
