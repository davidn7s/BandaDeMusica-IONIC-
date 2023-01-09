import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  LoadingController,
  MenuController,
  ModalController,
  ToastController,
} from '@ionic/angular';
import { FireServiceProvider } from 'src/providers/api-service/fire-service';
import { FirebaseAuthService } from 'src/providers/api-service/firebase-auth-service';
import { Usuario } from '../../modelo/Usuario';

@Component({
  selector: 'app-home',
  templateUrl: 'registro.page.html',
  styleUrls: ['registro.page.scss'],
})
export class RegistroPage implements OnInit {
  //======================================================================================================================================

  //===========
  //|Atributos|
  //===========

  private validations_form: FormGroup;
  private matching_passwords_group: FormGroup;

  private validation_messages = {
    name: [{ type: 'required', message: 'El nombre es obligatorio.' }],
    lastname: [
      { type: 'required', message: 'Los apellidos son obligatorios.' },
    ],
    email: [
      { type: 'required', message: 'El correo electronico es obligatorio.' },
      { type: 'pattern', message: 'Introduzca un correo electrónico válido.' },
    ],
    password: [
      { type: 'required', message: 'La contraseña es obligatoria' },
      {
        type: 'minlength',
        message: 'La contraseña debe ser miníma de 8 caracteres.',
      },
      {
        type: 'maxlength',
        message: 'La contraseña no puede superar los 16 caracteres.',
      },
      {
        type: 'pattern',
        message:
          'Tu contraseña tiene que contener al menos una mayuscula, una minúscula y un número.',
      },
    ],
    confirmPassword: [
      { type: 'required', message: 'Es necesario confirmar la contraseña.' },
    ],
    matching_passwords: [
      { type: 'confirmPassword', message: 'Las contraseñas no coinciden.' },
    ],
  };

  constructor(
    private formBuilder: FormBuilder,
    private fireService: FireServiceProvider,
    private toastController: ToastController,
    private fireAuth: FirebaseAuthService,
    private modalCtrl: ModalController,
    private menu: MenuController,
    private loadingController: LoadingController
  ) {} //end constructor

  //======================================================================================================================================

  //=============
  //|Fases Ionic|
  //=============


  ngOnInit() {
    this.matching_passwords_group = new FormGroup(
      {
        password: new FormControl(
          '',
          Validators.compose([
            Validators.maxLength(15),
            Validators.minLength(8),
            Validators.pattern(
              '^(?=.{8,})(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).*$'
            ),
            Validators.required,
          ])
        ),
        confirmPassword: new FormControl('', Validators.required),
      },
      (formGroup: FormGroup) => {
        return this.confirmPassword(formGroup);
      }
    );

    this.validations_form = this.formBuilder.group({
      name: new FormControl(
        '',
        Validators.compose([
          Validators.maxLength(25),
          Validators.minLength(3),
          Validators.required,
        ])
      ),
      lastname: new FormControl(
        '',
        Validators.compose([
          Validators.maxLength(25),
          Validators.minLength(3),
          Validators.required,
        ])
      ),
      email: new FormControl(
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern(
            '^[a-zA-Z0-9_.+-]+[@]{1}[a-zA-Z0-9-]+[.]{1}[a-zA-Z]+$'
          ),
        ])
      ),
      matching_passwords: this.matching_passwords_group,
    });
  } //end ngOnInit

  ionViewWillEnter() {
    this.menu.enable(false);
  } //end ionViewWillEnter

  ionViewWillLeave() {
    this.menu.enable(true);
  } //end ionViewWillLeave

  //======================================================================================================================================

  //==========
  //|Firebase|
  //==========

  getUsuario(usuario: Usuario, contrasenna: string) {
    this.pantallaCarga();
    this.fireAuth
      .loginUser(usuario.email, contrasenna)
      .then((usuario: Usuario) => {
        this.presentToast(
          'Error, email ya registrado, no se ha podido registrarse el usuario'
        );
        this.cerrarCarga();
      })
      .catch((error: string) => {
        this.fireService
          .insertarUsuario(usuario, false)
          .then(() => {
            this.fireAuth
              .registerUser(usuario.email, contrasenna)
              .then((data) => {
                this.cerrarCarga();
                this.presentToast('Registro completado');
                this.modalCtrl.dismiss();
              })
              .catch((error) => {
                this.cerrarCarga();
                this.fireService.eliminarUsuario(usuario, false);
              });
          })
          .catch((error: string) => {});
      });
  } //end getUsuario

  //======================================================================================================================================

  //========
  //|Toasts|
  //========

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
    });
    toast.present();
  } //Toast

  //======================================================================================================================================

  //==================
  //|Ventanas modales|
  //==================

  private closeModal() {
    this.modalCtrl.dismiss();
  } //end CloseModal

  //======================================================================================================================================

  //===============
  //|Otros métodos|
  //===============

  confirmPassword(fg: FormGroup) {
    if (fg.controls['password'].value != fg.controls['confirmPassword'].value)
      return { confirmPassword: true };
    else return null;
  } //end confirmPassword

  onSubmit(values) {
    let usuario = new Usuario();
    usuario.nombre = values.name;
    usuario.apellidos = values.lastname;
    usuario.email = values.email;
    this.getUsuario(usuario, values.matching_passwords.password);
  } //end onSubmit


  async pantallaCarga() {
    const loading = await this.loadingController.create({
      message: 'Registrando usuario ...',
      duration: 20000,
      spinner: 'bubbles',
      translucent: true,
    });
    await loading.present();
  }//end pantallaCarga

  async cerrarCarga() {
    return await this.loadingController.dismiss();
  }//end cerrarCarga

} //end class
