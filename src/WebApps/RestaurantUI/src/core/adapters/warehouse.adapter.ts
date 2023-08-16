import { WarehouseAsign } from "../models";

function warehouseAdapter(warehouses: WarehouseAsign[]): Array<WarehouseAsign> {
    return warehouses.map(warehouse => ({
        idBodega: warehouse.idBodega,
        bodega: warehouse.bodega,
        codEstab: warehouse.codEstab,
        codEstab_Asig: warehouse.codEstab_Asig,
        defaultBodega: warehouse.defaultBodega,
    }))
}

export {
    warehouseAdapter
}