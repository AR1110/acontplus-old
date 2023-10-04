
import { writable, get } from "svelte/store";
import { CustomerService as customerSvc } from "$lib/services/Customer/customer-service";
import tS from "$utils/toast";
import { showLoader, hideLoader } from "$utils/loading-spinner";

type TipoIdentificacion = {
    codigoSri: "04" | "05" | "06",
    codigo: "C" | "R" | "P",
    idTipoIdentificacion: number,
    descripcion: string
}

type TipoContribuyente = {
    idSubContribuyente: 7,
    descripcion: string
    codigo: "01" | "02" | "03" | "04" | "05" | "06"
}

type TiempoCredito = {
    idTiempoCredito: number
    descripcion: string
    diasCredito: number,
}
type DataForm = {
    tiposIdentificacion: Array<TipoIdentificacion>
    tipoContribuyentes: Array<TipoContribuyente>
    tiempoCreditos: Array<TiempoCredito>
}

type Data = {
    idCliente: number
    idTipoIdentificacion: number
    idSubContribuyente: number
    idTiempoCredito: number
    numeroIdentificacion: string
    nombreFiscal: string
    nombreComercial: string
    direccion?: string
    correo?: string
    telefono?: string
}
type State = {
    showForm: boolean
    dataForm: DataForm
    data: Data
}

const initialState: State = {
    showForm: false,
    dataForm: {
        tiposIdentificacion: [],
        tipoContribuyentes: [],
        tiempoCreditos: []
    },
    data: {
        idCliente: 0,
        idTipoIdentificacion: 0,
        idSubContribuyente: 0,
        idTiempoCredito: 0,
        numeroIdentificacion: "",
        nombreFiscal: "",
        nombreComercial: "",
        direccion: "",
        correo: "",
        telefono: ""
    }
}

export const techSpecCustomerStore = writable<State>(initialState);

export const activeShowForm = () => {
    techSpecCustomerStore.update(state => ({
        ...state,
        showForm: !state.showForm
    }))
}

export const getDataForm = () => {
    try {
        customerSvc.getDataForm().then((response) => {
            console.log(response)
            techSpecCustomerStore.update(state => {
                return {
                    ...state,
                    dataForm: response
                }
            })
        });
    } catch (error) {
        console.log(error)
    }
}

export const copiarNombreComercial = function () {
    const { data } = get(techSpecCustomerStore);
    techSpecCustomerStore.update(state => {
        state.data = {
            ...state.data,
            nombreComercial: data.nombreFiscal
        }
        return state;
    })
}

const validateForm = function () {
    const { dataForm, data } = get(techSpecCustomerStore);
    console.log(data)
    if (!(data.idTipoIdentificacion > 0)) {
        tS({
            type: "warning",
            message: "Seleccione el Tipo Identificación",
        });
        return;
    }
    if (!data.numeroIdentificacion) {
        tS({
            type: "warning",
            message: "Ingrese Número de Identificación",
        });
        return;
    }

    let IDType = dataForm.tiposIdentificacion.find(
        (typeID) => typeID.idTipoIdentificacion === data.idTipoIdentificacion
    );
    if (IDType.codigo === "C" && data.numeroIdentificacion.length !== 10) {
        tS({
            type: "warning",
            message: "Ingrese Número de Identificación",
        });
        return;
    }

    if (IDType.codigo === "R" && data.numeroIdentificacion.length !== 13) {
        tS({
            type: "warning",
            message: "Número de RUC tiene que ser de 13 dígitos",
        });
        return;
    }

    if (
        IDType.codigo === "R" &&
        data.numeroIdentificacion.slice(-3) !== "001"
    ) {
        tS({ type: "warning", message: "Número de RUC tiene que contener 001" });
        return;
    }
    if (!data.nombreFiscal) {
        tS({ type: "warning", message: "Ingrese el nombre Fiscal" });
        return;
    }
    if (!data.nombreComercial) {
        tS({ type: "warning", message: "Ingrese el nombre Comercial" });
        return;
    }
    return true;
};

const saveResponse = function (response) {
    console.log(response)
    if (response.code === "0") {
        tS({ type: 'warning', message: response.message });
    }
    if (response.code === "1") {
        tS({ type: 'success', message: response.message });
        const { data } = get(techSpecCustomerStore);

        let idCliente = data.idCliente > 0 ? data.idCliente : response.payload
        // let dataCliente = await clienteSvc.findById(idCliente) || {};
        //close modal
    }
}

export const save = () => {
    try {
        const { data } = get(techSpecCustomerStore);
        if (!validateForm()) return;

        const obj = Object.assign(data, {
            direccion: data.direccion ?? "",
            telefono: data.telefono ?? "",
            correo: data.correo ?? "",
        });

        if (data.idCliente > 0) {
            showLoader();
            customerSvc
                .post(obj)
                .then(saveResponse)
                .finally(() => hideLoader())
                .catch((error) => {
                    hideLoader();
                    console.log(error);
                });
        }

        if (!(data.idCliente > 0)) {
            showLoader();

            customerSvc
                .put(data.idCliente, obj)
                .then(saveResponse)
                .finally(() => hideLoader())
                .catch((error) => {
                    hideLoader();
                    console.log(error);
                });
        }
    } catch (error) {
        console.log(error)
    }
};