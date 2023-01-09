import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModificarRepertorioPage } from './modificar-repertorio.page';

const routes: Routes = [
  {
    path: '',
    component: ModificarRepertorioPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModificarRepertorioPageRoutingModule {}
