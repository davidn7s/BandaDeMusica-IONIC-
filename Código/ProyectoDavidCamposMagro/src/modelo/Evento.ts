export class Evento {

    id: any = null;  //el tipo es any para que valga para firebase (string) y json-server (number)
    title: string = "";
    startTime:Date=new Date();
    endTime:Date=new Date();
    allDay:boolean=false;


    constructor() {
    }

    public static createFromJsonObject(jsonObject: any): Evento {
        let evento: Evento = new Evento();
        evento.id = jsonObject['id'];
        evento.title = jsonObject['title'];
        evento.startTime=jsonObject['startTime'];
        evento.endTime=jsonObject['endTime']; 
        evento.allDay=jsonObject['allDay']
       
        return evento;
    }

    public static createDate(evento){
        evento.horaInicio=new Date(evento.horaInicio);
        evento.horaFinal= new Date(evento.horaFinal);
        return evento
    }

}//end_class



