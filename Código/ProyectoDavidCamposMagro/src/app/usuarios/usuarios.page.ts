import { Component, OnInit } from '@angular/core';
import {
  AlertController,
  ModalController,
  ToastController,
} from '@ionic/angular';
import { Usuario } from 'src/modelo/Usuario';
import { FireServiceProvider } from 'src/providers/api-service/fire-service';
import { GlobalVariablesService } from 'src/services/global-variables.service';
import { AppComponent } from '../app.component';
import { ModificarUsuarioPage } from '../modificar-usuario/modificar-usuario.page';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.page.html',
  styleUrls: ['./usuarios.page.scss'],
})
export class UsuariosPage implements OnInit {
  //======================================================================================================================================

  //===========
  //|Atributos|
  //===========

  private usuarios: Array<Usuario> = new Array();
  private usuariosMuestra: Array<Usuario> = new Array();
  private textoBuscar: string = '';
  private tipo: string = 'todo';

  private globalUsu: Usuario = new Usuario();

  constructor(
    private modalController: ModalController,
    private fireService: FireServiceProvider,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private globalVar: GlobalVariablesService,
    private appComponent: AppComponent
  ) {} //end constructor

  //======================================================================================================================================

  //=============
  //|Fases Ionic|
  //=============

  ngOnInit() {
    this.appComponent.getGlobalUsu();
    this.globalUsu = this.globalVar.usuGlobal;

    this.getUsuarios();
  } //end ngOnInit

  //======================================================================================================================================

  //==========
  //|Firebase|
  //==========

  getUsuarios() {
    this.fireService.getUsuariosTR().subscribe((resultadoConsulta) => {
      this.usuariosMuestra = new Array<Usuario>();
      this.usuarios = new Array<Usuario>();
      resultadoConsulta.forEach((datos: any) => {
        let usuario: Usuario = Usuario.createFromJsonObject(
          datos.payload.doc.data()
        );
        this.usuarios.push(usuario);
        this.usuariosMuestra.push(usuario);

        //Ordenar usuarios alfabéticamente
        this.usuarios.sort(this.ordenar);
        this.usuariosMuestra.sort(this.ordenar);
      });
    });
    this.tipo = 'todo';
  } //end getUsuarios

  borrarUsuario(usuario: Usuario) {
    this.fireService
      .eliminarUsuario(usuario,true)
      .then(() => {})
      .catch((error: string) => {});
  } //end borrarUsuario

  //======================================================================================================================================

  //================
  //|Alerts Dialogs|
  //================

  opciones(usuario: Usuario) {
    this.alertCtrl
      .create({
        cssClass: 'app-alert',
        message: 'Opciones',
        buttons: [
          {
            text: 'Borrar',
            handler: () => {
              if (usuario.id != this.globalUsu.id) this.confirmar(usuario);
              else
                this.presentToast(
                  'Estas autenticado con este mismo usuario, no puede ser borrado'
                );
            },
          },
          {
            text: 'Modificar',
            handler: () => {
              this.ventanaModal(usuario);
            },
          },
        ],
      })
      .then((res) => {
        res.present();
      });
  } //end opciones

  confirmar(usuario: Usuario) {
    this.alertCtrl
      .create({
        cssClass: 'app-alert',
        message: '¿Estas seguro de borrar la usuario?',
        buttons: [
          {
            text: 'Borrar',
            handler: () => {
              this.borrarUsuario(usuario);
            },
          },
          {
            text: 'Cancelar',
            handler: () => {},
          },
        ],
      })
      .then((res) => {
        res.present();
      });
  } //end confirmar

  //======================================================================================================================================

  //========
  //|Toasts|
  //========

  async presentToast(message: string) {
    const toast = await this.toastCtrl.create({
      message: message,
      duration: 6000,
    });
    toast.present();
  } //end Toast

  //======================================================================================================================================

  //==================
  //|Ventanas modales|
  //==================

  async ventanaModal(usuario: Usuario) {
    const modal = await this.modalController.create({
      component: ModificarUsuarioPage,
      componentProps: {
        usuarioJson: JSON.stringify(usuario),
        propio: JSON.stringify(false),
      },
    });

    let mensaje = '';
    mensaje +=
      '<strong>Usuario:</strong> ' +
      usuario.nombre.charAt(0).toUpperCase() +
      usuario.nombre.slice(1) +
      ' ' +
      usuario.apellidos.charAt(0).toUpperCase() +
      usuario.apellidos.slice(1);
    if (usuario.musico)
      mensaje +=
        '\n <strong>Categoría:</strong> ' +
        usuario.musico.categoria.charAt(0).toUpperCase() +
        usuario.musico.categoria.slice(1) +
        ' <strong>Instrumento:</strong> ' +
        usuario.musico.instrumento.charAt(0).toUpperCase() +
        usuario.musico.instrumento.slice(1);

    this.presentToast(mensaje);

    modal.onDidDismiss().then(() => {
      this.getUsuarios();
      this.textoBuscar = '';
    });
    return await modal.present();
  } //end ventanaModal

  //======================================================================================================================================

  //===============
  //|Otros métodos|
  //===============

  ordenar(a, b) {
    return a.nombre.localeCompare(b.nombre);
  } //end ordenar

  cambioTipo(evento) {
    console.log(this.usuarios)
    this.usuariosMuestra = new Array();
    if (this.tipo !== 'todo') {
      if (this.tipo === 'perteneciente') {
        this.usuarios.forEach((usuario: Usuario) => {
          if (usuario.musico) this.usuariosMuestra.push(usuario);
        });
      } else {
        this.usuarios.forEach((usuario: Usuario) => {
          if (!usuario.musico) this.usuariosMuestra.push(usuario);
        });
      }
    } else {
      this.usuariosMuestra = this.usuarios;
    }
    this.usuariosMuestra.sort((a, b) =>
      a.nombre.localeCompare(b.nombre) ? 1 : -1
    );
  } //end cambioTipo

  buscar(ev) {
    this.textoBuscar = ev.detail.value;
  } //end buscar
} //end class
