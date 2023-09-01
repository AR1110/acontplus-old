

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

export interface CustomerCreateDto {
    idTipoIdentificacion: number
    codigoSri: string
}




//Data Form 
export interface TipoContribuyente {
    idSubContribuyente: number
    descripcion: string
    codigo: string
}

export interface TipoIdentificacion {
    codigoSri: string 
    idTipoIdentificacion: string
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