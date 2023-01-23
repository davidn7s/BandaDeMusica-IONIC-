import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModificarPersonalPage } from './modificar-personal.page';

const routes: Routes = [
  {
    path: '',
    component: ModificarPersonalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModificarPersonalPageRoutingModule {}
