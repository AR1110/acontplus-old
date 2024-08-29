export interface CompanyCustomer {
  idCliente: number
  idTipoIdentificacion: number
  numeroIdentificacion:string
  nombreComercial: string
  razonSocial:string
  direccion: string
  telefono: string
  correo: string
  consumidorFinal: false,
  validationSri: boolean
  estado: boolean
}

export  interface CompanyCustomerRead extends CompanyCustomer {
  totalRecords: number
}

export interface CompanyCustomerSearch extends CompanyCustomer {
  razonSocialComprador: string
  identificacionComprador:string,
  name: string
}

export type CompanyCustomerDefault = {
    customerCompanyId: number
    razonSocialComprador: string
    nombreComercial: string
    identificacionComprador: string
    name: string
}
