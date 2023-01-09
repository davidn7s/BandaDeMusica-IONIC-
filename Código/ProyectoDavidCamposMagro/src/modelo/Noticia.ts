export class Noticia {

    id: any = null;  //el tipo es any para que valga para firebase (string) y json-server (number)
    titulo: string = "";
    contenido: string = "";
    imagen: string = "";
    fecha:any=null;
    

    constructor() {
    }

    public static createFromJsonObject(jsonObject: any): Noticia {
        let noticia: Noticia = new Noticia();
        noticia.id = jsonObject['id'];
        noticia.titulo = jsonObject['titulo'];
        noticia.contenido = jsonObject['contenido'];
        noticia.imagen = jsonObject['imagen'];
        noticia.fecha=jsonObject['fecha'];
    
       
        return noticia;
    }

}//end_class



