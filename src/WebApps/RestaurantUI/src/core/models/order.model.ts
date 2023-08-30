  
  export interface RawOrderData {
      id: number,
      establecimientoId: number
      puntoEmisionId: number
      appTableId?: number
      tableId: number,
      sequence: number,
      serie: string
      customerCompanyId?: number,
      tax?: number,
      discount: number,
      tip?: number,
      total: number,
      obs?: string,
      createdAt: string
      updatedAt?: string
      enabled: boolean,
      deleted?: string,
      userId: number,
      uuid?: string,
      documentoId: number
      codDoc?: string 
  }


  export interface OrderReadDto {
    orderId: number
    documentoId: number
    establecimientoId: number
    puntoEmisionId: number
    serie: string
    total: number 
    codDoc?: string
    createdAt: string
  }