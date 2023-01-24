import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Noticia } from 'src/modelo/Noticia';

@Component({
  selector: 'app-detalle-noticia',
  templateUrl: './detalle-noticia.page.html',
  styleUrls: ['./detalle-noticia.page.scss'],
})
export class DetalleNoticiaPage implements OnInit {

  @Input() noticiaJson;

  private noticia: Noticia = new Noticia();

  constructor(private modalCtrl:ModalController) { }

  ngOnInit() {
    this.noticia = Noticia.createFromJsonObject(JSON.parse(this.noticiaJson))
  }

  //======================================================================================================================================

  //==================
  //|Ventanas modales|
  //==================

  closeModal() {
    this.modalCtrl.dismiss();
  } //end closeModal

}
