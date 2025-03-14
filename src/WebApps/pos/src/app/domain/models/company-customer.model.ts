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

export interface CompanyCustomerSearch   {
  customerId: number
  idCliente: number
  razonSocialComprador: string
  identificacionComprador:string
  nombreComercial: string
  name: string
  codigoSri: string
}

export type CompanyCustomerDefault = {
    customerCompanyId: number
    razonSocialComprador: string
    nombreComercial: string
    identificacionComprador: string
    name: string
}



export class CompanyCustomerDataForm  {
  tipoIdentificacion: any[]
  tipoContribuyentes: any[]
  tiempoCreditos: any[]
  ciudades: any[]
  tiposCliente: any[]
  empresas: any[]
  cargos: any[]
  formasPagoSri: any[]

  constructor() {
    this.tipoIdentificacion = []
    this.tipoContribuyentes = []
    this.tiempoCreditos = []
    this.ciudades = []
    this.tiposCliente = []
    this.empresas = []
    this.cargos = []
    this.formasPagoSri = []
  }
}
