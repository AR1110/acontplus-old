import { sharedService } from "$services/shared.service";
import { calculoTarifa } from "./calculo-tarifa";

const calculations = () => {
  // ----------------- Calculations -----------------
  // Todo: Formatters

  const formatters = (cell) => {
    let column = cell.getColumn()._column.field;
    let row = cell.getRow().getData();
    let value = cell.getValue();

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

  // Todo: Calculate total
  const calculateTotal = (cell) => {
    let row = cell.getRow().getData();
    let column = cell.getColumn()._column.field;
    let value = cell.getValue();
    let decimal = row.decimals[0];

    if (column == "idMedida") {
      let newMeasure = row.medidas.find((x) => x.idMedida == value);

      cell.getRow().update({
        tarifas: newMeasure.tarifas,
        idTarifa: newMeasure.tarifas[0].idTarifa,
        precioVenta: newMeasure.tarifas[0].precioVenta,
        precioConIva: newMeasure.tarifas[0].precioConIva,
      });

      // Todo: Update precioVenta and precioConIva
    }

    if (column == "idTarifa") {
      let newFee = row.tarifas.find((x) => x.idTarifa == value);
      let porcentaje = row.tipoIvas.find(
        (x) => x.idTipoIva == row.idTipoIva
      ).porcentaje;

      let precioConIva = calculoTarifa.calcularPrecioConIva(
        newFee.precioVenta,
        porcentaje
      );

      cell.getRow().update({
        precioVenta: newFee.precioVenta,
        precioConIva: precioConIva,
      });
    }

    if (column == "cantidad") {
      let newCantidad = sharedService.roundNumber(
        parseFloat(value),
        decimal.nroCantidad
      );

      cell.getRow().update({ cantidad: newCantidad });
    }

    if (column == "precioVenta") {
      let porcentaje = row.tipoIvas.find(
        (x) => x.idTipoIva == row.idTipoIva
      ).porcentaje;

      let precioConIva = calculoTarifa.calcularPrecioConIva(value, porcentaje);

      cell.getRow().update({
        precioConIva: precioConIva,
      });
    }

    if (column == "precioConIva") {
      let porcentaje = row.tipoIvas.find(
        (x) => x.idTipoIva == row.idTipoIva
      ).porcentaje;

      let precioVenta = calculoTarifa.calcularPrecioVenta(value, porcentaje);

      cell.getRow().update({
        precioVenta: precioVenta,
      });
    }
  };

  return { calculateTotal, formatters };
};

export const Calculations = calculations();
