import toast from "$utils/toast";

const calculations = () => {
  const calcularPrecioConIva = (precioVenta: number, porcentaje: number) => {
    try {
      const resultadoPorcentaje = Number(porcentaje) / 100;
      const result = Number(precioVenta) * Number(resultadoPorcentaje);
      const precioConIva = result + Number(precioVenta);
      return precioConIva;
    } catch (error) {
      toast({
        type: "error",
        message: "Se ha encontrado errores en Precio Venta",
      });
    }
  };

  const calcularPrecioVenta = (precioConIva, porcentaje) => {
    try {
      const resultadoPorcentaje = Number(porcentaje) / 100 + 1;
      const precioVenta = Number(precioConIva) / Number(resultadoPorcentaje);
      return precioVenta;
    } catch (error) {
      console.log(error);
    }
  };

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
  };

  // Todo: Calculate total
  const calculateTotal = (cell) => {
    let row = cell.getRow().getData();
    let column = cell.getColumn()._column.field;
    let value = cell.getValue();

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

      let precioConIva = calcularPrecioConIva(newFee.precioVenta, porcentaje);

      cell.getRow().update({
        precioVenta: newFee.precioVenta,
        precioConIva: precioConIva,
      });
    }

    if (column == "cantidad") {
    }

    if (column == "precioVenta") {
      let porcentaje = row.tipoIvas.find(
        (x) => x.idTipoIva == row.idTipoIva
      ).porcentaje;

      let precioConIva = calcularPrecioConIva(value, porcentaje);

      cell.getRow().update({
        precioConIva: precioConIva,
      });
    }

    if (column == "precioConIva") {
      let porcentaje = row.tipoIvas.find(
        (x) => x.idTipoIva == row.idTipoIva
      ).porcentaje;

      let precioVenta = calcularPrecioVenta(value, porcentaje);

      cell.getRow().update({
        precioVenta: precioVenta,
      });
    }
  };

  return { formatters, calculateTotal };
};

export const Calculations = calculations();
