import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingComponent } from './loading/loading.component';
import { ModalComponent } from './modal/modal.component';
import { PlayerComponent } from './player/player.component';
import { YouTubePlayerModule } from '@angular/youtube-player';
import { InputComponent } from './input/input.component';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    LoadingComponent,
    ModalComponent,
    PlayerComponent,
    InputComponent
  ],
  imports: [
    CommonModule,
    YouTubePlayerModule,
    ReactiveFormsModule
  ],
  exports: [
    LoadingComponent,
    ModalComponent,
    PlayerComponent,
    InputComponent
  ]
})
export class ComponentsModule { }
