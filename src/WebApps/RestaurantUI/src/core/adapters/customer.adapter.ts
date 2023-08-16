import { CustomerReadDto, RawCustomerData } from "../models";

function customerReadAdapter(customers: RawCustomerData[]): Array<CustomerReadDto> {
    console.log(customers);
    return customers.map(customer=> ({        
            idCustomer: customer.idCliente,
            identificationNumber: customer.numeroIdentificacion,
            taxName: customer.nombreFiscal,
            tradeName: customer.nombreComercial
        })
    )
}

export {
    customerReadAdapter
}