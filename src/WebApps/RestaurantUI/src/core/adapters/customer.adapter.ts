import { CustomerDataForm, CustomerReadDto, RawCustomerData } from "../models";

function customerReadAdapter(customers: RawCustomerData): CustomerReadDto;
function customerReadAdapter(customers: RawCustomerData[]): CustomerReadDto[];
function customerReadAdapter(customers: any): any {
    console.log(typeof customers)
    if (!Array.isArray(customers) && customers !== null && typeof customers !== 'object') {
        throw new Error('La entrada debe ser un objeto o un array no nulo.');
    }

    if (Array.isArray(customers)) {
        const customersMapper: Array<CustomerReadDto> = customers.map(customer => ({
            customerCompanyId: customer.idCliente,
            identificationNumber: customer.numeroIdentificacion,
            fiscalName: customer.nombreFiscal,
            tradeName: customer.nombreComercial,
            correo: customer.correo,
            telefono: customer.telefono,
            direccion: customer.direccion
        }));
        return customersMapper;

    }

    if (typeof customers === 'object') {
        const customer: RawCustomerData = customers;
        const obj: CustomerReadDto =  {
            customerCompanyId: customer.idCliente,
            identificationNumber: customer.numeroIdentificacion,
            fiscalName: customer.nombreFiscal,
            tradeName: customer.nombreComercial,

            idSubContribuyente: customer.idSubContribuyente,
            idTiempoCredito: customer.idTiempoCredito,
            idTipoIdentificacion: customer.idTipoIdentificacion,
            direccion: customer.direccion,
            correo: customer.correo,
            telefono: customer.telefono,            
        };
        return obj;
    }
}

function dataFormReadAdapter(inputObject: CustomerDataForm): CustomerDataForm {
    if (typeof inputObject !== 'object' || inputObject === null) {
        throw new Error('La entrada debe ser un objeto no nulo.');
    }
    const tipoIdentificacion = inputObject.tipoIdentificacion.map((obj) => ({
        idTipoIdentificacion: obj.idTipoIdentificacion,
        descripcion: obj.descripcion,
        codigoSri: obj.codigoSri,
    }))
    const tipoContribuyentes = inputObject.tipoContribuyentes.map(obj => ({
        idSubContribuyente: obj.idSubContribuyente,
        codigo: obj.codigo,
        descripcion: obj.descripcion
    }));
    const tiempoCreditos = inputObject.tiempoCreditos.map(obj => ({
        idTiempoCredito: obj.idTiempoCredito,
        descripcion: obj.descripcion
    }))
    const obj = {
        tipoIdentificacion,
        tipoContribuyentes,
        tiempoCreditos,
    }
    return obj;
}


export {
    customerReadAdapter,
    dataFormReadAdapter
}