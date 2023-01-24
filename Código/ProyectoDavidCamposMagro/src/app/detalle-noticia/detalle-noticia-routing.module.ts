import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DetalleNoticiaPage } from './detalle-noticia.page';

const routes: Routes = [
  {
    path: '',
    component: DetalleNoticiaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DetalleNoticiaPageRoutingModule {}
