
export type Measure = {
    idMedida: number,
    descripcion: string
    estado: boolean,
    codigo: string
}

export type MeasureRead = Measure & {
    totalRecords: number
}

export interface MeasureSelectHtmlOnly extends Pick<Measure, 'idMedida' | 'descripcion'> { }
