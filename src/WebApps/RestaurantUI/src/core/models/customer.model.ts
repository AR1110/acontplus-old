
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
    readonly idCustomer: number;
    taxName: string
    tradeName: string;
    identificationNumber: string;
}