import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModificarRepertorioPageRoutingModule } from './modificar-repertorio-routing.module';

import { ModificarRepertorioPage } from './modificar-repertorio.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModificarRepertorioPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [ModificarRepertorioPage]
})
export class ModificarRepertorioPageModule {}
