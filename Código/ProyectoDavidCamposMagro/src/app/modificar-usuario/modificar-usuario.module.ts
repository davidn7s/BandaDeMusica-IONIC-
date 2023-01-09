import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModificarUsuarioPageRoutingModule } from './modificar-usuario-routing.module';

import { ModificarUsuarioPage } from './modificar-usuario.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModificarUsuarioPageRoutingModule
  ],
  declarations: [ModificarUsuarioPage]
})
export class ModificarUsuarioPageModule {}
