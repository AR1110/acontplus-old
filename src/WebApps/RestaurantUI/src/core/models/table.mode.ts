
export interface RawTableData {
    id: number
    capacity: number
    numberTable: number
    description: string
    floorId: number
    assigned: boolean
}

export interface TableReadDto {
    tableId: number
    capacity: number
    numberTable: number
    description: string
    floorId: number
    assigned: boolean
}
