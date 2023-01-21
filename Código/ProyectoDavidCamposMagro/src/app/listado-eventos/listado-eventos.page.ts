import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import {
  AlertController,
  MenuController,
  ModalController,
  NavParams,
} from '@ionic/angular';
import { Usuario } from 'src/modelo/Usuario';
import { FireServiceProvider } from 'src/providers/api-service/fire-service';
import { GlobalVariablesService } from 'src/services/global-variables.service';
import { AppComponent } from '../app.component';
import { ModificarEventoPage } from '../modificar-evento/modificar-evento.page';

@Component({
  selector: 'app-listado-eventos',
  templateUrl: './listado-eventos.page.html',
  styleUrls: ['./listado-eventos.page.scss'],
})
export class ListadoEventosPage implements OnInit {
  //======================================================================================================================================

  //===========
  //|Atributos|
  //===========

  private eventos = [];

  private globalUsu: Usuario = new Usuario();
  private gestor = false;

  private textoBuscar: string = '';

  constructor(
    private db: AngularFirestore,
    private alertCtrl: AlertController,
    private fireService: FireServiceProvider,
    private modalCtrl: ModalController,
    private menu: MenuController,
    private globalVar: GlobalVariablesService,
    private appComponent: AppComponent
  ) {} //end constructor

  //======================================================================================================================================

  //=============
  //|Fases Ionic|
  //=============

  ngOnInit() {
    this.getEventos();

    this.appComponent.getGlobalUsu();
    this.globalUsu = this.globalVar.usuGlobal;
    if (
      this.globalUsu.musico != undefined &&
      this.globalUsu.musico.gestor == true
    )
      this.gestor = true;
    this.getEventos();
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

  getEventos() {
    this.db
      .collection(`Eventos`)
      .snapshotChanges()
      .subscribe((colSnap) => {
        this.eventos = [];
        colSnap.forEach((snap) => {
          const event: any = snap.payload.doc.data();
          event.id = event.id;
          event.startTime = event.startTime.toDate().toLocaleString();
          event.endTime = event.endTime.toDate().toLocaleString();

          this.eventos.push(event);

          //Ordenar eventos de más nuevas a más antiguas
          this.eventos.sort((a, b) =>
            new Date(a.startTime).getTime < new Date(b.startTime).getTime
              ? -1
              : 1
          );
        });
      });
  } //end getEventos

  borrarEvento(evento) {
    this.fireService
      .eliminarEvento(evento)
      .then(() => {})
      .catch((error: string) => {});
  } //end borrarEvento

  //======================================================================================================================================

  //================
  //|Alerts Dialogs|
  //================

  confirmar(evento) {
    this.alertCtrl
      .create({
        message: '¿Estas seguro de borrar la partitura?',
        buttons: [
          {
            text: 'Borrar',
            handler: () => {
              this.borrarEvento(evento);
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
  } //end_confirmar

  //======================================================================================================================================

  //==================
  //|Ventanas modales|
  //==================

  closeModal() {
    this.modalCtrl.dismiss();
  } //end closeModal

  async modificarEvento(evento) {
    const modalController = await this.modalCtrl.create({
      component: ModificarEventoPage,
      componentProps: {
        eventoJson: JSON.stringify(evento),
      },
    });

    await modalController.present();
  } //end modificarEvento

  //======================================================================================================================================

  //===============
  //|Otros métodos|
  //===============

  buscar(ev) {
    this.textoBuscar = ev.detail.value;
  } //end buscar
}//end class
