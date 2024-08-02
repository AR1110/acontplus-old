export interface Tarifa {
  idTarifa: number
  descripcion: string
  predeterminada: boolean
}
export interface TarifaProductSearch {
  tarifa: string
  precioVenta: number
  precio: number
}

export interface TarifaProducto {
  idTarifa: number;
  precioVenta: number;
  precioConIva: number;
  descripcion: string;
  defaultTarifa: boolean;
}


export interface TarifaSelectHtmlOnly extends Pick<Tarifa, 'idTarifa' | 'descripcion' | 'predeterminada'> { }


