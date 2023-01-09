import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModificarNoticiaPageRoutingModule } from './modificar-noticia-routing.module';

import { ModificarNoticiaPage } from './modificar-noticia.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModificarNoticiaPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [ModificarNoticiaPage]
})
export class ModificarNoticiaPageModule {}
