export interface CompanyCustomer {
  id: number;
  idCliente: number;
  nombreFiscal: string;
  nombreComercial?: string;
  telefono?: string;
  direccion?: string;
  correo?: string;
  numeroIdentificacion: string;
  idTipoIdentificacion?: number;
  idTiempoCredito?: number;
  diasCredito?: number;
  nombreCompleto?: string;
  placa?: string;
  validationSri?: boolean;
  tipoIdentificacion?: string;
  codigoSri?: string;
  rucEmpresa?: string;
  companyId?: number;
  customerId: number;
  estado?: boolean;
}

export interface CompanyCustomerSearch extends CompanyCustomer {}
