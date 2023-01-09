import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListadoEventosPageRoutingModule } from './listado-eventos-routing.module';

import { ListadoEventosPage } from './listado-eventos.page';
import { PipesModule } from '../pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListadoEventosPageRoutingModule,
    PipesModule
  ],
  declarations: [ListadoEventosPage]
})
export class ListadoEventosPageModule {}
