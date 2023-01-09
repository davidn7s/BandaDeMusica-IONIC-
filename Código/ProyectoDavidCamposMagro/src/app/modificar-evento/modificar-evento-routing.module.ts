import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModificarEventoPage } from './modificar-evento.page';

const routes: Routes = [
  {
    path: '',
    component: ModificarEventoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModificarEventoPageRoutingModule {}
