export interface Supplier {
  idProveedor: number;
  numeroIdentificacion: string;
  razonSocial: string;
  nombreComercial?: string;
  tipoIdentificacion: string;
  direccion?: string;
  telefono?: string;
  correo?: string;
  estado?: boolean;
}

export interface SupplierSearch
  extends Omit<Supplier, 'numeroIdentificacion' | 'tipoIdentificacion' | 'razonSocial'> {
  identificacionComprador: string;
  razonSocialComprador: string;
  name: string;
  codigoTipoIdentificacion: string;
}
