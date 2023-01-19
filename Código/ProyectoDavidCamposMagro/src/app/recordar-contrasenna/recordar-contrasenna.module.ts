import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RecordarContrasennaPageRoutingModule } from './recordar-contrasenna-routing.module';

import { RecordarContrasennaPage } from './recordar-contrasenna.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RecordarContrasennaPageRoutingModule
  ],
  declarations: [RecordarContrasennaPage]
})
export class RecordarContrasennaPageModule {}
