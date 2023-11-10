const mapperToAction = () => {
  const principalMapperTo = (support) => {
    const factura = {
      idCliente: support.customerId || 0,
      identificacionComprador: support.idCard || "",
      razonSocialComprador: support.businessName || "",
      direccionComprador: support.address || "",
      email: support.email || "",
      telefono: support.telephone || "",
      estab: support.estab || "",
      codEstab: support.codEstab || "",
      fechaEmision: newFormatDate(support.date) || new Date(),
      fechaVencimiento: newFormatDate(support.fechaVencimiento) || new Date(),
      idPuntoEmision: support.puntoEmisionId || 0,
      tipo: support.tipo || "",
      idTiempoCredito: support.idTiempoCredito || 0,
      idUsuario: support.userAssignedId || 0,
      irbpnr: support.irbpnr || 0,
      iva: support.iva || 0,
      observacion: support.obs || "",
      placa: support.placa || "",
      porcentajeDescuento: support.porcentajeDescuento || 0,
      propina: support.propina || 0,
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

  const detalleNotaEntrega = (data, fecheEmision) => {
    const tempDetails = [];
    let orderIndex = 1;

    for (const item of data) {
      let { cantidadStock, action } = getCantidadStock(item, fecheEmision);

      console.log(cantidadStock, action);

      if (action === 0) {
        if (item.idNotaEntregaDetalle > 0 && item.estado) {
          if (item.cantidad === item.cantidadOriginal) {
            cantidadStock = 0;
          } else {
            if (item.cantidad > item.cantidadOriginal) {
              cantidadStock = item.cantidadOriginal - item.cantidad;
            } else {
              cantidadStock = item.cantidadOriginal - item.cantidad;
            }
          }
        }
        if (item.idNotaEntregaDetalle > 0 && item.estado === 0) {
          cantidadStock = Math.abs(cantidadStock);
        }
      }

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
        cantidadStock: cantidadStock || 0,
        cantidadTransaccion: item.cantidad * item.conversion || 0,
        cantidadAnulada: item.cantidadAnulada || 0,
      });
    }
    return tempDetails;
  };

  const getCantidadStock = (item, fechaEmision) => {
    let fechaEmisionValidate = null;
    let cantidadStock = 0;
    let action = 0;

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
        action = 1;
        return {
          cantidadStock,
          action,
        };
      } else {
        action = 2;
      }
    }

    cantidadStock = item.cantidad * item.conversion;
    const resultCantStock = cantidadStock < 0 ? cantidadStock : -cantidadStock;

    return {
      cantidadStock: resultCantStock,
      action,
    };
  };

  const newFormatDate = (date: string) => {
    const splitDate = date.split("-");
    const newDate = `${splitDate[2]}-${splitDate[1]}-${splitDate[0]}`;
    return newDate;
  };

  return {
    principalMapperTo,
    detalleMapperTo,
    detalleNotaEntrega,
  };
};

export const MapperToAction = mapperToAction();
