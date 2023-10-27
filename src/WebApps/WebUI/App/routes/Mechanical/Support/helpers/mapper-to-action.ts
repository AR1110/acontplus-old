const mapperToAction = () => {
  const facturaMapperTo = (support) => {
    console.log(support);
    const factura = {
      idCliente: support.customerId || 0,
      idPuntoEmision: support.puntoEmisionId || 0,
      fechaEmision: support.date,
      fechaVencimiento: support.date,
      subTotalSinImpuestos: support.sumaTotalNeto || 0,
      subTotalIvaCero: support.subTotalIvaCero || 0,
      subTotalIva: support.subTotalIva || 0,
      subTotalNetoIva: support.subTotalNetoIva || 0,
      subTotalNetoIvaCero: support.subTotalNetoIvaCero || 0,
      subTotalNoObjetoIva:  support.subTotalNoObjetoIva || 0,
      subTotalNetoNoObjetoIva: support.subTotalNetoNoObjetoIva || 0,
      subTotalExentoIva: support.subTotalExentoIva || 0,
      subTotalNetoExentoIva: support.subTotalNetoExentoIva || 0,
      totalDescuento: support.totalDescuento || 0,
      porcentajeDescuento:  support.porcentajeDescuento || 0,
      totalIce: support.totalIce || 0,
      irbpnr: support.irbpnr || 0,
      propina: support.propina || 0,
      iva: support.iva || 0,
      recargo: support.recargo || 0,
      transporte: support.transporte || 0,
      total: support.total || 0,
      observacion: support.obs || "",
      placa: support.placa || "",
    };

    return factura;
  };

  const detalleMapperTo = (detalles) => {
    const tempDetails = [];
    let orderIndex = 1;

    for (const item of detalles) {
      tempDetails.push({
        orderIndex: orderIndex++,
        idFacturaDetalle: item.idFacturaDetalle || 0,
        idArticulo: item.idArticulo,
        idTarifa: item.idTarifa,
        idBodega: item.idBodega,
        idMedida: item.idMedida,
        idTipoIva: item.idTipoIva,
        tarifa: item.tarifa,
        codigoPorcentaje: item.codigoPorcentaje,
        ice: item.ice || 0,
        descripcion: item.descripcion,
        cantidad: item.cantidad,
        precioSinSubsidio: item.precioSinSubsidio || 0,
        precioCostoNeto: item.precioCosto || 0,
        precioUnitario: item.precioVenta,
        precioVenta: item.precioVenta,
        precioConIva: item.precioConIva || 0,
        valorDescuento: item.valorDescuento || 0,
        precioTotalSinImpuesto: item.precioTotalSinImpuesto || 0,
        porcentajeDescuento: item.porcentajeDescuento || 0,
        total: item.total,
        nota: item.nota || "",
      });
    }
    return tempDetails;
  };

  return { facturaMapperTo, detalleMapperTo };
};

export const MapperToAction = mapperToAction();
