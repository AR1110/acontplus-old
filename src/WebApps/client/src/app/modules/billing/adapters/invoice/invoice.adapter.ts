
import { impuestoDetailAdapter } from "@shared/adapters/impuesto-detail.adapter";
import { InvoiceDetail } from "@modules/billing/models/invoice.model";
import { InvoiceComprobanteApi, InvoiceDetailApi } from "./invoice-api.model";
import { fechaString, formatDate, formatDateToString } from "@core/utils/date.util";
import { DECIMALS } from "@core/constants/global.constants";
import { roundNumber } from "@core/utils/round-number.utils";
type MainAdapt = {
  comprobante: any
  details: InvoiceDetail[],
  cuotas: any[],
  formaPago: any[]
  infoAdicionalDoc: any[]
}

export class InvoiceAdapter {

  static fromApiAll (response:any[]){

    return response.map(item=>{

      return {
        idCuentaPorCobrar: item.idCuentaPorCobrar,
        idDocumentoElectronico: item.idDocumentoElectronico,
        idDocumento: item.idDocumento,
        codEstab: item.codEstab,
        fechaEmision: item.fechaEmision,
        fechaVencimiento: item.fechaVencimiento,
        serieComprobante: item.serieComprobante,
        razonSocialComprador: item.nombreFiscal,
        identificacionComprador: item.identificacionComprador,
        estadoNombre: item.estadoFinanciero,
        total: item.total,
        abono: item.abono,
        saldo: item.saldo,
        estadoSri: item.estadoSri,
        usuarioNombre: item.usuario,
        tiempoCreditoNombre: item.tiempoCredito,
        codEstado: item.codEstado,
        totalRecords: item.totalRecords
    }
    })
  }


  static fromApiDetalleCompleto(response: any) {
    const [tempHeader, tempCliente, tempDetalles, datosAdicionalesDoc, tiposIva] = response;
    const header = tempHeader[0] || {};
    const cliente = tempCliente[0] || {};

    let result = {
      headerData: {
        estabNombre: header.nombreComercial,
        serieComprobante: header.serieComprobante,
        fechaEmision: fechaString(formatDate(header.fechaEmision)),
        fechaVencimiento: fechaString(formatDate(header.fechaVencimiento)),
        subTotalSinImpuestos: header.subTotalSinImpuestos,
        totalDescuento: header.totalDescuento,
        porcentajeDescuento: header.porcentajeDescuento,
        propina: header.propina,
        recargo: header.recargo,
        transporte: header.transporte,
        total: header.total,
        tiempoCreditoNombre: header.tiempoCredito,
        empleadoNombre: header.empleado,
        observacion: header.observacion
      },
      clienteData: {
        razonSocialComprador: cliente.razonSocialComprador,
        identificacionComprador: cliente.identificacionComprador,
        direccionComprador: cliente.direccionComprador,
        correo: cliente.correo
      },
      detalles: tempDetalles.map((item:any) => {
        let precioConIva =   item.precioUnitario + item.valorImpuesto;
         let total = roundNumber(item.precioTotalSinImpuesto, DECIMALS.GENERAL) +  roundNumber(item.valorImpuesto, DECIMALS.GENERAL)
        return {
        idNotaEntregaDetalle: item.idNotaEntregaDetalle,
        codigo: item.codigo,
        descripcion: item.descripcion,
        cantidad: item.cantidad,
        precioUnitario: item.precioUnitario,
        porcentajeDescuento: item.porcentajeDescuento,
        valorDescuento: item.valorDescuento,
        ice: item.ice,
        precioTotalSinImpuesto: item.precioTotalSinImpuesto,
        codigoPorcentaje: item.codigoPorcentaje,
        tarifaImpuesto: item.tarifa,
        valorImpuesto: item.valorImpuesto,
        nota: item.nota,
        bodegaNombre: item.bodega,
        medidaNombre: item.medida,
        tipoIvaNombre: item.tipoIva,
        pvpNombre: item.pvp,
        precioConIva: roundNumber(precioConIva, DECIMALS.DOS),
          total:  roundNumber(total, DECIMALS.DOS)
      }}),
      datosAdicionalesDoc,
      tiposIva
    };

    return result;
  }

  static mainAdapt(input: MainAdapt) {
    let comprobante = this.comprobanteAdapt(input.comprobante)

    const details = this.detailAdapt(input.details);
    const impuestos = impuestoDetailAdapter.to(input.details);
    let infoAdicionalDoc = input.infoAdicionalDoc.map(item=>{
      return{
        nombre : item.name,
        valor : item.value
      }
    })

    return {
      infoFactura: comprobante,
      detalles: details,
      impuestos: impuestos,
      infoAdicionalArticulo: [],
      formaPago: input.formaPago,
      cuotas: input.cuotas,
      infoAdicional: infoAdicionalDoc
    }

  }

  static comprobanteAdapt(obj: any) {
    const result: InvoiceComprobanteApi = {
      uniqueId: obj.uniqueId, //se envia cuando el documento proviene desde el modulo de aprobacion
      idCliente: obj.idCliente,
      idTiempoCredito: obj.idTiempoCredito,
      idPuntoEmision: obj.idPuntoEmision,
      idUsuario: obj.idUsuario,
      fechaEmision: formatDateToString(obj.fechaEmision),
      fechaVencimiento: formatDateToString(obj.fechaVencimiento),
      subTotalSinImpuestos: obj.subTotalSinImpuesto,
      totalDescuento: obj.totalDescuento || 0,
      porcentajeDescuento: obj.porcentajeDescuento || 0,
      //   irbpnr: obj.irbpnr || 0,
      propina: obj.propina || 0,
      recargo: obj.recargo || 0,
      transporte: obj.transporte || 0,
      total: obj.total,
      observacion: obj.observacion,
      //   placa: obj.placa,
      idTipoIdentificacion: obj.idTipoIdentificacion,
      identificacionComprador: obj.identificacionComprador,
      razonSocialComprador: obj.razonSocialComprador,
      direccionComprador: obj.direccionComprador,
      email: obj.email,
      telefono: obj.telefono,
      supportId: obj.supportId
    }
    return result;
  }

  static detailAdapt(input: InvoiceDetail[]): InvoiceDetailApi[] {
    let results = input.map((item, index) => {
      let cantidadTransaccion = item.quantity * (item.conversion || 1)
      let obj = {
        orderIndex: index + 1,
        idArticulo: item.productId,
        idTarifa: item.feeId,
        idBodega: item.bodegaId,
        idMedida: item.medidaId,
        idTipoIva: item.idTipoIva,
        ice: item.ice || 0,
        cantidad: item.quantity,
        precioCosto: item.cost,
        precioUnitario: item.price,
        valorDescuento: item.discount,
        precioTotalSinImpuesto: item.precioTotalSinImpuesto,
        codigoPorcentaje: item.codePercentage,
        tarifa: item.percentage || 0,
        porcentajeDescuento: item.percentageDiscount,
        valorImpuesto: item.taxValue,
        nota: item.obs || null,
        descripcion: item.descripcion,
        llevaInventario: item.llevaInventario,
        cantidadTransaccion,
        conversion: item.conversion,
        precioCostoFraccionado: item.costoFraccionado,
        precioSinSubsidio: item.precioSinSubsidio
      }
      return obj;
    })
    return results;
  }
}


