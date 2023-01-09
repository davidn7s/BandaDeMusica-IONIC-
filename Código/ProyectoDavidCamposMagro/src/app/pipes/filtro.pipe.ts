import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filtro'
})
export class FiltroPipe implements PipeTransform {

  transform(array: any[], filtrador:string, columna:string): any {

    if(filtrador==='')
      return array;

    //Poner todo a minúsculas para que no importe como se ha escrito
    filtrador=filtrador.toLocaleLowerCase();  

    //Devolver array ya filtrado
    return array.filter(item=>{
      return item[columna].toLowerCase().includes(filtrador);
    });

   
  }//end transform

}//end class
