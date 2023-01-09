import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RepertorioPage } from './repertorio.page';

const routes: Routes = [
  {
    path: '',
    component: RepertorioPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RepertorioPageRoutingModule {}
