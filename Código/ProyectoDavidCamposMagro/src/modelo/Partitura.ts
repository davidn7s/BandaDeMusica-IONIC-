export class Partitura {
  id: any = null; //el tipo es any para que valga para firebase (string) y json-server (number)
  titulo: string = '';
  autor: string = '';
  fichero: string = '';
  audio: string = '';
  tipo: string = '';

  constructor() {}

  public static createFromJsonObject(jsonObject: any): Partitura {
    let partitura: Partitura = new Partitura();
    partitura.id = jsonObject['id'];
    partitura.titulo = jsonObject['titulo'];
    partitura.autor = jsonObject['autor'];
    partitura.fichero = jsonObject['fichero'];
    partitura.audio = jsonObject['audio'];
    partitura.tipo = jsonObject['tipo'];

    return partitura;
  }
} //end_class
