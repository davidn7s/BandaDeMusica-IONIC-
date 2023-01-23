import { Component, OnInit } from '@angular/core';
import { LoadingController, MenuController, ToastController } from '@ionic/angular';
import { Usuario } from 'src/modelo/Usuario';
import { FireServiceProvider } from 'src/providers/api-service/fire-service';
import { FirebaseAuthService } from 'src/providers/api-service/firebase-auth-service';

@Component({
  selector: 'app-recordar-contrasenna',
  templateUrl: './recordar-contrasenna.page.html',
  styleUrls: ['./recordar-contrasenna.page.scss'],
})
export class RecordarContrasennaPage implements OnInit {

  private correo: string;

  constructor(
    private loadingController:LoadingController,
    private firebaseAuthService: FirebaseAuthService,
    private fireService: FireServiceProvider,
    private menu: MenuController,
    private toastController: ToastController
    ) { }

  //======================================================================================================================================

  //=============
  //|Fases Ionic|
  //=============
  ngOnInit() {}//end ngOnInit

  ionViewDidEnter() {
    this.menu.enable(false); 
  }//end ionViewDidEnter

  ionViewDidLeave() {
    this.menu.enable(true);
  }//end ionViewDidLeave


  //======================================================================================================================================
  
  //========== 
  //|Firebase|
  //==========

  enviarContrasenna(){
    this.firebaseAuthService.enviarContrasenna(this.correo)
    .then(()=>{
      this.cerrarCarga()
      this.presentToast('El correo le ha sido enviado,<strong> por favor revise la bandeja de spam</strong>',4500)
    }).catch(()=>{
      this.cerrarCarga();
      this.presentToast('Error, el correo no existe o está mal escrito',2500)
    })

  }

  comprobarCorreo(){
    this.pantallaCarga()
    this.fireService.getUsuarioByEmail(this.correo)
    .then((data: Usuario) => {
     
      if(data.id!=null){
        this.enviarContrasenna()
      }else{
        this.cerrarCarga();
        this.presentToast('Error, el correo no existe o está mal escrito',2500)
      }
      
    })
    .catch((error) => {
      this.cerrarCarga();
      this.presentToast('Ha ocurrido un error inesperado',2500);
    });


  }

  //======================================================================================================================================

  //===============
  //|Otros métodos|
  //===============

  deshabilitado() {
    if (!/^[a-zA-Z0-9_.+-]+[@]{1}[a-zA-Z0-9-]+[.]{1}[a-zA-Z]+$/.test(this.correo))
      return true;
    return false;
  }//end deshabilitado


  async pantallaCarga() {
    const loading = await this.loadingController.create({
      message: 'Enviando correo ...',
      duration: 10000,
      spinner: 'bubbles',
      cssClass:'loader-css-class',
      translucent: true,
    });
    await loading.present();
  }//end pantallaCarga

  async cerrarCarga() {
    return await this.loadingController.dismiss();
  }//end cerrarCarga

  async presentToast(message: string,duracion) {
    const toast = await this.toastController.create({
      message: message,
      duration: duracion,
    });
    toast.present();
  } //Toast


}
