export interface ProductList {
  position: number;
  idArticulo: number;
  idMedida: number;
  code_unique: string;
  codigo: string;
  descripcion: string;
  precioCosto: number;
  estado: boolean;
  stock: number;
  observaciones: string;
  subFamilia: string;
  medida: string;
  marca: string;
  modelo: string;
  tipoIva: string;
  tipoArticulo: string;
  style: string;
  precioSinSubsidio: number;
  stockMinimo: number;
  totalRecords: number;
  s3ObjectKey: string;
  s3ObjectUrl: string;
}
