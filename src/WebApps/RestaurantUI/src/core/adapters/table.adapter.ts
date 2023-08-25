import { RawTableData, TableReadDto } from "../models"; 

function tableReadAdapter(tables: RawTableData[]): Array<TableReadDto> {      
    return tables.map((table) => ({
        tableId: table.id,
        description: table.description,        
    })
    )
}

export {
    tableReadAdapter
}