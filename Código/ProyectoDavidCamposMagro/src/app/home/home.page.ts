import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {
  LoadingController,
  MenuController,
  ModalController,
  NavController,
  Platform,
  ToastController,
} from '@ionic/angular';
import { FireServiceProvider } from 'src/providers/api-service/fire-service';
import { FirebaseAuthService } from 'src/providers/api-service/firebase-auth-service';
import { RegistroPage } from '../registro/registro.page';

import { Usuario } from 'src/modelo/Usuario';
import { GlobalVariablesService } from 'src/services/global-variables.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  //============================================================================================================

  //===========
  //|Atributos|
  //===========

  private correo: string;
  private contrasenna: string;
  private mostrarContrassenna = false;
  private icono = 'eye';

  constructor(
    private firebaseAuthService: FirebaseAuthService,
    private toastController: ToastController,
    private modalController: ModalController,
    private fireService: FireServiceProvider,
    private navCtrl: NavController,
    private globalVar: GlobalVariablesService,
    private menu: MenuController,
    private loadingController:LoadingController
  ) {}//end constructor

  //======================================================================================================================================

  //=============
  //|Fases Ionic|
  //=============
  ngOnInit() {}//end ngOnInit

  ionViewWillEnter() {
    this.menu.enable(false); 
  }//end ionViewWillEnter

  ionViewWillLeave() {
    this.menu.enable(true);
  }//end ionViewWillLeave

  //======================================================================================================================================
  
  //========== 
  //|Firebase|
  //==========

  login() {
    this.pantallaCarga();
    this.firebaseAuthService
      .loginUser(this.correo, this.contrasenna)
      .then((data) => {
        this.fireService
          .getUsuarioByEmail(this.correo)
          .then((data: Usuario) => {
            this.cerrarCarga();
            this.globalVar.usuGlobal = data;
            this.loginCorrecto();
          })
          .catch((error) => {
            this.cerrarCarga();
            this.presentToast('Ha ocurrido un error inesperado');
          });
      })
      .catch((error) => {
        this.cerrarCarga();
        this.presentToast(
          'Error, el correo electronico o la contraseña son incorrectos'
        );
      });
  } //end login

  //======================================================================================================================================

  //===============================
  //|Ventanas modales / Navegación|
  //===============================
  registrar() {
    this.ventanaModal();
  }

  contrasennaOlvidada(){
    this.navCtrl.navigateForward('/recordar-contrasenna')
  }

  async ventanaModal() {
    const modal = await this.modalController.create({
      component: RegistroPage,
    });
    return await modal.present();
  }

  loginCorrecto() {
    this.navCtrl.navigateForward('/noticias');
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 3500,
    });
    toast.present();
  } //Toast

  //======================================================================================================================================

  //===============
  //|Otros métodos|
  //===============

  deshabilitado() {
    if (!/^[a-zA-Z0-9_.+-]+[@]{1}[a-zA-Z0-9-]+[.]{1}[a-zA-Z]+$/.test(this.correo))
      return true;
    if (this.contrasenna.length < 6) 
      return true;

    return false;
  }//end deshabilitado

  async pantallaCarga() {
    const loading = await this.loadingController.create({
      message: 'Realizando login ...',
      duration: 20000,
      spinner: 'bubbles',
      translucent: true,
    });
    await loading.present();
  }//end pantallaCarga

  async cerrarCarga() {
    return await this.loadingController.dismiss();
  }//end cerrarCarga

  cambiarTipo() {
    this.mostrarContrassenna = !this.mostrarContrassenna;

    if (this.icono == 'eye')
      this.icono = 'eye-off'
    else
      this.icono = 'eye'
  }//end cambiarTipo


} //end class
