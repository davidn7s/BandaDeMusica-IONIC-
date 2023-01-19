import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RecordarContrasennaPage } from './recordar-contrasenna.page';

const routes: Routes = [
  {
    path: '',
    component: RecordarContrasennaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RecordarContrasennaPageRoutingModule {}
