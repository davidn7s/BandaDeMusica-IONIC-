import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import {  ModalController } from '@ionic/angular';
import { CalendarComponent } from 'ion2-calendar';
import { Evento } from 'src/modelo/Evento';
import { Usuario } from 'src/modelo/Usuario';
import { GlobalVariablesService } from 'src/services/global-variables.service';
import { AppComponent } from '../app.component';
import { ListadoEventosPage } from '../listado-eventos/listado-eventos.page';

import { ModificarEventoPage } from '../modificar-evento/modificar-evento.page';

@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.page.html',
  styleUrls: ['./eventos.page.scss'],
})
export class EventosPage implements OnInit {
  //============================================================================================================

  //===========
  //|Atributos|
  //===========

  private eventos = [];
  private titulo: string;

  private calendario = {
    modo: 'month',
    fechaActual: new Date(),
  };

  private globalUsu: Usuario = new Usuario();
  private gestor = false;

  @ViewChild(CalendarComponent) myCal: CalendarComponent;
  constructor(
    private modalController: ModalController,
    private globalVar: GlobalVariablesService,
    private appComponent: AppComponent,
    private db: AngularFirestore
  ) {} //end constructor

  //============================================================================================================

  //=============
  //|Fases Ionic|
  //=============

  ngOnInit() {
    this.appComponent.getGlobalUsu();
    this.globalUsu = this.globalVar.usuGlobal;
    if (this.globalUsu.musico != undefined && this.globalUsu.musico.gestor == true){
      this.gestor = true;
    }
      
    this.getEventos();
  } //end ngOnInit

  ionViewWillEnter() {
    this.appComponent.getGlobalUsu();
    this.globalUsu = this.globalVar.usuGlobal;
    if (this.globalUsu.musico != undefined && this.globalUsu.musico.gestor == true){
      this.gestor = true;
    }
      
  } //end ionViewWillEnter

  //============================================================================================================

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
          event.startTime = event.startTime.toDate();
          event.endTime = event.endTime.toDate();
          this.eventos.push(event);
        });
      });
  } //end getEventos

  //============================================================================================================

  //====================
  //|Métodos calendario|
  //====================

  tituloCambiado(titulo) {
    this.titulo = titulo.charAt(0).toUpperCase() + titulo.slice(1);
  } //end tituloCambiado

  //============================================================================================================

  //==================
  //|Ventanas modales|
  //==================

  modificarEvento(evento: Evento) {
    if (evento == undefined) evento = new Evento();
    this.ventanaModal(evento);
  } //end modificarEvento

  async listado() {
    const modalController = await this.modalController.create({
      component: ListadoEventosPage,
    });

    await modalController.present();
  } //end listado

  async ventanaModal(evento: Evento) {
    const modalController = await this.modalController.create({
      component: ModificarEventoPage,
      componentProps: {
        eventoJson: JSON.stringify(evento),
      },
    });

    await modalController.present();
  } //end ventanaModal
} //end class
