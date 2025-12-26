import { roundNumber } from '@core/utils/round-number.utils';
import { FacturaFisicaLista } from '@purchases/data/models/factura-fisica.interface';
import { fechaString } from '@core/utils/date.util';
import { groupEstabUtil } from '@core/utils/group-estab.util';

export class FacturaFisicaRepositoryMapper {
  static fromApiDataFilter(response: any) {
    const { ptoEmision: tempEstabs, estadoDocumento, subcategories } = response;

    const dataToGroup = {
      estabs: tempEstabs,
      isGroupPuntoEmision: true,
    };

    return {
      estabs: groupEstabUtil(dataToGroup),
      estadosDoc: estadoDocumento.map((item: any) => ({
        idEstado: item.idEstadoPago,
        descripcion: item.descripcion,
        codigo: item.codigo,
      })),

      subcategorias: subcategories,
    };
  }

  static fromApiGetAll(response: any[]): FacturaFisicaLista[] {
    return response.map((item) => {
      return {
        id: item.id,
        fechaEmision: item.fechaEmision,
        fechaVencimiento: item.fechaVencimiento,
        serieComprobante: item.serieComprobante,
        identificacionComprador: item.identificacionProveedor,
        nombreComprador: item.razonSocialProveedor,
        total: item.importeTotal,
        abono: item.abono,
        saldo: item.saldo,
        nombreEstado: item.estado,
        nombreUsuario: item.usuario,
        style: item.style,
        totalRecords: item.totalRecords,
      };
    });
  }

  static fromApiDetalleCompleto(response: any) {
    const { detalles, impuestos, infoAdicional, infoFactura, proveedor, tiempoCredito } = response;

    const {
      idFacturaCompra: id,
      subcategoryName: nombreCategoriaCompra,
      sustentoTributario: nombreSustentoTributario,
      nombreComercial: nombreEstab,
      nroDocumento: serieComprobante,
      nroAutorizacion: numeroAutorizacion,
      fechaEmision,
      subTotalSinImpuestos: totalSinImpuestos,
      totalDescuento,
      porcentajeDescuento,
      puntoEmision,
      ...rest
    } = infoFactura[0];

    const { nombreTiempoCredito, fechaVencimiento } = tiempoCredito[0];
    const {
      idProveedor,
      nombreFiscal: razonSocialComprador,
      numeroIdentificacion: identificacionComprador,
      correo: correoComprador,
      direccion: direccionComprador,
    } = proveedor[0];

    const result = {
      infoTributaria: {
        nombreEstab,
        serieComprobante,
        numeroAutorizacion,
        puntoEmision,
      },
      infoFactura: {
        id,
        idProveedor,
        razonSocialComprador,
        identificacionComprador,
        correoComprador,
        direccionComprador,
        nombreCategoriaCompra,
        nombreSustentoTributario,
        fechaEmision: fechaString(fechaEmision),
        fechaVencimiento,
        nombreTiempoCredito,
        totalSinImpuestos,
        totalDescuento,
        porcentajeDescuento,
        ...rest,
        pagos: [],
      },
      detalles: detalles.map((item: any, index: number) => {
        const total = item.precioTotalSinImpuesto + item.valorImpuesto;

        return {
          n: index + 1,
          idFacturaCompraDetalle: item.idFacturaCompraDetalle,
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
          nombreBodega: item.bodega,
          nombreTipoIva: item.tipoIva,
          nombreMedida: item.medida,
          total: roundNumber(total),
        };
      }),
      datosAdicionalesDoc: infoAdicional,
      tiposIva: impuestos,
    };

    return result;
  }

  static fromApiDataForm(response: any) {
    console.log(response);
    const {
      configDecimales,
      impuestos,
      tiempoCredito,
      bodegas,
      categoriasCompra,
      sustentosTributario,
      subcategories,
    } = response;

    const dataToGroup = {
      bodegas: bodegas,
      isGroupBodega: true,
    };

    const estabs = groupEstabUtil(dataToGroup);

    return {
      estabs,
      sustentosTributario,
    };
  }
}
