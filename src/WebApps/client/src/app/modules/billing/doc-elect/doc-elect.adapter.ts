import { Injectable } from "@angular/core";


@Injectable({
  providedIn: 'root'
})
export class DocElectAdapter {

  fromApiFilter(){

  }

  fromApiList(results:any[]){
    return results.map(item=>{
      return {
        idDocumentoElectronico: item.idDocumentoElectronico,
        codDoc: item.codDoc,
        comprobante: item.comprobante,
        serieComprobante: item.serieComprobante,
        rucReceptor: item.rucReceptor,
        razonSocialReceptor: item.razonSocial,
        fechaEmision: item.fechaEmision,
        claveAcceso: item.claveAcceso,
        fechaAutorizacion: item.fechaAutorizacion,
        estado: item.estado,
        codEstado: item.codEstado,
        versionComp: item.versionComp,
        usuario: item.usuario,
        codEstab: item.codEstab,
        totalRecords: item.totalRecords
    }
    })
  }

}
