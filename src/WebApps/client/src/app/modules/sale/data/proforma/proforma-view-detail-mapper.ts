import { ProformaInvoiceDetail, ProformaInvoiceListResult } from '@sale/domain/models/proforma';
import { ApiResponseLegacy } from '@core/models/api-response-legacy';

export class ProformaViewDetailMapper {
  static toJson(id: number) {
    return JSON.stringify({
      tipo: 4,
      id,
    });
  }

  static fromJson(response: ApiResponseLegacy) {
    const { header, customer, details, taxes, additionalsInfo } = JSON.parse(
      response.payload as string,
    );
    console.log(header, customer, details, taxes);
    const headerData = header[0];
    const customerData = customer[0];
    const proformaDetail: ProformaInvoiceDetail = {
      header: {
        estabName: headerData.nombreComercial,
        serieComprobante: headerData.serieComprobante,
        issueDate: headerData.fechaEmision,
        subTotalWithoutTaxes: headerData.subTotalSinImpuestos,
        //   totalWithoutTaxes: headerData.totalSinImpuestos,
        //  totalTaxes: headerData.totalImpuestos,
        total: headerData.total,
        discountPercentage: headerData.descuento,
        totalDiscount: headerData.totalDescuento,

        tip: headerData.propina,
        surcharge: headerData.recargo,
        transport: headerData.transporte,

        observation: headerData.observacion,
      },
      customer: {
        businessName: customerData.razonSocialComprador,
        IDCard: customerData.identificacionComprador,
        address: customerData.direccionComprador,
        email: customerData.correo,
      },
      details: details.map((d: any, index: number) => ({
        index: index + 1,
        detailId: d.idProformaDetalle,
        code: d.codigo,
        description: d.descripcion,
        quantity: d.cantidad,
        unitMeasure: d.medida,
        taxType: d.tipoIva,
        priceLevel: d.pvp,
        unitPrice: d.precioUnitario,
        totalWithoutTax: d.precioTotalSinImpuesto,
        note: d.nota,
        warehouse: d.bodega,
        taxValue: d.valorImpuesto,
        discountValue: d.valorDescuento,
        discountPercentage: d.porcentajeDescuento,
        ice: d.ice,
        taxCode: d.codigoPorcentaje,
        rate: d.tarifa,
      })),
      taxes: taxes.map((t: any) => ({
        taxTypeId: t.idTipoIva,
        taxId: t.idImpuesto,
        description: t.descripcion,
        rate: t.tarifa,
        taxCode: t.codigoPorcentaje,
      })),
      additionalsInfo,
    };
    return proformaDetail;
  }
}
