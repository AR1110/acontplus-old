import { Bank, City, PaymentSubType, PaymentType, RawBankData, RawCityData, RawPaymentSubType, RawPaymentType, Voucher, VoucherQuota } from "../models"; 

function paymentTypeAdapter(paymentTypes: RawPaymentType[], paymentSubTypes: RawPaymentSubType[]): Array<PaymentType> { 
    const resultado = paymentTypes.map(paymentType => {
        const codigo = paymentType.codigo;
        const mapperPaymentSubTypes = paymentSubTypes.filter(secundarioItem => secundarioItem.codigo === codigo);
         
        const obj = {
            paymentTypeId: paymentType.idEntidadFinanciera,
            code: paymentType.codigo,
            description: paymentType.descripcion,
            paymentSubTypes: paymentSubTypeAdapter(mapperPaymentSubTypes)

        }
        return obj;
    });
    return resultado;
    // return paymentTypes.map(paymentType=>({
    //     paymentTypeId: paymentType.idEntidadFinanciera,
    //     code: paymentType.codigo,
    //     description: paymentType.descripcion
    // }) )   
}

function paymentSubTypeAdapter(paymentSubTypes: RawPaymentSubType[]): Array<PaymentSubType> {  
    return paymentSubTypes.map(paymentSubType=>({
        paymentSubtypeId: paymentSubType.idSubEntidadFinanciera,
        paymentTypeId: paymentSubType.idEntidadFinanciera,
        code: paymentSubType.codigo,
        description: paymentSubType.descripcion,
        isControlBox: paymentSubType.controlCaja
    }) )   
}

function bankAdapter(banks: RawBankData[]): Array<Bank> {
    return banks.map(bank => ({
        bankId: bank.idBanco,
        description: bank.descripcion,
        code: bank.codigo
    }))
}

function cityAdapter(cities: RawCityData[]): Array<City> {
    return cities.map(city => ({
        cityId: city.idCiudad,
        description: city.descripcion,
        province: city.provincia,
        code: city.codigo
    }))
}

function voucherQuotaAdapter(voucherQuotas: any): Array<VoucherQuota> {
    return voucherQuotas.map((voucherItem: any) => ({
        ...voucherItem,
        cuotas: JSON.parse(voucherItem.cuotas),
    }))
}


function comprobanteAdpater(comprobante: any): Voucher {
    return  {
        customerCompanyId: comprobante.idCliente,
        customerIdentification: comprobante.numeroIdentificacion,
        customerName: comprobante.nombreFiscal,
        payingAmount: comprobante.importeTotal,
        receivedAmount: comprobante.importeTotal,
        changeReturn: 0,
        totalBalance: comprobante.saldo,
        codEstab: comprobante.codEstab,
        creationDate: comprobante.fechaEmision,
        nroDoc: comprobante.serieComprobante
    }
}



export {
    paymentTypeAdapter, 
    bankAdapter,
    cityAdapter,
    voucherQuotaAdapter,
    comprobanteAdpater
}