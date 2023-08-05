import { TableReadDto, TableUpdateDto } from "../models";
 

class CategoryAdapter {

    tableReadAdaptFromApi(tables: any): Array<TableReadDto> {
        return tables.map((table: TableReadDto) => ({
            id: table.id,
            roomId: table.roomId,
            numberTable: table.numberTable,
            description: table.description,
            capacity: table.capacity,
            enabled: table.enabled,
        })
        )
    }

    tableUpdateAdaptToApi(values: any): TableUpdateDto {
        return {
            roomId: values.roomId,
            numberTable: values.numberTable,
            description: values.description,
            capacity: values.capacity,
            enabled: values.enabled
        }
    }

}

const categoryAdapter = new CategoryAdapter();
export {
    categoryAdapter
}