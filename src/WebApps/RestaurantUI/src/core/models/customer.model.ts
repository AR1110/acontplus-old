import { SRI_IDENTIFITION_CODE } from "../constants"



export interface CustomerRucSRI  {
    numeroRuc: string,
    razonSocial: string
    nombreComercial: string
    direccion?: string
    email?: string
    telefono?: string
    error?: string
}

export interface CustomerCedulaSRI  {
    identificacion: string
    nombreCompleto: string
    direccion?: string
    email?: string
    telefono?: string
    error?: string
}

export interface RawCustomerData  {    
    readonly idCliente: number,
    nombreFiscal: string,
    nombreComercial: string,
    numeroIdentificacion: string,
    direccion: string,
    correo: string,
    idTiempoCredito: number,
    diasCredito: number,
    nombreCompleto: string,
    placa: string,
    validationSri?: string,
    tipoIdentificacion?: string,
    rucEmpresa: string
    companyId: number,
    customerId: number,
    idSubContribuyente: number
    idTipoIdentificacion: number
    
}


export interface CustomerReadDto {
    readonly customerCompanyId: number;
    fiscalName: string
    tradeName: string
    identificationNumber: string
    //Editar
    idTipoIdentificacion?: number
    idTiempoCredito?: number
    idSubContribuyente?: number

}

type CodigoIdentificacionSRI = SRI_IDENTIFITION_CODE.RUC | SRI_IDENTIFITION_CODE.LICENSE | SRI_IDENTIFITION_CODE.PASSPORT;

export interface CustomerCreateDto {
    idCliente: number
    idTipoIdentificacion: number
    idTiempoCredito: number
    idSubContribuyente: number
    numeroIdentificacion: string
    nombreFiscal: string
    nombreComercial: string
    codigoSri: CodigoIdentificacionSRI
    direccion?: string,
    emails?: string,
    telefonos?: string
    correo?: string
    telefono?: string
    placa?: string
}


//Data Form 
export interface TipoContribuyente {
    idSubContribuyente: number
    descripcion: string
    codigo: string
}

/**
 * 04 RUC
 * 05 CEDULA
 * 06 PASAPORTE
 */
export interface TipoIdentificacion {
    codigoSri:  CodigoIdentificacionSRI
    idTipoIdentificacion: number
    descripcion: string
}
export interface TiempoCredito {
    idTiempoCredito: number,
    descripcion: string,
    // diasCredito: 0,
    // numeroCuota: 1,
    // entrada: false,
    // tipo: true
}

export interface CustomerDataForm {
    tipoIdentificacion: Array<TipoIdentificacion>
    tipoContribuyentes: Array<TipoContribuyente>
    tiempoCreditos: Array<TiempoCredito>
}