// import { ProductCreateDto, SalePriceList } from "@/modules/admin/models"
// import {  useEffect} from "react"
// import { useProductContext } from "../context";
// import { ColumnDefinition, ReactTabulator } from "react-tabulator/lib";
// import { useFormikContext } from "formik";
// import { PricingCalculateUtils, RoundNumber, SnackbarUtilities } from "@/core/utils";
 
// type ColPvP = 'precioVenta' | 'precioConIva' | 'porcentajeUtilidad';

// export default function SalePriceListTabulator() { 
//     const { productState, dispatch } = useProductContext(); 
//     const dataFormApi = productState.dataFormApi; 
//     const formik = useFormikContext();
// 	const values =  formik["values"] as ProductCreateDto
//     console.log(values);
//     console.log(productState.data)
//     const columns: ColumnDefinition[] = [
//         { title: "Tarifa", field: "tarifa", width: 100, hozAlign: "center", editable: false },
//         { title: "Tipo Iva", field: "tipoIva", width: 100, hozAlign: "center", editable: false },
//         {
//             title: "Precio Venta",
//             field: "precioVenta",
//             hozAlign: "left",
//             editor: "number",
//             editorParams: {
//                 min: 0, 
//                 elementAttributes: {
//                     maxlength: "10", //set the maximum character length of the input element to 10 characters
//                 }, 
//                 verticalNavigation: "table", //up and down arrow keys navigate away from cell without changing value                
//             }
//         },
//         { title: "Precio IVA", field: "precioConIva", width: 120, hozAlign: "center", editable: true, editor: 'number' },
//         { title: "% Utilidad", field: "porcentajeUtilidad", width: 110, hozAlign: "center", editable: true, editor: 'number' },
//         { title: "Utilidad", field: "utilidad", width: 100, hozAlign: "center", editable: false },
//         { title: "Estado", field: "estado", width: 100, hozAlign: "center", editable: false },
//     ]; 

     

//     useEffect(() => {
//         console.log('Hola')
//         const vatRate = dataFormApi.vatRates.find(item => item.codigo === 'IVA12');
//         const salePriceList: SalePriceList[] = dataFormApi.saleFees.map(item => ({
//             id: item.idTarifa,
//             tarifa: item.descripcion,
//             tipoIva: vatRate?.descripcion,
//             porcentajeIva: vatRate?.porcentaje || 0,
//             precioVenta: 0,
//             precioConIva: 0,
//             porcentajeUtilidad: 0,
//             utilidad: 0,
//             estado: item.predeterminada ? 'Predeterminado' : '',
//         }))
//         dispatch({
//             type: 'productPvPs',
//             payload: salePriceList
//         }) 
//     }, [dataFormApi.saleFees, dataFormApi.vatRates, dispatch]); 

//     return (

//         <>
//             {productState.productPvPs.length > 0 ? <ReactTabulator
//                 responsiveLayout={true}
//                 autoResize={true}
//                 data={productState.productPvPs}
//                 columns={columns}
//                 layout={"fitData"}  
               
//                 // options={{ movableColumns: true, movableRows: true }}
//                 events={
//                     {
//                         dataChanged: (row:any) => {
//                             console.log(row)
//                         },
//                         cellEdited: (row: any) => {
//                             const fields: ColPvP  = row.getColumn()._column.field;
//                             const rowData: SalePriceList = row.getData(); 
//                             const oldValue = row.getOldValue();

//                             let precioConIva = 0;
//                             const precioVenta = 0;
//                             let porcentajeUtilidad = 0;
//                             const ganancia = 0;


                           
//                             //Validacion de Campos 
//                             if(values.precioCosto ==0){
//                                 SnackbarUtilities.warning('El Precio de Costo no puede ser cero!') 
//                                 return
//                             }
//                             if (isNaN(values.precioCosto)) {
//                                 SnackbarUtilities.warning('Ingrese el Precio de Costo') 
//                                 return
//                             }

//                             if (fields === "precioVenta") { 
//                                 if (rowData.precioVenta > 0) {
                    
//                                     if (rowData.precioVenta < values.precioCosto) {
//                                         rowData["precioVenta"] = oldValue;
//                                     }
//                                 }
//                             }

//                             if (fields === "precioConIva") { 
//                                 if (rowData.precioConIva > 0) {
//                                     if (rowData.precioConIva < values.precioCosto) {
//                                         rowData.precioConIva = oldValue;
//                                     }
//                                 }
//                             } 

//                             switch(fields) {
//                                 case 'precioVenta':
//                                     precioConIva = PricingCalculateUtils.calculatePriceWithVat(rowData.precioVenta, rowData.porcentajeIva);
//                                     porcentajeUtilidad = PricingCalculateUtils.getValuePercentageUtility(rowData.precioVenta, values.precioCosto);
                    
//                                     rowData.precioVenta = RoundNumber(rowData.precioVenta, dataFormApi.decimalInventario.nroPrecio);
//                                     rowData.precioConIva =RoundNumber(precioConIva, dataFormApi.decimalInventario.nroPrecio);
//                                     rowData.porcentajeUtilidad = RoundNumber(porcentajeUtilidad, 5);
//                                     break
//                             }

//                             //Validacion de Campos 
                            
//                         }
//                     }
//                 }
//             /> : 'Cargando...'}
//         </>

//     )
// }
