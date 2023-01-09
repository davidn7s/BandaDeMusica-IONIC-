import { Musico } from "./Musico";

export class Usuario {

    id: any = null;  //el tipo es any para que valga para firebase (string) y json-server (number)
    nombre: string = "";
    apellidos: string = "";
    email: string = "";
    musico: Musico=undefined;
    

    constructor() {
    }

    public static createFromJsonObject(jsonObject: any): Usuario {
        let usuario: Usuario = new Usuario();
        usuario.id = jsonObject['id'];
        usuario.nombre = jsonObject['nombre'];
        usuario.apellidos = jsonObject['apellidos'];
        usuario.email = jsonObject['email'];
        if(jsonObject['musico']){
            let musico:Musico=Musico.createFromJsonObject(jsonObject['musico'])
            usuario.musico= new Musico();
            usuario.musico=musico;
        }
        return usuario;
    }

}//end_class



