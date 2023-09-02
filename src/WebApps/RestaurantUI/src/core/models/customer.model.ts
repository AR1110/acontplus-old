


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
    customerId: number
    
}


export interface CustomerReadDto {
    readonly customerId: number;
    taxName: string
    tradeName: string;
    identificationNumber: string;
}

type CodigoIdentificacionSRI = "04"| "05" | '06' ;

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