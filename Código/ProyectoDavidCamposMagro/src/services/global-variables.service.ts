import { Injectable } from '@angular/core';
import { Usuario } from 'src/modelo/Usuario';

@Injectable()
export class GlobalVariablesService {
  //======================================================================================================================================

  //===========
  //|Atributos|
  //===========
  
  public usuGlobal: Usuario= new Usuario();


}
