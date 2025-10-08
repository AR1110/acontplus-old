export interface LotPriceTarifa {
  idArticuloFraccionadoPvP: number;
  idArticuloFraccionado: number;
  idArticuloPvp: number;
  idArticulo: number;
  idTarifa: number;
  precioVenta: number;
  precioConIva: number;
  porcentajeUtilidad: number;
  tarifaDesc: string;
  utilidad: number;
}

export interface LotPrice {
  index?: number;
  idArticulo: number;
  idArticuloFraccionado: number;
  idTipoIva: number;
  codigo: string;
  codigoAuxiliar: string;
  codigoBarra: string;
  descripcion: string;
  stock: number;
  precioCosto: number;
  estado: boolean;
  iva: string;
  _children: LotPriceTarifa[];
}
