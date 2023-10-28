import toast from "$utils/toast";

class CalculoTarifa {
  calcularPrecioConIva = (precioVenta: number, porcentaje: number) => {
    try {
      const resultadoPorcentaje = Number(porcentaje) / 100;
      const result = Number(precioVenta) * Number(resultadoPorcentaje);
      const precioConIva = result + Number(precioVenta);
      return precioConIva;
    } catch (error) {
      toast({
        type: "error",
        message: "Se ha encontrado errores en Precio Venta con IVA",
      });
    }
  };

  calcularPrecioUnitario = (precioConIva, porcentaje) => {
    try {
      const resultadoPorcentaje = Number(porcentaje) / 100 + 1;
      const precioVenta = Number(precioConIva) / Number(resultadoPorcentaje);
      return precioVenta;
    } catch (error) {
      toast({
        type: "error",
        message: "Se ha encontrado errores en Precio Venta",
      });
    }
  };
}

export const calculoTarifa = new CalculoTarifa();
