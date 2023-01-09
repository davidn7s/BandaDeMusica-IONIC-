import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { Usuario } from 'src/modelo/Usuario';
import { FireServiceProvider } from 'src/providers/api-service/fire-service';
import { GlobalVariablesService } from 'src/services/global-variables.service';
import { Partitura } from '../../modelo/Partitura';
import { AppComponent } from '../app.component';

import { ModificarRepertorioPage } from '../modificar-repertorio/modificar-repertorio.page';

@Component({
  selector: 'app-repertorio',
  templateUrl: './repertorio.page.html',
  styleUrls: ['./repertorio.page.scss'],
})
export class RepertorioPage implements OnInit {
  //======================================================================================================================================

  //===========
  //|Atributos|
  //===========

  private repertorio: Array<Partitura> = new Array();
  private repertorioMuestra: Array<Partitura> = new Array();
  private globalUsu: Usuario = new Usuario();
  private gestor: boolean = false;
  private tipo: string = 'todo';
  private textoBuscar: string = '';

  constructor(
    private modalController: ModalController,
    private fireService: FireServiceProvider,
    private alertCtrl: AlertController,
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
    if (
      this.globalUsu.musico != undefined &&
      this.globalUsu.musico.gestor == true
    )
      this.gestor = true;
    this.getPartituras();
  } //end ngOnInit

  ionViewWillEnter() {
    this.appComponent.getGlobalUsu();
    this.globalUsu = this.globalVar.usuGlobal;
    if (
      this.globalUsu.musico != undefined &&
      this.globalUsu.musico.gestor == true
    )
      this.gestor = true;
    this.tipo = 'todo';
  } //end ionViewWillEnter

  //======================================================================================================================================

  //==========
  //|Firebase|
  //==========

  getPartituras() {
    this.fireService.getPartiturasTR().subscribe((resultadoConsulta) => {
      this.repertorio = new Array<Partitura>();
      this.repertorioMuestra = new Array();
      resultadoConsulta.forEach((datos: any) => {
        let partitura: Partitura = Partitura.createFromJsonObject(
          datos.payload.doc.data()
        );
        this.repertorio.push(partitura);
        this.repertorioMuestra.push(partitura);

        //Ordenar partituras por nombre
        this.repertorio.sort((a, b) =>
          a.titulo.localeCompare(b.titulo) ? -1 : 1
        );
        this.repertorioMuestra.sort((a, b) => (a.titulo > b.titulo ? 1 : -1));
      });
    });
    this.tipo = 'todo';
  } //end getPartituras a tiempo real

  borrarPartitura(partitura: Partitura) {
    this.fireService
      .eliminarPartitura(partitura)
      .then(() => {
        this.repertorioMuestra.forEach((data, index) => {
          if (data == partitura) this.repertorioMuestra.splice(index, 1);
        });
      })
      .catch((error: string) => {});
  } //end borrarPartitura

  //======================================================================================================================================

  //================
  //|Alerts Dialogs|
  //================

  confirmar(partitura: Partitura) {
    this.alertCtrl
      .create({
        message: '¿Estas seguro de borrar la partitura?',
        buttons: [
          {
            text: 'Borrar',
            handler: () => {
              this.borrarPartitura(partitura);
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

  modificarPartitura(partitura: Partitura) {
    if (partitura == undefined) partitura = new Partitura();
    this.ventanaModal(partitura);
    this.tipo = 'todo';
  } //end modificarRepertorio

  async ventanaModal(partitura: Partitura) {
    const modal = await this.modalController.create({
      component: ModificarRepertorioPage,
      componentProps: {
        partituraJson: JSON.stringify(partitura),
      },
    });
    return await modal.present();
  } //end ventanaModal

  //======================================================================================================================================

  //===============
  //|Otros métodos|
  //===============

  //Método para controlar que enlace abrir
  enlace(partitura: Partitura, opcion: number) {
    if (opcion == 1) window.open(partitura.audio, '_system', 'Location=yes');
    else window.open(partitura.fichero, '_system', 'Location=yes');
  } //end enlace

  cambioTipo(evento) {
    this.repertorioMuestra = new Array();
    if (this.tipo !== 'todo') {
      this.repertorio.forEach((partitura: Partitura) => {
        if (partitura.tipo.trim() === this.tipo.trim())
          this.repertorioMuestra.push(partitura);
          this.repertorioMuestra.sort((a, b) => (a.titulo > b.titulo ? 1 : -1));
      });
    } else {
      this.repertorioMuestra = this.repertorio;
      this.repertorioMuestra.sort((a, b) => (a.titulo > b.titulo ? 1 : -1));
    }
    this.repertorioMuestra.sort((a, b) => (a.titulo > b.titulo ? 1 : -1));
  } //end cambioTipo

  buscar(ev) {
    this.textoBuscar = ev.detail.value;
  } //end buscar
} //end class
