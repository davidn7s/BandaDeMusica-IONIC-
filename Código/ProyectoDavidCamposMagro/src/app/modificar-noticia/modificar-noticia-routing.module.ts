import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModificarNoticiaPage } from './modificar-noticia.page';

const routes: Routes = [
  {
    path: '',
    component: ModificarNoticiaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModificarNoticiaPageRoutingModule {}
