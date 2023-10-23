import { ArticleService } from "$lib/services/inventory/article-service";
import { sharedService } from "$services/shared.service";
import { calculoTarifa } from "./calculo-tarifa";
import { showLoader, hideLoader } from "$utils/loading-spinner";
import Swal from "sweetalert2";

const calculations = () => {
  // ------- Call to server for verify stock ----------
  const checkNotificationStock = async (cell, rowEntity, oldValue) => {
    let isCalculable = false;

    if (!rowEntity.llevaInventario) return isCalculable;
    showLoader();

    try {
      const response = await ArticleService.get(
        JSON.stringify({
          idArticulo: rowEntity.idArticulo,
          cantidad: rowEntity.cantidad,
          idBodega: rowEntity.idBodega,
          idMedida: rowEntity.idMedida,
        })
      );
      hideLoader();

      const { code, message } = response[0][0];
      if (code === "1") return isCalculable;

      const { isConfirmed } = await Swal.fire({
        title: `<small>Advertencia</small>`,
        icon: "warning",
        html: `<small>${message}</small>`,
        allowOutsideClick: false,
        allowEscapeKey: false,
      });

      if (isConfirmed) {
        if (code === "0") {
          cell.getRow().update({ cantidad: oldValue });
        }
        isCalculable = true;
      }
      return isCalculable;
    } catch (error) {
      console.log(error);
      return isCalculable;
    }
  };

  // ----------------- Calculations -----------------
  const formatters = (cell) => {
    const column = cell.getColumn()._column.field;
    const row = cell.getRow().getData();
    const value = cell.getValue();

    if (column == "idTarifa") {
      let tarifas = [];

      if (row.tarifas != undefined && value != undefined) {
        tarifas = row.tarifas;

        return tarifas.find((x) => x.idTarifa == value).tarifa;
      }
      return "_";
    }

    if (column == "idMedida") {
      let medidas = [];

      if (row.medidas != undefined && value != undefined) {
        medidas = row.medidas;

        return medidas.find((x) => x.idMedida == value).descripcion;
      }
      return "_";
    }

    if (column == "idBodega") {
      let bodegas = [];

      if (row.bodegas != undefined && value != undefined) {
        bodegas = row.bodegas;

        return bodegas.find((x) => x.idBodega == value).bodega;
      }
      return "_";
    }

    if (column == "idTipoIva") {
      let tipoIvas = [];

      if (row.tipoIvas != undefined && value != undefined) {
        tipoIvas = row.tipoIvas;

        return tipoIvas.find((x) => x.idTipoIva == value).descripcion;
      }
      return "_";
    }

    if (column == "cantidad") {
      console.log("Cantidad");
      console.log(value);
    }
  };

  const calculateTotal = async (cell) => {
    const row = cell.getRow().getData();
    const column = cell.getColumn()._column.field;
    const value = cell.getValue();
    const decimal = row.decimals[0];
    const oldValue = cell.getOldValue();

    if (column == "idMedida") {
      const dataMedida = row.medidas.find((x) => x.idMedida == value);
      const articuloTarifas = dataMedida.tarifas;

      cell.getRow().update({
        tarifas: articuloTarifas,
        idTarifa: articuloTarifas[0].idTarifa,
        precioVenta: sharedService.roundNumber(
          articuloTarifas[0].precioVenta,
          decimal.nroCantidad
        ),
        precioConIva: sharedService.roundNumber(
          articuloTarifas[0].precioConIva,
          decimal.nroCantidad
        ),
      });
    }

    if (column == "idTipoIva") {
      const dataTipoIva = row.tipoIvas.find(
        (x) => x.idTipoIva === parseInt(row.idTipoIva)
      );
      console.log(dataTipoIva);
    }

    if (column == "idTarifa") {
      const newFee = row.tarifas.find((x) => x.idTarifa == value);
      const porcentaje = row.tipoIvas.find(
        (x) => x.idTipoIva == row.idTipoIva
      ).porcentaje;

      const precioConIva = calculoTarifa.calcularPrecioConIva(
        newFee.precioVenta,
        porcentaje
      );

      cell.getRow().update({
        precioVenta: newFee.precioVenta,
        precioConIva: precioConIva,
      });
    }

    if (column == "cantidad") {
      // Call checkNotificationStock
      const resp = await checkNotificationStock(cell, row, oldValue);
      console.log(resp);

      if(resp) {

      }
    }

    if (column == "precioVenta") {
      const porcentaje = row.tipoIvas.find(
        (x) => x.idTipoIva == row.idTipoIva
      ).porcentaje;

      const precioConIva = calculoTarifa.calcularPrecioConIva(
        value,
        porcentaje
      );

      cell.getRow().update({
        precioConIva: precioConIva,
      });
    }

    if (column == "precioConIva") {
      const porcentaje = row.tipoIvas.find(
        (x) => x.idTipoIva == row.idTipoIva
      ).porcentaje;

      const precioVenta = calculoTarifa.calcularPrecioVenta(value, porcentaje);

      cell.getRow().update({
        precioVenta: precioVenta,
      });
    }
  };

  return { calculateTotal, formatters };
};

export const Calculations = calculations();
