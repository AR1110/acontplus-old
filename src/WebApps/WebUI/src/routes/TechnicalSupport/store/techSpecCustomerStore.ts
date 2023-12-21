
import { writable, get } from "svelte/store";
import { CustomerService as customerSvc } from "@/lib/services/Customer/customer-service";
import tS from "@/lib/utils/toast";
import { showLoader, hideLoader } from "@/lib/utils/loading-spinner";

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
    customerCompanyId: number
    showForm: boolean
    isUpdateCustomer: boolean
    isNewCustomer: boolean
    dataForm: DataForm
    data: Data
}

const initialData: Data = {
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

const initialState: State = {
    customerCompanyId: 0, //id que proviene externamente para actualizar los datos del cliente
    showForm: false,
    isUpdateCustomer: false,
    isNewCustomer: false,
    dataForm: {
        tiposIdentificacion: [],
        tipoContribuyentes: [],
        tiempoCreditos: []
    },
    data: structuredClone(initialData)
}

export const techSpecCustomerStore = writable<State>(initialState);

/**
 * 
 * @param typeAction "UPDATE" | "NEW" | "CLOSE"
 * @param customerCompanyId Por defecto 0
 * @param data Recibe datos devueltos por el SRI
 */
export const activeShowForm = (typeAction: "UPDATE" | "NEW" | "CLOSE", customerCompanyId = 0, dataSRI?: any) => {
    const isUpdateCustomer = typeAction === "UPDATE";
    const isNewCustomer = typeAction === "NEW";
    const showForm = typeAction !== "CLOSE";

    techSpecCustomerStore.update(state => {
        state.customerCompanyId = customerCompanyId,
            state.showForm = showForm,
            state.isUpdateCustomer = isUpdateCustomer,
            state.isNewCustomer = isNewCustomer;

        if (typeAction === "CLOSE") {
            state.data = structuredClone(initialData)
        }

        //Setear datos devueltos del SRI 
        if (typeof dataSRI === "object") {

            state.data = {
                ...state.data,
                numeroIdentificacion: dataSRI.identificacionComprador,
                nombreFiscal: dataSRI.razonSocialComprador,
                nombreComercial: dataSRI.razonSocialComprador,
                direccion: dataSRI.direccionComprador
            }
        }
        return state;
    })
}

export const getDataForm = async () => {
    try {
        const { data, customerCompanyId } = get(techSpecCustomerStore);
        let codeID = "R";

        /**
         * Verificamos si los datos están cargados del SRI y, en caso de estarlo, comprobamos si es RUC o CÉDULA 
         * para seleccionar el idTipoIdentificación correspondiente, dependiendo de si es RUC o CÉDULA.
         */

        if (data.numeroIdentificacion && data.nombreFiscal) {
            codeID = data.numeroIdentificacion.length === 13 ? codeID : "C"
        }

        showLoader();
        await customerSvc.getDataForm().then((response: DataForm) => {

            const { tiposIdentificacion, tiempoCreditos } = response;

            const { idTipoIdentificacion } = tiposIdentificacion.find(item => item.codigo === codeID);

            const idTiempoCredito = tiempoCreditos.length > 0 ? tiempoCreditos[0].idTiempoCredito : 0;

            techSpecCustomerStore.update(state => {
                state.dataForm = response;
                state.data = {
                    ...state.data,
                    idTipoIdentificacion,
                    idTiempoCredito
                }
                return state;
            })
        }).finally(() => hideLoader());

        if (customerCompanyId > 0) {
            customerSvc.getId(customerCompanyId).then(response => {
                techSpecCustomerStore.update(state => {
                    state.data = response;
                    return state;
                })
            })
        }


    } catch (error) {
        console.log(error)
    }
}


export const validateExistenceCustomer = (event) => {
    const { data } = get(techSpecCustomerStore);
    customerSvc.checkClientByIdentification({
        textSearch: data.numeroIdentificacion
    }).then(response => {
        if (Array.isArray(response)) {
            tS({
                type: "info",
                message: "Cliente Registrado"
            })
        } else {
            serachCustomerToSRI(event)
        }
    })
}

function validationIDNumber(numero: string) {
    numero = numero ? numero.trim() : "";
    if (![10, 13].includes(numero.length)) return;

    if (isNaN(parseInt(numero))) return;

    if (numero.length === 13 && numero.slice(-3) !== "001") return;
    return true;
}

export const serachCustomerToSRI = (event) => {
    const { dataForm, data } = get(techSpecCustomerStore);

    const codeID = dataForm.tiposIdentificacion.find(dataID => dataID.idTipoIdentificacion === data.idTipoIdentificacion);
    if (event.key !== "Enter") return;

    if (!["R", "C"].includes(codeID.codigo)) return

    if (!validationIDNumber(data.numeroIdentificacion)) {
        tS({
            type: "warning",
            message: "Ingrese número de identificación correcta!",
        });
        return;
    }

    if (data.numeroIdentificacion.length === 13) {
        showLoader();
        customerSvc
            .getRuc(data.numeroIdentificacion)
            .then((response) => {
                const { numeroRuc, razonSocial, direccion, telefono, email, error } =
                    response;
                if (!numeroRuc) {
                    tS({
                        type: "warning",
                        message: error,
                    });
                    return;
                }
                techSpecCustomerStore.update(state => {
                    state.data = {
                        ...state.data,
                        nombreFiscal: razonSocial,
                        nombreComercial: razonSocial,
                        direccion: direccion
                    }
                    return state;
                })
            })
            .finally(() => hideLoader());
    }
    if (data.numeroIdentificacion.length === 10) {
        showLoader();
        customerSvc
            .getCedula(data.numeroIdentificacion)
            .then((response) => {
                const {
                    identificacion,
                    nombreCompleto,
                    direccion,
                    error,
                } = response;
                if (!identificacion || !nombreCompleto) {
                    tS({
                        type: "warning",
                        message: error,
                    });
                    return;
                }

                techSpecCustomerStore.update(state => {
                    state.data = {
                        ...state.data,
                        nombreFiscal: nombreCompleto,
                        nombreComercial: nombreCompleto,
                        direccion: direccion
                    }
                    return state;
                })
            })
            .finally(() => hideLoader());
    }
};

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

    const IDType = dataForm.tiposIdentificacion.find(
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

const saveResponse = async function (response) {
    if (response.code === "0") {
        tS({ type: 'warning', message: response.message });
    }
    if (response.code === "1") {
        tS({ type: 'success', message: response.message });
        const { data } = get(techSpecCustomerStore);

        const customerCompanyId = data.idCliente > 0 ? data.idCliente : response.payload
        const dataCustomer = await customerSvc.getId(customerCompanyId)
        //close modal
        console.log(dataCustomer)
        activeShowForm("CLOSE")
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
                .put(data.idCliente, obj)
                .then(saveResponse)
                .finally(() => hideLoader())
                .catch((error) => {
                    console.log(error);
                });
        }

        if (!(data.idCliente > 0)) {
            showLoader();
            customerSvc
                .post(obj)
                .then(saveResponse)
                .finally(() => hideLoader())
                .catch((error) => {
                    console.log(error);
                });

        }
    } catch (error) {
        console.log(error)
    }
};