import { ApiResponseLegacy } from '@core/models/api-response-legacy';
import { GroupedEstab } from '@core/models/estab.model';
import { groupEstabUtil } from '@core/utils/group-estab.util';
import { fechaString, formatDate, formatDateToString } from '@core/utils/date.util';
import { roundNumber } from '@core/utils/round-number.utils';
import { DECIMALS } from '@core/constants/global.constants';
import { impuestoDetailAdapter } from '@shared/adapters/impuesto-detail.adapter';
import { NotaEntregaDetail } from '@sale/domain/models/nota-entrega.model';
import {
  NotaEntregaComprobanteEntity,
  NotaEntregaDetailEntity,
} from '@sale/data/nota-entrega/nota-entrega.entity';
import { generateUuidv4 } from '@core/utils/generate-uuidv4';

interface ToApiSaveParams {
  comprobante: any;
  details: NotaEntregaDetail[];
  cuotas: any[];
  infoAdicionalDoc: any[];
}

export class NotaEntregaMapper {
  static fromApiDataFilter(response: ApiResponseLegacy) {
    const resultData = {
      estabs: [] as GroupedEstab[],
      estadosDoc: [] as any[],
    };

    if (response.code === '1') {
      const [tempEstabs, estadosDoc] = JSON.parse(response.payload as string);

      const dataToGroup = {
        estabs: tempEstabs,
        isGroupPuntoEmision: true,
      };
      resultData.estabs = groupEstabUtil(dataToGroup);
      resultData.estadosDoc = estadosDoc;
    }

    return resultData;
  }

  static fromApiGetAll(response: ApiResponseLegacy) {
    const result = {
      data: [] as any[],
      totalRecords: 0,
    };
    if (response?.code === '1') {
      let [notasEntrega] = JSON.parse(response.payload as string);

      notasEntrega = notasEntrega || [];

      result.data = notasEntrega.map((item: any) => {
        return {
          idCuentaPorCobrar: item.idCuentaPorCobrar,
          idDocumento: item.idDocumento,
          codEstab: item.codEstab,
          fechaEmision: item.fechaEmision,
          fechaVencimiento: item.fechaVencimiento,
          serieComprobante: item.serieComprobante,
          razonSocialComprador: item.nombreFiscal,
          identificacionComprador: item.identificacionComprador,
          estadoNom: item.estadoFinanciero,
          total: item.total,
          abono: item.abono,
          saldo: item.saldo,
          usuario: item.usuario,
          tiempoCredito: item.tiempoCredito,
          codEstado: item.codEstado,
          convertToDoc: item.convertToDoc,
          totalRecords: item.totalRecords,
        };
      });
      result.totalRecords = result.data.length > 0 ? result.data[0].totalRecords : 0;
    }
    return result;
  }

  static fromApiDetalleCompleto(response: ApiResponseLegacy) {
    const result = {} as any;
    if (response.code === '1') {
      const mainData = JSON.parse(response.payload as string);
      const [tempHeader, tempCliente, tempDetalles, datosAdicionalesDoc, tiposIva] = mainData;
      const header = tempHeader[0] || {};
      const cliente = tempCliente[0] || {};

      const result = {
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
          observacion: header.observacion,
        },
        clienteData: {
          razonSocialComprador: cliente.razonSocialComprador,
          identificacionComprador: cliente.identificacionComprador,
          direccionComprador: cliente.direccionComprador,
          correo: cliente.correo,
        },
        detalles: tempDetalles.map((item: any) => {
          const precioConIva = item.precioUnitario + item.valorImpuesto;
          const total =
            roundNumber(item.precioTotalSinImpuesto, DECIMALS.GENERAL) +
            roundNumber(item.valorImpuesto, DECIMALS.GENERAL);
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
            total: roundNumber(total, DECIMALS.DOS),
          };
        }),
        datosAdicionalesDoc,
        tiposIva,
      };

      return result;
    }

    return result;
  }

  static toApiSave(input: ToApiSaveParams) {
    const comprobante = this.toApiComprobante(input.comprobante);

    const details = this.toApiDetail(input.details);
    const impuestos = impuestoDetailAdapter.to(input.details);
    const infoAdicionalDoc = input.infoAdicionalDoc.map((item) => {
      return {
        nombre: item.name,
        valor: item.value,
      };
    });

    return {
      notaEntrega: comprobante,
      detalles: details,
      impuestos: impuestos,
      infoAdicional: infoAdicionalDoc,
      infoAdicionalArticulo: [],
      cuotas: input.cuotas,
    };
  }

  static toApiComprobante(obj: any) {
    const result: NotaEntregaComprobanteEntity = {
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
      supportId: obj.supportId,
    };
    return result;
  }

  static toApiDetail(input: NotaEntregaDetail[]): NotaEntregaDetailEntity[] {
    const results = input.map((item, index) => {
      const cantidadTransaccion = item.quantity * (item.conversion || 1);
      const obj = {
        uuid: generateUuidv4(),
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
      };
      return obj;
    });
    return results;
  }
}
