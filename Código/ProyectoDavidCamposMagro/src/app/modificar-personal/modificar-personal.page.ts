import { Component, Input, OnInit } from '@angular/core';
import { LoadingController, MenuController, ModalController, ToastController } from '@ionic/angular';
import * as firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import { Usuario } from 'src/modelo/Usuario';
import { FireServiceProvider } from 'src/providers/api-service/fire-service';
import { FirebaseAuthService } from 'src/providers/api-service/firebase-auth-service';
import { GlobalVariablesService } from 'src/services/global-variables.service';
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-modificar-personal',
  templateUrl: './modificar-personal.page.html',
  styleUrls: ['./modificar-personal.page.scss'],
})
export class ModificarPersonalPage implements OnInit {
  private usuario;
  private globalUsu: Usuario = new Usuario();
  private user;


  private oldPassword: string;
  private newPassword: string;
  private newPasswordRepeat: string;
  private pattern: boolean = false;

  private newEmail: string;
  private patternMail: boolean = false;


  private mostrarContrassenna1 = false;
  private icono1 = 'eye';
  private mostrarContrassenna2 = false;
  private icono2 = 'eye';

  private iconoVer = 'chevron-down-outline';
  private cambiar: boolean = false;

  constructor(private firebaseService: FireServiceProvider,
    private modalCtrl: ModalController,
    private toastController: ToastController,
    private menu: MenuController,
    private globalVariable: GlobalVariablesService,
    private appComponent: AppComponent,
    private firebaseAuthService: FirebaseAuthService,
    private loadingCtrl: LoadingController) { }

  ngOnInit() {
    this.appComponent.getGlobalUsu();
    this.usuario = new Usuario();
    this.globalUsu = this.globalVariable.usuGlobal;
    this.getUsuario()
    this.user = firebase.default.auth().currentUser;
  }

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

  modificarUsuario() {
    this.firebaseService
      .modificarUsuario(this.usuario)
      .then(() => {
        this.globalVariable.usuGlobal = this.usuario;
        this.appComponent.getGlobalUsu();
        this.presentToast('Usuario modificado con éxito')
      })
      .catch((error: string) => { });
  } //end modificar

  getUsuario() {
    this.firebaseService.getUsuarioById(this.globalUsu.id)
      .then((data) => {
        this.usuario = data
      }).catch((error: string) => {

      })
  }//end getUsuario

  cambiarContra() {
    this.iniciarPantallaCarga('Cambiando contraseña ...')
    this.onLogin(this.usuario.email, this.oldPassword)
      .then((control: boolean) => {

        if (control) {

          this.user.updatePassword(this.newPassword)
            .then(() => {
              this.presentToast('Se ha modificado su contraseña con éxito')
              this.loadingCtrl.dismiss()
            }).catch((error: string) => {
              this.presentToast('Error en el cambio de contraseña')
              this.loadingCtrl.dismiss()
            })
        }
      }).catch((error: string) => {

      })
  }//end cambiarContra

  cambiarCorreo() {
    this.iniciarPantallaCarga('Cambiando email ...')

    this.user.updateEmail(this.newEmail)
      .then(() => {
        this.usuario.email = this.newEmail;
        this.usuario.nombre = this.globalUsu.nombre;
        this.usuario.apellidos = this.globalUsu.apellidos;
        this.firebaseService.modificarUsuario(this.usuario)
          .then(() => {
            this.globalUsu = this.usuario;
            this.globalVariable.usuGlobal = this.usuario;
            this.appComponent.getGlobalUsu();
            this.presentToast('Se ha modificado su correo con éxito')
            this.loadingCtrl.dismiss()
          }).catch(() => {
            this.presentToast('Error al actualizar el correo electrónico')
            this.loadingCtrl.dismiss()
          })

      }).catch((error: string) => {
        this.presentToast('Error en el cambio de correo electrónico')
        this.loadingCtrl.dismiss()
      })
  }//end cambiarCorreo


  async onLogin(email: string, password: string): Promise<boolean> {
    let sucess = false;
    try {
      const user = await this.firebaseAuthService.loginUser(email, password);
      if (user) {
        sucess = true;
      }
    } catch (error) {
      sucess = false;
      this.presentToast('Error, la contraseña introducida no es la correcta')
    }
    return sucess;
  }//end onLogin


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
    if (this.usuario.nombre == '')
      return true;
    if (this.usuario.nombre.length < 3)
      return true;
    if (this.usuario.apellidos == '')
      return true;
    if (this.usuario.apellidos.length < 3)
      return true;
    return false;
  } // end deshabilitado


  controlContrasenna() {
    if (this.oldPassword == undefined)
      return true;
    if (this.oldPassword == '')
      return true;
    if (this.oldPassword.length < 6)
      return true;
    if (this.newPassword == undefined)
      return true;
    if (this.newPassword == '')
      return true;

    //Evitar problemas de cambiar variable
    setTimeout(() => {
      if (!this.newPassword.match('^(?=.{8,})(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).*$')) {
        this.pattern = true;
        return true;
      }
      this.pattern = false;
    }, 0);

    if (this.newPassword != this.newPasswordRepeat && this.newPassword != undefined)
      return true;

    return false;
  }//end controlContrasenna

  controlEmail() {
    if (this.newEmail == undefined)
      return true;
    if (this.newEmail == '')
      return true

    //Evitar problemas de cambiar variable
    setTimeout(() => {
      if (!this.newEmail.match('^[a-zA-Z0-9_.+-]+[@]{1}[a-zA-Z0-9-]+[.]{1}[a-zA-Z]+$')) {
        this.patternMail = true;
        return true;
      }
      this.patternMail = false;
    }, 0);
    //Condición necesaria, si no se activaria el botón igualmente
    if (!this.newEmail.match('^[a-zA-Z0-9_.+-]+[@]{1}[a-zA-Z0-9-]+[.]{1}[a-zA-Z]+$'))
      return true



    return false;
  }//end controlEmail


  cambiarTipo1() {
    this.mostrarContrassenna1 = !this.mostrarContrassenna1;

    if (this.icono1 == 'eye')
      this.icono1 = 'eye-off';
    else
      this.icono1 = 'eye';
  }//end cambiarTipo

  cambiarTipo2() {
    this.mostrarContrassenna2 = !this.mostrarContrassenna2;

    if (this.icono2 == 'eye')
      this.icono2 = 'eye-off';
    else
      this.icono2 = 'eye';
  }//end cambiarTipo

  modificarPlus() {
    this.cambiar = !this.cambiar

    if (this.iconoVer == 'chevron-down-outline')
      this.iconoVer = 'chevron-up-outline';
    else
      this.iconoVer = 'chevron-down-outline';
  }//end modificarPlus


  async presentToast(mensaje: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2500,
      position: 'bottom'
    });

    await toast.present();
  }


  async iniciarPantallaCarga(mensaje: string) {
    const loading = await this.loadingCtrl.create({
      message: mensaje,
      spinner: 'bubbles',
      cssClass: 'loader-css-class',
      translucent: true,
    });
    return loading.present();
  } //end pantallaCarga

}
