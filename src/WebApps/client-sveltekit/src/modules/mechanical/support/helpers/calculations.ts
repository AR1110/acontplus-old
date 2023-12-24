import { ArticleService } from "$services/inventory/article-service";
import { sharedService as sS } from "$services/shared.service";
import { calculoTarifa as cT } from "./calculo-tarifa";
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
          tipo: 7,
          idArticulo: rowEntity.idArticulo,
          cantidad: rowEntity.cantidad,
          idBodega: rowEntity.idBodega,
          idMedida: rowEntity.idMedida,
        })
      );
      hideLoader();

      const { code, message } = response[0][0];
      if (code === "1") return (isCalculable = true);

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

        let bodegaSelect = bodegas.find((x) => x.idBodega == value);
        return bodegaSelect.bodega;
      }
      return "";
    }

    if (column == "idTipoIva") {
      let tipoIvas = [];

      if (row.tipoIvas != undefined && value != undefined) {
        tipoIvas = row.tipoIvas;

        return tipoIvas.find((x) => x.idTipoIva == value).descripcion;
      }
      return "_";
    }
  };

  const calculateTotal = async (cell) => {
    const row = cell.getRow().getData();
    const decimal = row.decimals[0];

    // Get values.
    const column = cell.getColumn()._column.field;
    const value = cell.getValue();
    const oldValue = cell.getOldValue();

    if (column == "cantidad") {
      const resp = await checkNotificationStock(cell, row, oldValue);

      if (!resp) return;
    }

    if (column == "idMedida") {
      const dataMedida = row.medidas.find((x) => x.idMedida == value);
      const articuloTarifas = dataMedida.tarifas;

      cell.getRow().update({
        tarifas: articuloTarifas,
        idTarifa: articuloTarifas[0].idTarifa,
        precioUnitario: sS.roundNumber(
          articuloTarifas[0].precioVenta,
          decimal.nroPrecio
        ),
        precioConIva: sS.roundNumber(
          articuloTarifas[0].precioConIva,
          decimal.nroPrecio
        ),
      });
    }

    if (column == "idTipoIva") {
      if (oldValue == value) return;

      try {
        const dataTipoIva = row.tipoIvas.find(
          (x) => x.idTipoIva === parseInt(row.idTipoIva)
        );
      } catch (error) {}
    }

    if (column == "idTarifa") {
      const newFee = row.tarifas.find((x) => x.idTarifa == value);
      const porcentaje = row.tipoIvas.find(
        (x) => x.idTipoIva == row.idTipoIva
      ).porcentaje;
      const precioConIva = cT.calcularPrecioConIva(
        newFee.precioVenta,
        porcentaje
      );

      cell.getRow().update({
        precioUnitario: sS.roundNumber(newFee.precioVenta, decimal.nroPrecio),
        precioConIva: sS.roundNumber(precioConIva, decimal.nroPrecio),
      });
    }

    if (column == "precioUnitario") {
      const porcentaje = row.tipoIvas.find(
        (x) => x.idTipoIva == row.idTipoIva
      ).porcentaje;
      const precioConIva = cT.calcularPrecioConIva(value, porcentaje);

      cell.getRow().update({
        precioUnitario: sS.roundNumber(value, decimal.nroPrecio),
        precioConIva: sS.roundNumber(precioConIva, decimal.nroPrecio),
      });
    }

    if (column == "precioConIva") {
      const porcentaje = row.tipoIvas.find(
        (x) => x.idTipoIva == row.idTipoIva
      ).porcentaje;
      const precioUnitario = cT.calcularPrecioUnitario(value, porcentaje);

      cell.getRow().update({
        precioUnitario: sS.roundNumber(precioUnitario, decimal.nroPrecio),
        precioConIva: sS.roundNumber(row.precioConIva, decimal.nroPrecio),
      });
    }

    // Calculations.
    const total = (row.precioUnitario - 0) * row.cantidad;

    cell.getRow().update({
      total: sS.roundNumber(total, decimal.nroTotalDetalle),
    });
  };

  return { calculateTotal, formatters };
};

export const Calculations = calculations();
