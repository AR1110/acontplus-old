
export interface CompanyCustomerPayloadDto {
  idCliente: number |null|undefined;
  idEmpleado: number |null|undefined;
  idTipoIdentificacion: number;
  idTipoClienteProveedor:  number |null|undefined;
  idTipoEntidad:  number |null|undefined;
  idCiudad:  number |null|undefined;
  idSubContribuyente:  number |null|undefined;
  idTiempoCredito:  number |null|undefined;
  idEmpresa:  number |null|undefined;
  idCargo:  number |null|undefined;
  numeroIdentificacion: string;
  nombreFiscal: string;
  nombreComercial?: string;
  direccion?: string|null;
  telefono?: string|null;
  correo?: string|null;
  placa?: string|null;
  montoCredito?: number | null;
  nota?: string|null;
  validationSri?: boolean;
  idFormaPagoSri?: number | null;
  estado: boolean;
  infoCrediticia: string | null;
  configValorBruto: boolean | null;
  birthDate?: string |null
}
