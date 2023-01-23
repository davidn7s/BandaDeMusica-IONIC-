import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'noticias',
    loadChildren: () => import('./noticias/noticias.module').then( m => m.NoticiasPageModule)
  },
  {
    path: 'repertorio',
    loadChildren: () => import('./repertorio/repertorio.module').then( m => m.RepertorioPageModule)
  },
  {
    path: 'registro',
    loadChildren: () => import('./registro/registro.module').then( m => m.RegistroPageModule)
  },
  {
    path: 'modificar-noticia',
    loadChildren: () => import('./modificar-noticia/modificar-noticia.module').then( m => m.ModificarNoticiaPageModule)
  },
  {
    path: 'modificar-repertorio',
    loadChildren: () => import('./modificar-repertorio/modificar-repertorio.module').then( m => m.ModificarRepertorioPageModule)
  },
  {
    path: 'usuarios',
    loadChildren: () => import('./usuarios/usuarios.module').then( m => m.UsuariosPageModule)
  },
  {
    path: 'modificar-usuario',
    loadChildren: () => import('./modificar-usuario/modificar-usuario.module').then( m => m.ModificarUsuarioPageModule)
  },
  {
    path: 'eventos',
    loadChildren: () => import('./eventos/eventos.module').then( m => m.EventosPageModule)
  },
  {
    path: 'listado-eventos',
    loadChildren: () => import('./listado-eventos/listado-eventos.module').then( m => m.ListadoEventosPageModule)
  },
  {
    path: 'modificar-evento',
    loadChildren: () => import('./modificar-evento/modificar-evento.module').then( m => m.ModificarEventoPageModule)
  },
  {
    path: 'recordar-contrasenna',
    loadChildren: () => import('./recordar-contrasenna/recordar-contrasenna.module').then( m => m.RecordarContrasennaPageModule)
  },
  {
    path: 'modificar-personal',
    loadChildren: () => import('./modificar-personal/modificar-personal.module').then( m => m.ModificarPersonalPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
