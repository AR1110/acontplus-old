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
  name: string;
}

export interface CompanyCustomerSearch extends CompanyCustomer {
  name: string;
}

export interface SearchCompanyCustomerParams {
  textSearch: string;
}

export interface ListCompanyCustomer   {
  idCliente: number
  idTipoIdentificacion:  number
  identificacionComprador: string
  razonSocialComprador: string
  nombreComercial: string
  direccion: string
  telefono: string
  correo: string
  validationSri: boolean,
  codTipoIdentificacion: string,
  estado:boolean,
  esConsumidorFinal:boolean,
  nomValidationSri: string
  nomEstado: string
  totalRecords: number
}

export class ListCompanyCustomerResponse {
  data:ListCompanyCustomer[]=[]
  totalRecords =0;
}
