import { CustomerDataForm, CustomerReadDto, RawCustomerData } from "../models";

function customerReadAdapter(customers: RawCustomerData[]): Array<CustomerReadDto> {
    console.log(customers);
    return customers.map(customer => ({
        customerId: customer.idCliente,
        identificationNumber: customer.numeroIdentificacion,
        taxName: customer.nombreFiscal,
        tradeName: customer.nombreComercial
    })
    )
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