
export interface RawTableData {
    id: number
    capacity: number
    numberTable: number
    description: string
    floorId: number
}

export interface TableReadDto {
    tableId: number
    capacity: number
    numberTable: number
    description: string
    floorId: number
}
