import { writable, get } from "svelte/store";

import { ArticleService as articuloSvc } from "$lib/services/inventory/article-service";
import { hideLoader, showLoader } from "$utils/loading-spinner";

type Estab = {
    idEstab_Asig: number
    idEstablecimiento: number
    codEstab: string
    nombreComercial: string
    predeterminado: boolean
}

type Category = {
    idSubFamilia: number
    siglas: string
    descripcion: string
}

type Measure = {
    idMedida: number
    codigo: string
    descripcion: string
}

type TypeProduct = {
    idTipoArticulo: number
    descripcion: string
}

type TaxRate = {
    idTipoIva: number
    descripcion: string
    porcentaje: 12 | 0 | 8,
    codigoPorcentaje: 2 | 6 | 0 | 7 | 8,
    idImpuesto: number,
    codigo: "IVA12" | "NOIVA" | "IVA0" | "EXENIVA" | "8"
}
type Fare = {
    idTarifa: number
    descripcion: string
    codigo: string
    predeterminada: boolean
}

type DataForm = {
    estabs: Array<Estab>,
    subfamilias: Array<Category>,
    medidas: Array<Measure>,
    tiposProducto: Array<TypeProduct>,
    tarifasImpuesto: Array<TaxRate>,
    tarifas: Array<Fare>
}

type Product = {
    idArticulo: number
    descripcion: string
    idSubfamilia: number
    idTipoArticulo: number
    idMedida: number
    idTipoIva: number
    precioCosto: number
    precioSinSubsidio: number
}

type ProductPVP = {
    tarifa: string
    precioVenta: number
    precioConIva: number
    porcentajeUtilidad: number
    porcentajeIva: number
    utilidad: number
}
type State = {
    dataForm: DataForm
    data: Product
    productPVPs: Array<ProductPVP>
}
const initialState: State = {
    dataForm: {
        estabs: [],
        subfamilias: [],
        medidas: [],
        tiposProducto: [],
        tarifasImpuesto: [],
        tarifas: []
    },
    data: {
        idArticulo: 0,
        descripcion: "",
        idSubfamilia: 0,
        idTipoIva: 0,
        precioCosto: 0,
        precioSinSubsidio: 0,
        idTipoArticulo: 0,
        idMedida: 0
    },
    productPVPs: []
}

export const productDialogStore = writable<State>(initialState);


export const setGridTarifa = () => {
    try {
        const { dataForm } = get(productDialogStore);
        const taxRate = dataForm.tarifasImpuesto.find(item => (item.codigo === "IVA12"));

        const productPVPs = dataForm.tarifas.map((item) => ({
            tarifa: item.descripcion,
            precioVenta: 0,
            precioConIva: 0,
            porcentajeUtilidad: 0,
            porcentajeIva: taxRate.porcentaje,
            utilidad: 0,
        }));
        productDialogStore.update(state => ({
            ...state,
            productPVPs,
            data: {
                ...state.data,
                idTipoIva: taxRate.idTipoIva
            }
        }))
    } catch (error) {
        console.log("error al cargar las tarifas")
    }
}

export const getDataForm = async () => {
    try {
        showLoader();
        let dataForm = await articuloSvc.getDataForm({ tipo: 5 });
        let { tiposProducto, medidas } = dataForm;
        let idTipoArticulo = tiposProducto.length > 0 ? tiposProducto[0].idTipoArticulo : 0
        let idMedida = medidas.length > 0 ? medidas[0].idMedida : 0
        productDialogStore.update((state) => {
            return {
                ...state,
                dataForm,
                data: {
                    ...state.data,
                    idTipoArticulo,
                    idMedida
                }
            }
        })
        setGridTarifa();
        hideLoader();
    } catch (error) {
        hideLoader();
        console.log(error);
    }

}