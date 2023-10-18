const mapperToAction = () => {
  const facturaMapperTo = (support) => {
    let factura = {
      idCliente: support.customerId || 0,
      idPuntoEmision: support.puntoEmisionId || 0,
      fechaEmision: support.date,
      fechaVencimiento: support.date,
      subTotalSinImpuestos: 0,
      subTotalIvaCero: 0,
      subTotalIva: 0,
      subTotalNetoIva: 0,
      subTotalNetoIvaCero: 0,
      subTotalNoObjetoIva: 0,
      subTotalNetoNoObjetoIva: 0,
      subTotalExentoIva: 0,
      subTotalNetoExentoIva: 0,
      totalDescuento: 0.0,
      porcentajeDescuento: 0.0,
      totalIce: 0.0,
      irbpnr: 0.0,
      propina: 0.0,
      iva: 0,
      recargo: 0.0,
      transporte: 0.0,
      total: 0,
      observacion: "",
      placa: "",
    };

    return factura;
  };

  const detalleMapperTo = (detalles) => {
    let tempDetails = [];
    let orderIndex = 1;

    for (let item of detalles) {
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

export let MapperToAction = mapperToAction();
