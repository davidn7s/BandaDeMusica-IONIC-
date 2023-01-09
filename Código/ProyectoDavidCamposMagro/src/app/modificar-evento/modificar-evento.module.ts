import { LOCALE_ID,NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModificarEventoPageRoutingModule } from './modificar-evento-routing.module';

import { ModificarEventoPage } from './modificar-evento.page';
import {  CalendarModule } from 'ion2-calendar';
import { NgCalendarModule } from 'ionic2-calendar';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es'
registerLocaleData(localeEs)

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModificarEventoPageRoutingModule,
    CalendarModule,
    NgCalendarModule
    
  ],
  declarations: [ModificarEventoPage],
  providers: [
    {provide: LOCALE_ID, useValue: 'ES-es'}
  ]
})
export class ModificarEventoPageModule {}
