import { RawTableData, TableReadDto } from "../models"; 

function tableReadAdapter(tables: RawTableData[]): Array<TableReadDto> {      
    return tables.map((table) => ({
        tableId: table.id,
        capacity: table.capacity,
        numberTable: table.numberTable,
        description: table.description,
        floorId: table.floorId
    })
    )
}

export {
    tableReadAdapter
}