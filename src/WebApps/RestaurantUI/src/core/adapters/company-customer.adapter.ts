import { isValidField } from "../utilities";

const mapperTo = function(data: any){
    const telefono = data.telefonos.length > 0 ? data.telefonos.join('|') : "";
    const correo = data.correos.length > 0 ? data.correos.join('|') : "";
    // const placa = data.placas.length > 0 ? data.placas.join('|') : "";
    return {
        idCliente: isValidField(data.idCliente),
        idEmpleado: isValidField(data.idEmpleado),
        idTipoIdentificacion: data.idTipoIdentificacion,
        idTipoClienteProveedor: isValidField(data.idTipoClienteProveedor),
        idTipoEntidad: isValidField(data.idTipoEntidad),
        idCiudad: isValidField(data.idCiudad),
        idSubContribuyente: isValidField(data.idSubContribuyente),
        idTiempoCredito: data.idTiempoCredito,
        idEmpresa: isValidField(data.idEmpresa),
        idCargo: isValidField(data.idCargo),
        numeroIdentificacion: data.numeroIdentificacion,
        nombreFiscal: data.nombreFiscal,
        nombreComercial: data.nombreComercial,
        direccion: isValidField(data.direccion),
        telefono: isValidField(telefono),
        correo: isValidField(correo),
        placa: null,
        montoCredito: isValidField(data.montoCredito),
        nota: isValidField(data.nota),
        validationSri: data.validationSri,
    }
}


const companyCustomerAdapter = {
    mapperTo
}

export default companyCustomerAdapter;