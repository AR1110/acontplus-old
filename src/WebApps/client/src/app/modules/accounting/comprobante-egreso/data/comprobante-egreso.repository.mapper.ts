import {EntidadFinanciera, EntidadFinancieraPago} from "@accounting/interfaces/entidad-financiera.interface";


export class ComprobanteEgresoRepositoryMapper{

  static fromApiCuotasByICuentaPorPagar(response: any){
    const {cuotas} = response;
    return cuotas.map((item:any)=>{
      return {
        idCuentaPorPagar: item.idCuentaPorPagar,
        idCuotaPorPagar: item.idCuotaPorPagar,
        fechaVencimiento: item.fechaVencimiento,
        nroCuota: item.nroCuota,
        cuota: item.cuota,
        abono: item.abono,
        saldo: item.saldo,
        nombreEstado: item.descripcion,
        codigoEstado: item.codigo,
      }
    })


  }



  static fromApiDataForm(response:any){
    const {entidadFinanciera} = response;


    let entidadesFinanciera = entidadFinanciera.map((item:any)=>{

      let obj: EntidadFinanciera =  {
        idEntidadFinanciera: item.idEntidadFinanciera,
        descripcion: item.descripcion,
        codigo: item.codigo,
      }
      return obj;
    })

    return {
      entidadesFinanciera,
    }

  }


}
