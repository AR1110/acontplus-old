import { RawTableData, TableReadDto } from "../models"; 

function tableReadAdapter(tables: RawTableData[]): Array<TableReadDto> {
    console.log(tables)      
    return tables.map((table) => ({
        tableId: table.tableId,
        description: table.description,        
    })
    )
}

export {
    tableReadAdapter
}