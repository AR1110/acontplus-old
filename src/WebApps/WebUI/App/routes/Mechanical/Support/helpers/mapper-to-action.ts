const mapperToAction = () => {
  const principalMapperTo = (support) => {
    const factura = {
      direccionComprador: support.direccionComprador || "",
      email: support.email || "",
      fechaEmision: support.date,
      fechaVencimiento: support.fechaVencimiento || new Date(),
      idCliente: support.customerId || 0,
      identificacionComprador: support.identificacionComprador || "",
      idPuntoEmision: support.puntoEmisionId || 0,
      idTiempoCredito: support.idTiempoCredito || 0,
      idUsuario: support.userAssignedId || 0,
      irbpnr: support.irbpnr || 0,
      iva: support.iva || 0,
      observacion: support.obs || "",
      placa: support.placa || "",
      porcentajeDescuento: support.porcentajeDescuento || 0,
      propina: support.propina || 0,
      razonSocialComprador: support.razonSocialComprador || "",
      recargo: support.recargo || 0,
      subTotalExentoIva: support.subTotalExentoIva || 0,
      subTotalIva: support.subTotalIva || 0,
      subTotalIvaCero: support.subTotalIvaCero || 0,
      subTotalNetoExentoIva: support.subTotalNetoExentoIva || 0,
      subTotalNetoIva: support.subTotalNetoIva || 0,
      subTotalNetoIvaCero: support.subTotalNetoIvaCero || 0,
      subTotalNetoNoObjetoIva: support.subTotalNetoNoObjetoIva || 0,
      subTotalNoObjetoIva: support.subTotalNoObjetoIva || 0,
      subTotalSinImpuestos: support.sumaTotalNeto || 0,
      tarifa: support.tarifa || "",
      telefono: support.telefono || "",
      total: support.total || 0,
      totalDescuento: support.totalDescuento || 0,
      totalIce: support.totalIce || 0,
      transporte: support.transporte || 0,
      supportId: support.id || 0,
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

  const notaEntregaMapper = (data) => {
    const notaEntrega = {
      idCliente: data.customerId || 0,
      identificacionComprador: data.idCard,
      razonSocialComprador: data.businessName || "",
      direccionComprador: data.address,
      email: data.email || "",
      telefono: data.telephone || "",
      estab: data.estab,
      codEstab: data.codEstab,
      fechaEmision: newFormatDate(data.date) || new Date(),
      fechaVencimiento: newFormatDate(data.fechaVencimiento) || new Date(),
      idPuntoEmision: data.puntoEmisionId || 0,
      tipo: data.tipo || "",
      idTiempoCredito: data.idTiempoCredito || 0,
      idUsuario: data.userAssignedId || 0,
      irbpnr: data.irbpnr || 0,
      iva: data.iva || 0,
      porcentajeDescuento: data.porcentajeDescuento || 0,
      propina: data.propina || 0,
      recargo: data.recargo || 0,
      subTotalExentoIva: data.subTotalExentoIva || 0,
      subTotalIva: data.subTotalIva || 0,
      subTotalIvaCero: data.subTotalIvaCero || 0,
      subTotalNetoExentoIva: data.subTotalNetoExentoIva || 0,
      subTotalNetoIva: data.subTotalNetoIva || 0,
      subTotalNetoIvaCero: data.subTotalNetoIvaCero || 0,
      subTotalNetoNoObjetoIva: data.subTotalNetoNoObjetoIva || 0,
      subTotalNoObjetoIva: data.subTotalNoObjetoIva || 0,
      subTotalSinImpuestos: data.sumaTotalNeto || 0,
      tarifa: data.tarifa,
      total: data.total || 0,
      totalDescuento: data.totalDescuento || 0,
      totalIce: data.totalIce || 0,
      transporte: data.transporte || 0,
    };
    return notaEntrega;
  };

  const detalleNotaEntrega = (data, fecheEmision) => {
    const tempDetails = [];
    let orderIndex = 1;

    for (const item of data) {
      tempDetails.push({
        orderIndex: orderIndex++,
        idNotaEntregaDetalle: item.idNotaEntregaDetalle || 0,
        idFacturaDetalle: item.idFacturaDetalle || 0,
        idArticulo: item.idArticulo || 0,
        idTarifa: item.idTarifa,
        idBodega: item.idBodega,
        idMedida: item.idMedida,
        idPresentacion: 0,
        idTipoIva: item.idTipoIva,
        tarifa: item.tarifa,
        codigoPorcentaje: item.codigoPorcentaje,
        ice: item.ice || 0,
        descripcion: item.descripcion,
        cantidad: item.cantidad * -1,
        precioUnitario: item.precioUnitario || 0,
        precioVenta: item.precioVenta || 0,
        precioCosto: item.precioCosto || 0,
        precioConIva: item.precioConIva || 0,
        valorDescuento: item.valorDescuento || 0,
        precioTotalSinImpuesto: item.precioTotalSinImpuesto || 0,
        porcentajeDescuento: item.porcentajeDescuento || 0,
        total: item.total || 0,
        nota: "S/N",
        llevaInventario: item.llevaInventario || false,
        cantidadStock: getCantidadStock(item, fecheEmision) || 0,
        cantidadTransaccion: item.cantidad * item.conversion || 0,
      });
    }
    return tempDetails;
  };

  const getCantidadStock = (item, fechaEmision) => {
    let fechaEmisionValidate = null;
    let cantidadStock = 0;

    if (fechaEmision) {
      fechaEmisionValidate = fechaEmision;
    }
    if (!fechaEmisionValidate) {
      console.warn(
        "Para validacion del cantidad stock la fecha emision del comprobante es nula"
      );
    }

    const dataConsolidacionFecha = item.fechaConsolidaciones.find(
      (cdataFecha) => cdataFecha.idBodega === item.idBodega
    );

    if (dataConsolidacionFecha) {
      if (dataConsolidacionFecha.fechaConsolidacion >= fechaEmisionValidate) {
        cantidadStock = 0;
        return cantidadStock;
      }
    }

    cantidadStock = item.cantidad * item.conversion;
    const resultCantStock = cantidadStock < 0 ? cantidadStock : -cantidadStock;

    return resultCantStock;
  };

  const newFormatDate = (date: string) => {
    const splitDate = date.split("-");
    const newDate = `${splitDate[2]}-${splitDate[1]}-${splitDate[0]}`;
    console.log(`NewDate ${newDate}`);

    return newDate;
  };

  return {
    principalMapperTo,
    detalleMapperTo,
    notaEntregaMapper,
    detalleNotaEntrega,
  };
};

export const MapperToAction = mapperToAction();
