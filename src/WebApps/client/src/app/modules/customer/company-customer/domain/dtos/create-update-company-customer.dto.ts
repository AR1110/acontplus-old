export interface CreateUpdateCompanyCustomerDto {
  idCliente?: number | null;
  idEmpleado?: number | null;
  idTipoIdentificacion: number;
  idTipoClienteProveedor?: number;
  idTipoEntidad?: number;
  idCiudad?: number;
  idSubContribuyente?: number;
  idTiempoCredito?: number;
  idEmpresa?: number;
  idCargo?: number;
  numeroIdentificacion: string;
  nombreFiscal: string;
  nombreComercial?: string;
  direccion?: string;
  telefono?: string;
  correo?: string;
  placa?: string;
  montoCredito?: number | null;
  nota?: string;
  validationSri?: boolean;
  idFormaPagoSri?: number;
  estado?: boolean;
  dataInfoCred?: any;
  configValorBruto?: boolean | null;
}
