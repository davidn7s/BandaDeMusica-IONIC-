import { Component, Input, OnInit } from '@angular/core';
import { MenuController, ModalController } from '@ionic/angular';
import { Musico } from 'src/modelo/Musico';
import { Usuario } from 'src/modelo/Usuario';
import { FireServiceProvider } from 'src/providers/api-service/fire-service';
import { GlobalVariablesService } from 'src/services/global-variables.service';
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-modificar-usuario',
  templateUrl: './modificar-usuario.page.html',
  styleUrls: ['./modificar-usuario.page.scss'],
})
export class ModificarUsuarioPage implements OnInit {
  //======================================================================================================================================

  //===========
  //|Atributos|
  //===========

  @Input() usuarioJson;
  @Input() propio;

  private usuario;
  private musico: boolean;
  private globalUsu: Usuario = new Usuario();
  private gestor: boolean = false;
  private propioC: boolean = false;

  constructor(
    private firebaseService: FireServiceProvider,
    private modalCtrl: ModalController,
    private globalVariable: GlobalVariablesService,
    private appComponent: AppComponent,
    private menu: MenuController
  ) { } //end constructor

  //======================================================================================================================================

  //=============
  //|Fases Ionic|
  //=============

  ngOnInit() {
    localStorage.clear();
    this.appComponent.getGlobalUsu();
    this.globalUsu = this.globalVariable.usuGlobal;

    if (this.globalUsu.musico != undefined && this.globalUsu.musico.gestor == true) {
      this.gestor = true;
    }

    this.usuario = new Usuario();

    this.propioC = JSON.parse(this.propio);

    this.getUsuario()
  } //end ngOnInit

  ionViewDidEnter() {
    this.menu.enable(false);
  } //end ionViewDidEnter

  ionViewDidLeave() {
    this.menu.enable(true);
  } //end ionViewDidLeave

  //======================================================================================================================================

  //==========
  //|Firebase|
  //==========

  modificar() {
    if (!this.musico) {
      this.usuario.musico = undefined;
      this.firebaseService
        .eliminarUsuario(this.usuario, false)
        .then(() => {
          this.firebaseService
            .insertarUsuario(this.usuario, true)
            .then(() => { })
            .catch((error: string) => { });
        })
        .catch((error: string) => { });
    } else {
      this.firebaseService
        .modificarUsuario(this.usuario)
        .then(() => { })
        .catch((error: string) => { });
    }

    if (this.propioC) {
      this.globalVariable.usuGlobal = this.usuario;
    }

    this.closeModal();
  } //end modificar


  getUsuario() {
    this.firebaseService.getUsuarioById(Usuario.createFromJsonObject(JSON.parse(this.usuarioJson)).id)
      .then((data) => {
        this.usuario = data
        if (this.usuario.musico.categoria != '' && this.usuario.musico.categoria != null) {
          this.musico = true;
        }
      }).catch((error: string) => {

      })
  }

  //======================================================================================================================================

  //==================
  //|Ventanas modales|
  //==================

  closeModal() {
    this.modalCtrl.dismiss();
  } //end closeModal

  //======================================================================================================================================

  //===============
  //|Otros métodos|
  //===============

  deshabilitado() {
    if (this.usuario.nombre == null)
      return true;
    if (this.usuario.nombre == '')
      return true;
    if (this.usuario.nombre.length < 3)
      return true;
    if (this.usuario.apellidos == null)
      return true;
    if (this.usuario.apellidos == '')
      return true;
    if (this.usuario.apellidos.length < 3)
      return true;

    if (this.usuario.musico != undefined) {
      if (this.usuario.musico.categoria == undefined)
        return true;
      if (this.usuario.musico.categoria == '')
        return true;
      if (this.usuario.musico.instrumento == undefined)
        return true;
      if (this.usuario.musico.instrumento == '')
        return true;
    }
    return false;
  } // end deshabilitado

  cambio() {
    if (this.usuario.musico == undefined && this.musico) {
      this.usuario.musico = new Musico();
    } else if (!this.musico) {
      this.usuario.musico = undefined;
    }
  } //end cambio
}//end class
