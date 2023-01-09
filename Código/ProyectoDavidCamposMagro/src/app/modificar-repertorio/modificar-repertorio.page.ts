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
import { Partitura } from '../../modelo/Partitura';

@Component({
  selector: 'app-modificar-repertorio',
  templateUrl: './modificar-repertorio.page.html',
  styleUrls: ['./modificar-repertorio.page.scss'],
})
export class ModificarRepertorioPage implements OnInit {
  //======================================================================================================================================

  //===========
  //|Atributos|
  //===========
  @Input() partituraJson;

  private partitura: Partitura = new Partitura();
  private partituraNueva: Partitura = new Partitura();

  private pdfFile: File = null;
  private pdfFileName: string = null;
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
    this.partitura = Partitura.createFromJsonObject(
      JSON.parse(this.partituraJson)
    );
    this.partituraNueva = this.partitura;
    this.lastFileName = this.partitura.fichero;

    this.validations_form = this.formBuilder.group({
      titulo: new FormControl(
        this.partituraNueva.titulo,
        Validators.compose([Validators.minLength(3), Validators.required])
      ),
      autor: new FormControl(
        this.partituraNueva.autor,
        Validators.compose([
          Validators.maxLength(25),
          Validators.minLength(3),
          Validators.required,
        ])
      ),
      tipo: new FormControl(this.partituraNueva.tipo, Validators.required),
      audio: new FormControl(
        this.partituraNueva.audio,
        Validators.compose([
          Validators.pattern('^(https?://)?((www.)?youtube.com|youtu.be)/.+$'),
          Validators.required,
        ])
      ),
      pdf: new FormControl(this.partituraNueva.fichero, Validators.required),
    });
  } //end ngOnInit

  ionViewWillEnter() {
    this.menu.enable(false);
  } //end ionViewWillEnter

  ionViewWillLeave() {
    this.menu.enable(true);
  } //enmd ionViewWillLeave

  //======================================================================================================================================

  //==========
  //|Firebase|
  //==========

  subirPartitura() {
    if (this.partitura.id != null) {
      this.firebaseService
        .modificarPartitura(this.partituraNueva)
        .then(() => {
          this.closeModal();
        })
        .catch((error: string) => {});
    } else {
      this.firebaseService
        .insertarPartitura(this.partituraNueva)
        .then(() => {
          this.closeModal();
        })
        .catch((error: string) => {});
    }
  } //end subirPartitura

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
    if (this.partitura.id == null)
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
    this.partituraNueva.titulo = values.titulo;
    this.partituraNueva.autor = values.autor;
    this.partituraNueva.audio = values.audio;
    this.partituraNueva.fichero = values.pdf;
    this.partituraNueva.tipo = values.tipo;
    this.subirPartitura();
  } //end onSubmit

  fileOnChange(event: any) {
    this.pdfFile = event.target.files.item(0);
    var extension = this.pdfFile.name.substr(
      this.pdfFile.name.lastIndexOf('.') + 1
    );
    //le pongo al nombre también la extensión del fichero
    this.pdfFileName = `${new Date().getTime() + ' - partitura'}.${extension}`;
    this.partituraNueva.fichero = '';

    if (this.pdfFile.type === 'application/pdf') {
      this.firebaseService
        .uploadPdfDocument(this.pdfFile, this.pdfFileName)
        .then((downloadUrl) => {
          this.firebaseService
            .removeFile(this.lastFileName)
            .then(() => {})
            .catch((error: string) => {});
          this.partituraNueva.fichero = downloadUrl;
          this.validations_form.controls.pdf.setValue(downloadUrl);
          this.lastFileName = downloadUrl;
        })
        .catch((error) => {});
    } else this.presentToast('El fichero no es un pdf');
  } //end fileOnChange
}//end class
