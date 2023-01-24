import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { Usuario } from 'src/modelo/Usuario';
import { FireServiceProvider } from 'src/providers/api-service/fire-service';
import { GlobalVariablesService } from 'src/services/global-variables.service';
import { Noticia } from '../../modelo/Noticia';
import { AppComponent } from '../app.component';
import { DetalleNoticiaPage } from '../detalle-noticia/detalle-noticia.page';
import { ModificarNoticiaPage } from '../modificar-noticia/modificar-noticia.page';

@Component({
  selector: 'app-noticias',
  templateUrl: './noticias.page.html',
  styleUrls: ['./noticias.page.scss'],
})
export class NoticiasPage implements OnInit {
  private noticias: Array<Noticia> = new Array();
  private fecha: any = null;
  private globalUsu: Usuario = new Usuario();
  private gestor = false;
  private textoBuscar: string = '';
  limit: number = 1500;
  truncating = true;

  constructor(
    private modalController: ModalController,
    private fireService: FireServiceProvider,
    private alertCtrl: AlertController,
    private globalVar: GlobalVariablesService,
    private appComponent: AppComponent,
    private datePipe: DatePipe
  ) { } //end constructor

  //======================================================================================================================================

  //=============
  //|Fases Ionic|
  //=============

  ngOnInit() {
    this.appComponent.getGlobalUsu();
    this.globalUsu = this.globalVar.usuGlobal;
    if (this.globalUsu.musico != undefined && this.globalUsu.musico.gestor == true)
      this.gestor = true;
    this.getNoticias();
  } //end ngOnInit

  ionViewWillEnter() {
    this.appComponent.getGlobalUsu();
    this.globalUsu = this.globalVar.usuGlobal;
    console.log('Noticia',this.globalUsu)
    if (this.globalUsu.musico != undefined && this.globalUsu.musico.gestor == true)
      this.gestor = true;
  } //end ionViewWillEnter

  //======================================================================================================================================

  //==========
  //|Firebase|
  //==========

  getNoticias() {
    this.fireService.getNoticiasTR().subscribe((resultadoConsulta) => {
      this.noticias = new Array<Noticia>();
      resultadoConsulta.forEach((datos: any) => {
        let noticia: Noticia = Noticia.createFromJsonObject(
          datos.payload.doc.data()
        );
        this.noticias.push(noticia);

        //Ordenar noticias de más nuevas a más antiguas
        this.noticias.sort((a, b) =>
          this.transformar(a.fecha) < this.transformar(b.fecha) ? 1 : -1
        );
      });
    });
  } //end getNoticias a tiempo real

  borrarNoticia(noticia: Noticia) {
    this.fireService
      .eliminarNoticia(noticia)
      .then(() => { })
      .catch((error: string) => { });
  } //end borrarNoticia

  //======================================================================================================================================

  //================
  //|Alerts Dialogs|
  //================

  confirmar(noticia: Noticia) {
    this.alertCtrl
      .create({
        cssClass: 'app-alert',
        message: '¿Estas seguro de borrar la noticia?',
        buttons: [
          {
            text: 'Borrar',
            handler: () => {
              this.borrarNoticia(noticia);
            },
          },
          {
            text: 'Cancelar',
            handler: () => { },
          },
        ],
      })
      .then((res) => {
        res.present();
      });
  } //end_confirmar

  //======================================================================================================================================

  //==================
  //|Ventanas modales|
  //==================

  async ventanaModal(noticia: Noticia) {
    const modal = await this.modalController.create({
      component: ModificarNoticiaPage,
      componentProps: {
        noticiaJson: JSON.stringify(noticia),
      },
    });
    return await modal.present();
  } //end ventanaModal

  async verDetalles(noticia: Noticia) {
    const modal = await this.modalController.create({
      component: DetalleNoticiaPage,
      componentProps: {
        noticiaJson: JSON.stringify(noticia),
      },
    });
    return await modal.present();
  } //end ventanaModal


  //======================================================================================================================================

  //===============
  //|Otros métodos|
  //===============

  buscar(ev) {
    this.textoBuscar = ev.detail.value;
  } //end buscar

  modificarNoticia(noticia: Noticia) {
    if (noticia == undefined) noticia = new Noticia();
    this.ventanaModal(noticia);
  } //end modificarNoticia

  //Formatea la fecha con DatePipe para que la clase Date la reciba bien y pueda ser comparada
  transformar(fecha) {
    let arrayEventos = [];
    arrayEventos = fecha.split('/');
    let eventoFormatear =
      arrayEventos[1] + '/' + arrayEventos[0] + '/' + arrayEventos[2];

    let formato = this.datePipe.transform(
      eventoFormatear,
      'YYYY-MM-ddTHH:mm:ssZ'
    );
    let final = '';
    let principio = '';
    let bool = false;

    for (let inx: number = 0; inx < formato.length; inx++) {
      if (formato[inx] == '+') {
        bool = true;
      }
      if (bool) final += formato[inx];
      else principio += formato[inx];
    }

    fecha = principio + final[0] + final[1] + final[2] + ':00';

    return fecha;
  } //end transformar
}//end class
