import { Component, Input, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  MenuController,
  ModalController,
  ToastController,
} from '@ionic/angular';
import { FireServiceProvider } from 'src/providers/api-service/fire-service';
import { Noticia } from '../../modelo/Noticia';

@Component({
  selector: 'app-modificar-noticia',
  templateUrl: './modificar-noticia.page.html',
  styleUrls: ['./modificar-noticia.page.scss'],
})
export class ModificarNoticiaPage implements OnInit {
  //======================================================================================================================================

  //===========
  //|Atributos|
  //===========

  @Input() noticiaJson;

  private noticia: Noticia = new Noticia();
  private noticiaNueva: Noticia = new Noticia();

  private imageFile: File = null;
  private imageFileName: string = null;
  private lastFileName: string = null;

  private validations_form: FormGroup;

  constructor(
    private firebaseService: FireServiceProvider,
    private modalCtrl: ModalController,
    private formBuilder: FormBuilder,
    private toastController: ToastController,
    private menu: MenuController
  ) {} //end constructor

  //======================================================================================================================================

  //=============
  //|Fases Ionic|
  //=============

  ngOnInit() {
    this.noticia = Noticia.createFromJsonObject(JSON.parse(this.noticiaJson));
    this.noticiaNueva = this.noticia;

    this.validations_form = this.formBuilder.group({
      titulo: new FormControl(
        this.noticiaNueva.titulo,
        Validators.compose([
          Validators.maxLength(27),
          Validators.minLength(3),
          Validators.required,
        ])
      ),
      contenido: new FormControl(
        this.noticiaNueva.contenido,
        Validators.compose([Validators.minLength(3), Validators.required])
      ),
      imagen: new FormControl(this.noticiaNueva.imagen),
    });
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

  subirNoticia() {
    if (this.noticia.id != null) {
      this.firebaseService
        .modificarNoticia(this.noticiaNueva)
        .then(() => {
          this.closeModal();
        })
        .catch((error: string) => {});
    } else {
      let fecha = new Date();
      this.noticiaNueva.fecha = fecha.toLocaleDateString();
      this.firebaseService
        .insertarNoticia(this.noticiaNueva)
        .then(() => {
          this.closeModal();
        })
        .catch((error: string) => {});
    }
  } //end subirNoticia

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
  } //end Toast

  //======================================================================================================================================

  //==================
  //|Ventanas modales|
  //==================

  private closeModal() {
    if (this.noticia.id == null)
      this.firebaseService
        .removeFile(this.lastFileName)
        .then(() => {})
        .catch((error: string) => {});

    this.modalCtrl.dismiss();
  } //end closeModal

  //======================================================================================================================================

  //===============
  //|Otros métodos|
  //===============

  onSubmit(values) {
    this.noticiaNueva.titulo = values.titulo;
    this.noticiaNueva.contenido = values.contenido;
    this.noticiaNueva.imagen = values.imagen;
    this.subirNoticia();
  }//end onSubmit

  imageOnChange(event: any) {
    this.imageFile = event.target.files.item(0);
    var extension = this.imageFile.name.substr(
      this.imageFile.name.lastIndexOf('.') + 1
    );
    //doy al nombre del fichero un número aleatorio
    //le pongo al nombre también la extensión del fichero
    this.imageFileName = `${new Date().getTime()}.${extension}`;
    this.noticiaNueva.imagen = '';
    if (this.imageFile.type.split('/')[0] === 'image') {
      this.firebaseService
        .uploadImage(this.imageFile, this.imageFileName)
        .then((downloadUrl) => {
          this.firebaseService
            .removeFile(this.lastFileName)
            .then(() => {})
            .catch((error: string) => {});
          this.noticiaNueva.imagen = downloadUrl;
          this.validations_form.controls.imagen.setValue(downloadUrl);
          this.lastFileName = downloadUrl;
        })
        .catch((error) => {});
    } else this.presentToast('El fichero no es una imagen');
  } //end imageOnChange
}//end class
