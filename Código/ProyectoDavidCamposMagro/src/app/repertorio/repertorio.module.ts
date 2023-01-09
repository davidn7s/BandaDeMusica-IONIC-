import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RepertorioPageRoutingModule } from './repertorio-routing.module';

import { RepertorioPage } from './repertorio.page';
import { PipesModule } from '../pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RepertorioPageRoutingModule,
    PipesModule
  ],
  declarations: [RepertorioPage]
})
export class RepertorioPageModule {}
