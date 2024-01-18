export interface CompanyCustomer {
  idCliente: number
  nombreFiscal: string
  nombreComercial: string
  telefono: string
  direccion: string
  correo: string
}

export interface CompanyCustomerSearch extends CompanyCustomer { }
