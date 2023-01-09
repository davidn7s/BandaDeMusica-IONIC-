export class Musico {

    categoria: string = "";
    instrumento: string = "";
    gestor: boolean = false;
    

    constructor() {
    }

    public static createFromJsonObject(jsonObject: any): Musico {
        let musico: Musico = new Musico();
        musico.categoria = jsonObject['categoria'];
        musico.instrumento = jsonObject['instrumento'];
        musico.gestor = jsonObject['gestor'];
        
        return musico;
    }

}//end_class



