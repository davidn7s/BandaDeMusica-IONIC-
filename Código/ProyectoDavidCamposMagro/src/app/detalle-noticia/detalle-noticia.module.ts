import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DetalleNoticiaPageRoutingModule } from './detalle-noticia-routing.module';

import { DetalleNoticiaPage } from './detalle-noticia.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DetalleNoticiaPageRoutingModule
  ],
  declarations: [DetalleNoticiaPage]
})
export class DetalleNoticiaPageModule {}
