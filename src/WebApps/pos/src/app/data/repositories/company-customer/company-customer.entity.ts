import {getValidId, isValidField} from "@domain/utils/utils";

export interface CompanyCustomerEntitytDataForm  {
  tipoIdentificacion: any[],
  tipoContribuyentes: any[],
  tiempoCreditos: any[],
  ciudades: any[],
  tiposCliente: any[],
  empresas: any[],
  cargos: any[],
  formasPagoSri: any[],
}


export interface CompanyCustomerEntitytGetAll  {
   idCliente: number
   idTipoIdentificacion: number
   numeroIdentificacion: string
  nombreComercial: string
   nombreFiscal: string
  direccion: string
 telefono: string
  correo: string
  consumidorFinal: boolean
  validationSri: boolean
  estado: boolean
  totalRecords: number
}

export interface CompanyCustomerEntitytGetId {
  idCliente: number
  idTipoClienteProveedor: number
 idTipoEntidad: number
   idSubContribuyente: number
  idTiempoCredito: number
  idTipoIdentificacion:  number
  idCiudad: number
  numeroIdentificacion: string
   nombreFiscal: string
  montoCredito: number
   nombreComercial: string
   direccion: string
  estado: boolean
   idEmpleado: number
  empleado: string
   idEmpresa: number
   idCargo: number
   validationSri: boolean
   idFormaPagoSri: number
   codigoSri: string
  correo: string
  telefono: string
  placa: string
}

export interface CompanyCustomerEntityPost {
  idCliente: number | null
  idEmpleado: number|null
  idTipoIdentificacion: number
  idTipoClienteProveedor: number| null
  idTipoEntidad: number | null
  idCiudad:number|null
  idSubContribuyente: number|null
  idTiempoCredito: number
  idEmpresa: number|null
  idCargo: number|null
  numeroIdentificacion:string
  nombreFiscal: string
  nombreComercial:string
  direccion: string|null
  telefono: string|null
  correo: string|null
  placa: string|null
  montoCredito: string|null
  nota: string|null
  validationSri: boolean
  idFormaPagoSri: number|null
  estado: boolean
}


export interface CompanyCustomerEntitySearch {
   customerId: number
   idCliente: number
  nombreFiscal: string
   numeroIdentificacion: string
   nombreComercial: string
   codigoSri: string
}
