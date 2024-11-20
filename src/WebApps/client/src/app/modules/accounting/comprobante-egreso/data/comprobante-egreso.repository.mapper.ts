import {EntidadFinanciera} from "@accounting/interfaces/entidad-financiera.interface";
import {SubEntidadFinancieraSelectHtmlOnly} from "@accounting/interfaces/subentidad-financiera.interface";
import {BancoSelectOnly} from "@accounting/interfaces/banco.interface";
import {EstadoPago} from "@accounting/interfaces/estado-pago.interface";
import {groupCitiesByProvinceUtil} from "@shared/utils/group-cities-by-province.util";


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
    const {entidadFinanciera, subEntidadFinanciera, banco, estadoPago, ciudad
    } = response;

    let entidadesFinanciera = entidadFinanciera.map((item:any)=>{
      let obj: EntidadFinanciera =  {
        idEntidadFinanciera: item.idEntidadFinanciera,
        descripcion: item.descripcion,
        codigo: item.codigo,
      }
      return obj;
    })

    let subEntidadesFinanciera = subEntidadFinanciera.map((item:any)=>{

      let obj: SubEntidadFinancieraSelectHtmlOnly = {
        idSubEntidadFinanciera: item.idSubEntidadFinanciera,
        idEntidadFinanciera:item.idEntidadFinanciera,
        descripcion: item.descripcion,
        codigo: item.codigo,

        controlCaja: item.controlCaja,
      }
      return obj;
    })

    let bancos = banco.map((item:any)=>{
      let obj: BancoSelectOnly = {
        idBanco: item.idBanco,
        descripcion: item.descripcion,
        codigo: item.codigo,
      }
      return obj;
    })

    let estadosPago = estadoPago.map((item:any)=>{
      let obj: EstadoPago = {
        idEstadoPago: item.idEstadoPago,
        descripcion: item.descripcion,
        codigo: item.codigo
      }
      return obj;
    })

    let provinciaCiudades = groupCitiesByProvinceUtil(ciudad);

    return {
      entidadesFinanciera,
      subEntidadesFinanciera,
      bancos,
      estadosPago,
      provinciaCiudades
    }

  }


}
