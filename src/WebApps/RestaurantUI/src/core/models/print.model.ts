type CodDoc = 'FV' | 'NE'
export interface Print {
    idDocument: number
    idTipoDocumento: number
    codEstab: string
    codDoc: CodDoc
    nroIdentificacion: string
}