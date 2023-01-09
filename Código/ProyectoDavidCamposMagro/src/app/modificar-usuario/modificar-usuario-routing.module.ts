import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModificarUsuarioPage } from './modificar-usuario.page';

const routes: Routes = [
  {
    path: '',
    component: ModificarUsuarioPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModificarUsuarioPageRoutingModule {}
