import { SalePriceList } from "@/modules/admin/models"
import { useEffect, useState } from "react"
import { useProductContext } from "../context";
import { ColumnDefinition, ReactTabulator } from "react-tabulator/lib";


export default function SalePriceListTabulator() {
    const [salePriceList, setSalesPriceList] = useState<SalePriceList[]>([])


    const { productState } = useProductContext();
    const dataFormApi = productState.dataFormApi;
    const columns: ColumnDefinition[] = [
        { title: "Tarifa", field: "tarifa", width: 100, hozAlign: "center", editable: false },
        { title: "Tipo Iva", field: "tipoIva", width: 100, hozAlign: "center", editable: false },
        {
            title: "Precio Venta",
            field: "precioVenta",
            hozAlign: "left",
            editor: "number",
            editorParams: {
                min: 0, 
                elementAttributes: {
                    maxlength: "10", //set the maximum character length of the input element to 10 characters
                }, 
                verticalNavigation: "table", //up and down arrow keys navigate away from cell without changing value                
            }
        },
        { title: "Precio IVA", field: "precioConIva", width: 120, hozAlign: "center", editable: true, editor: 'number' },
        { title: "% Utilidad", field: "porcentajeUtilidad", width: 110, hozAlign: "center", editable: true, editor: 'number' },
        { title: "Utilidad", field: "utilidad", width: 100, hozAlign: "center", editable: false },
        { title: "Estado", field: "estado", width: 100, hozAlign: "center", editable: false },
    ];


    useEffect(() => {
        const salePriceList: SalePriceList[] = dataFormApi.saleFees.map(item => ({
            id: item.idTarifa,
            tarifa: item.descripcion,
            tipoIva: dataFormApi.vatRates.find(item => item.codigo === 'IVA12')?.descripcion,
            precioVenta: 0,
            precioConIva: 0,
            porcentajeUtilidad: 0,
            utilidad: 0,
            estado: item.predeterminada ? 'Predeterminado' : '',
        }))
        setSalesPriceList(salePriceList)
    }, [dataFormApi.saleFees]);


    return (

        <>
            {salePriceList.length > 0 ? <ReactTabulator
                responsiveLayout={true}
                autoResize={true}
                data={salePriceList}
                columns={columns}
                layout={"fitData"}  
                options={{ movableColumns: true, movableRows: true }}
                events={
                    {
                        dataChanged: (row:any) => {
                            console.log(row)
                        },
                        cellEdited: (row: any) => {
                            console.log(row.getColumn()._column.field)
                            console.log(row.getData() )

                            //Validacion de Campos 
                            
                        }
                    }
                }
            /> : 'Cargando...'}
        </>

    )
}
