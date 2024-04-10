import { TarifaProductSearch } from "../shared/models/tarifa.model";

export interface Product {
  descripcion: string;
}

export interface ProductSearch {
  idArticulo: number,
  codigo: string,
  descripcion: string
  iva: string,
  stock: number,
  subFamilia: string,
  marca: string,
  medida: string
  fraccionado: boolean
  style: string
  tarifas: Array<TarifaProductSearch>,
  warehouses: unknown,
  precioSinSubsidio: number,
  s3ObjectUrl: string
  s3ObjectKey: string
  totalRecords: number
}


