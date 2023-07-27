import { SalePriceList } from "@/modules/admin/models"
import { useEffect, useState } from "react"
import { useProductContext } from "../context";
import { ColumnDefinition, ReactTabulator } from "react-tabulator/lib"; 
 

export default function SalePriceListTabulator() {        
  const [salePriceList, setSalesPriceList] = useState<SalePriceList[]>([]) 
  

  const {productState} = useProductContext();
  const dataFormApi = productState.dataFormApi; 
  const columns: ColumnDefinition[] = [
    { title: "Tarifa", field: "tarifa", width: 100, hozAlign: "center", editable: false },
    { title: "Tipo Iva", field: "tipoIva", width: 100, hozAlign: "center", editable: false },
    {
        title:"Precio Venta", 
        field:"precioVenta", 
        sorter:"number", 
        hozAlign:"left",
        editable: true,
        editor:"input",  
        cellEdited: function(editor){
            console.log(editor);
        }
    },
    { title: "Precio IVA", field: "precioConIva", width: 120, hozAlign: "center", editable: true, editor: 'number'},
    { title: "% Utilidad", field: "porcentajeUtilidad", width: 110, hozAlign: "center", editable: true, editor: 'number' },
    { title: "Utilidad", field: "utilidad", width: 100, hozAlign: "center", editable: false },
    { title: "Estado", field: "estado", width: 100, hozAlign: "center", editable: false },
  ];
 

  useEffect(() => {
	const salePriceList: SalePriceList[]  =   dataFormApi.saleFees.map(item=>({ 
			id: item.idTarifa,
			tarifa: item.descripcion,
			tipoIva: dataFormApi.vatRates.find(item=>item.codigo==='IVA12')?.descripcion,
			precioVenta: 0,
			precioConIva: 0,
			porcentajeUtilidad: 0,
			utilidad: 0,
			estado: item.predeterminada?'Predeterminado': '',
		}))
		setSalesPriceList(salePriceList)
  }, [dataFormApi.saleFees]);

   
  return (
    <ReactTabulator
            responsiveLayout={true}
            autoResize={true}
            data={salePriceList}
            columns={columns}
            layout={"fitData"}     
            movable={true}
          />
  )
}
