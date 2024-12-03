import { EntidadFinanciera } from "@accounting/interfaces/entidad-financiera.interface";
import { SubEntidadFinancieraSelectHtmlOnly } from "@accounting/interfaces/subentidad-financiera.interface";
import { BancoSelectOnly } from "@accounting/interfaces/banco.interface";
import { EstadoPago } from "@accounting/interfaces/estado-pago.interface";
import { groupCitiesByProvinceUtil } from "@shared/utils/group-cities-by-province.util";
import { CuotaPorPagarLista } from "@modules/accounting/interfaces/cuota-por-pagar.interface";


export class ComprobanteEgresoRepositoryMapper {

  static fromApiCuotasByICuentaPorPagar(response: any): CuotaPorPagarLista[] {
    const { cuotas } = response;
    return cuotas.map((item: any) => {
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
        saldoInicial: item.saldo
      }
    })


  }



  static fromApiDataForm(response: any) {
    const { entidadFinanciera, subEntidadFinanciera, banco, estadoPago, ciudad, documentos = []

    } = response;

    let entidadesFinanciera = entidadFinanciera.map((item: any) => {
      let obj: EntidadFinanciera = {
        idEntidadFinanciera: item.idEntidadFinanciera,
        descripcion: item.descripcion,
        codigo: item.codigo,
      }
      return obj;
    })

    let subEntidadesFinanciera = subEntidadFinanciera.map((item: any) => {

      let obj: SubEntidadFinancieraSelectHtmlOnly = {
        idSubEntidadFinanciera: item.idSubEntidadFinanciera,
        idEntidadFinanciera: item.idEntidadFinanciera,
        descripcion: item.descripcion,
        codigo: item.codigo,

        controlCaja: item.controlCaja,
      }
      return obj;
    })

    let bancos = banco.map((item: any) => {
      let obj: BancoSelectOnly = {
        idBanco: item.idBanco,
        descripcion: item.descripcion,
        codigo: item.codigo,
      }
      return obj;
    })

    let estadosPago = estadoPago.map((item: any) => {
      let obj: EstadoPago = {
        idEstadoPago: item.idEstadoPago,
        descripcion: item.descripcion,
        codigo: item.codigo
      }
      return obj;
    })

    let provinciaCiudades = groupCitiesByProvinceUtil(ciudad);

    let documentosTemp = documentos.map((item: any) => {
      return {
        idCuentaPorPagar: item.idComprobante,
        idTipoDocumento: item.idTipoDocumento,
        nroDoc: item.nroDocumento,
        nombreDoc: item.tipoDocumento,
        saldo: item.saldo,
        numAutDocSustento: item.numAutDocSustento,
      }
    })

    return {
      entidadesFinanciera,
      subEntidadesFinanciera,
      bancos,
      estadosPago,
      provinciaCiudades,
      documentos: documentosTemp
    }

  }


  static toApiPost(params: any) {
    const { formasPago, pagosDetalle, cuentasPorPagarHistorial } = params;

    const comprobante = {
      idProveedor: 0,
      total: 0,
      codEstab: 0,
      observacion: ''
    }

    const pagos = formasPago.map((item: any) => {


      return {
        idSubEntidadFinanciera: 0,
        idEntidadFinanciera: 0,
        idBanco: 0,
        idCuentaBancaria: 0,
        idCuentaPorPagar: 0,
        fechaEmision: 0,
        nro: 0,
        valor: 0,
        posfechado: 0,
        cobro: 0,
        secuencial: 0,
        lote: 0,
        aprobacion: 0,
        referencia: 0,
        abono: 0,
        controlCaja: 0
      }

    })

    const pagosDetalleMapper = pagosDetalle.map((item: any) => {
      return {
        idCuotaPorPagar: item.idCuotaPorPagar,
        saldo: item.saldo,
        abono: item.abono,
        secuencial: item.secuencial
      }
    })


    const cuentasPorPagarHistorialMapper = cuentasPorPagarHistorial.map((item: any) => {
      return {
        idCuentaPorPagar: item.idCuentaPorPagar,
        saldo: item.saldo,
        abono: item.abono,
        secuencial: item.secuencial
      }
    })

    const cuentasPorPagarDeterminarEstado = [].map(item => {


      return {
        idCuentaPorPagar: 0,
        idEstadoPago: 0,
        abono: 0,
      }

    })

    const cuotasPorPagarDeterminarEstado = [].map(item => {


      return {
        idCuotaPorPagar: 0,
        idEstadoPago: 0,
        abono: 0,
      }

    })


    return {
      comprobante,
      pagos,
      pagoDetalle: pagosDetalleMapper,
      historial: cuentasPorPagarHistorialMapper,
      cuenta: cuentasPorPagarDeterminarEstado,
      cuota: cuotasPorPagarDeterminarEstado
    }


  }

}
