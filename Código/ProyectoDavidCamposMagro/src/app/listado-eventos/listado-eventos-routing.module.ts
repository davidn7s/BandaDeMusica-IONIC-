import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListadoEventosPage } from './listado-eventos.page';

const routes: Routes = [
  {
    path: '',
    component: ListadoEventosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListadoEventosPageRoutingModule {}
