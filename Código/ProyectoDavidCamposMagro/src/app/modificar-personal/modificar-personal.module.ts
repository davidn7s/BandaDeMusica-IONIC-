import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModificarPersonalPageRoutingModule } from './modificar-personal-routing.module';

import { ModificarPersonalPage } from './modificar-personal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModificarPersonalPageRoutingModule,
  ],
  declarations: [ModificarPersonalPage]
})
export class ModificarPersonalPageModule {}
