import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeModule } from './home/home.module';
import { EditModule } from './edit/edit.module';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    HomeModule,
    EditModule
  ]
})
export class PagesModule { }
