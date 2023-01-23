import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController, Platform } from '@ionic/angular';
import { Usuario } from 'src/modelo/Usuario';
import { GlobalVariablesService } from 'src/services/global-variables.service';

import { ModificarPersonalPage } from './modificar-personal/modificar-personal.page';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  //======================================================================================================================================

  //===========
  //|Atributos|
  //===========

  private navigate: any;
  private usuarioGlobal: Usuario = new Usuario();

  constructor(
    private globalVar: GlobalVariablesService,
    public router: Router) {
    this.sideMenu();
  } //end constructor

  //======================================================================================================================================

  //=============
  //|Fases Ionic|
  //=============

  ngOnInit(): void {
    this.usuarioGlobal = this.globalVar.usuGlobal;
    this.getGlobalUsu();
  } //end ngOnInit

  //======================================================================================================================================

  //============
  //|Navegación|
  //============

   modificar() {
    this.router.navigateByUrl('modificar-personal')
  } //end ventanaModal

  //======================================================================================================================================

  //===============
  //|Otros métodos|
  //===============

  //Método para volver a recoger el usuario global y reinicializar el menú lateral
  getGlobalUsu() {
    this.usuarioGlobal = this.globalVar.usuGlobal;
    this.sideMenu();
  } //end getGlobalUsu



  sideMenu() {
    if (this.usuarioGlobal.musico != undefined && this.usuarioGlobal.musico.gestor == true)
      this.navigate = [
        { 
          title: 'Noticias',
          url: '/noticias',
          icon: 'newspaper-outline',
        },
        {
          title: 'Repertorio',
          url: '/repertorio',
          icon: 'musical-notes-outline',
        },
        {
          title: 'Eventos',
          url: '/eventos',
          icon: 'calendar-outline',
        },
        {
          title: 'Usuarios',
          url: '/usuarios',
          icon: 'people-outline',
        },
      ];
    else if (this.usuarioGlobal.email != '')
      this.navigate = [
        {
          title: 'Noticias',
          url: '/noticias',
          icon: 'newspaper-outline',
        },
        {
          title: 'Repertorio',
          url: '/repertorio',
          icon: 'musical-notes-outline',
        },
        {
          title: 'Eventos',
          url: '/eventos',
          icon: 'calendar-outline',
        },
      ];
    else
      this.navigate = [
        {
          title: 'Noticias',
          url: '/noticias',
          icon: 'newspaper-outline',
        },
        {
          title: 'Repertorio',
          url: '/repertorio',
          icon: 'musical-notes-outline',
        },
        {
          title: 'Eventos',
          url: '/eventos',
          icon: 'calendar-outline',
        },
        {
          title: 'Iniciar sesión',
          url: '/home',
          icon: 'log-in-outline',
        },
      ];
  } //end sideMenu

  logOut() {
    this.usuarioGlobal = new Usuario();
    this.sideMenu();
    window.location.replace("/home")
  } //end logOut
} //end class
