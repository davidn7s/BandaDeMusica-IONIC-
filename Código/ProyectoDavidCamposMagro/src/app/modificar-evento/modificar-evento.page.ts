import { DatePipe } from '@angular/common';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { MenuController, ModalController } from '@ionic/angular';
import { CalendarComponent } from 'ion2-calendar';
import { Evento } from 'src/modelo/Evento';
import { FireServiceProvider } from 'src/providers/api-service/fire-service';

@Component({
  selector: 'app-modificar-evento',
  templateUrl: './modificar-evento.page.html',
  styleUrls: ['./modificar-evento.page.scss'],
})
export class ModificarEventoPage implements OnInit {
  //======================================================================================================================================

  //===========
  //|Atributos|
  //===========

  @Input() eventoJson;

  private minDate = new Date().toISOString();

  private eventos = [];

  private calendario = {
    modo: 'month',
    fechaActual: new Date(),
  };

  private evento: Evento = new Evento();
  private eventoNuevo: Evento = new Evento();

  private inicio: string;
  private fin: string;

  @ViewChild(CalendarComponent) myCal: CalendarComponent;
  constructor(
    private modalCtrl: ModalController,
    private fireService: FireServiceProvider,
    private datePipe: DatePipe,
    private db: AngularFirestore,
    private menu: MenuController
  ) {} //end constructor

  //======================================================================================================================================

  //=============
  //|Fases Ionic|
  //=============

  ngOnInit() {
    this.evento = Evento.createFromJsonObject(JSON.parse(this.eventoJson));

    this.eventoNuevo = this.evento;
    this.transformar(this.evento.startTime, true);
    this.transformar(this.evento.endTime, false);
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

  private aceptar() {
    this.eventoNuevo.startTime = new Date(this.inicio);
    this.eventoNuevo.endTime = new Date(this.fin);

    const event = {
      id: '',
      title: this.eventoNuevo.title,
      startTime: this.eventoNuevo.startTime,
      endTime: this.eventoNuevo.endTime,
      allDay: false,
    };
    if (this.evento.id == null) {
      event.id = this.db.collection('Eventos').ref.doc().id;
      this.db.collection('Eventos').doc(event.id).set(event);
    } else {
      event.id = this.eventoNuevo.id;
      this.db.collection('Eventos').doc(this.eventoNuevo.id).update(event);
    }
    this.modalCtrl.dismiss();
  } //end aceptar

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

  //Formatea la fecha con DatePipe para que la clase Date la reciba bien y pueda ser usada en los dateTime
  transformar(evento, inicio: boolean) {
    let arrayEventos = [];
    arrayEventos = evento.split('/');
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

    if (inicio)
      this.inicio = principio + final[0] + final[1] + final[2] + ':00';
    else this.fin = principio + final[0] + final[1] + final[2] + ':00';
  } //end transformar

  deshabilitar() {
    if (this.eventoNuevo.title == null) return true;
    if (this.eventoNuevo.title == '') return true;
    if (this.eventoNuevo.title.length >= 27) return true;
    if (this.inicio == null) return true;
    if (this.inicio == '') return true;
    if (this.fin == null) return true;
    if (this.fin == '') return true;
    if (this.fin <= this.inicio) return true;

    return false;
  } //end deshabilitar
}//end class
