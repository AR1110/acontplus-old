import { RawTableData, TableReadDto } from "../models"; 

function tableReadAdapter(tables: RawTableData[]): Array<TableReadDto> {  
    console.log(tables)    
    return tables.map((table) => ({
        tableId: table.id,
        capacity: table.capacity,
        numberTable: table.numberTable,
        description: table.description,
        floorId: table.floorId,
        assigned: table.assigned ?? false
    })
    )
}

export {
    tableReadAdapter
}