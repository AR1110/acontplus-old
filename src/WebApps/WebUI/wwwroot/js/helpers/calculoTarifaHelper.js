
export class CalculoTarifaHelper{   

    constructor() { }

    requiredParam(param) {
        throw new Error(`Falta el parámetro requerido: ${param}`);
    }

    static calcularPrecioConIva(
        precioVenta,
        porcentaje
    ) {
        try {
            const resultadoPorcentaje = Number(porcentaje) / 100;
            const result              = Number(precioVenta) * Number(resultadoPorcentaje)           
            const precioConIva        = result + Number(precioVenta);
            return precioConIva;
        } catch (error) {
            toastr.error(error)
        }      
    }

    static  calcularPrecioVenta(precioConIva, porcentaje) {
        try {
            const resultadoPorcentaje = Number(porcentaje) / 100 + 1;
            const precioVenta = Number(precioConIva) / Number(resultadoPorcentaje);
            return precioVenta;
        } catch (error) {
            toastr.error(error)
        }       
    }   
    
    

    static calcularPorcentajeUtilidad(
        precioCosto ,
        porcentajeUtilidad
    ) { 
        try {
            let resultPorcentajeUtilidad = Number(porcentajeUtilidad) / 100;
            let result = Number(precioCosto) * resultPorcentajeUtilidad;
            let precioVenta = Number(precioCosto) + result;
            return precioVenta
            
        } catch (error) {
            toastr.error(error)
        }       
        
    }

   

    //Get Campo Porcentaje Utilidad
    static campoPorcentajeUtilidad(precioCosto, precioVenta) {
        try {            
            let porcentajeUtilidad = (Number(precioVenta) / Number(precioCosto) * 100) - 100;
            return porcentajeUtilidad;
            
        } catch (error) {
            toastr.error(error)
        }
    }


    //EN VENTA 
    static getPrecioIvaConDescuento(precioConIva, porcentajeDescuento){     
        try {
            let porcentaje = Number(porcentajeDescuento) / 100;
            let descuento = Number(porcentaje) * Number(precioConIva);
            let precioIvaConDescuento = Number(precioConIva) - Number(descuento);
            return precioIvaConDescuento;            
        } catch (error) {
            toastr.error('CÁLCULO DE PRECIO CON IVA CON DESCUENTO')
        }       
        
    }

    static getValorDescuento(precioUnitario, porcentajeDescuento){
        try {
            let porcentaje = Number(porcentajeDescuento) / 100;
            let descuento = Number(porcentaje) * Number(precioUnitario);
            return descuento;            
        } catch (error) {
            toastr.error(`CÁLCULO DE VALOR DESCUENTO: ${error}`)
        }
    }      
    
    static getPorcentajeDescuento(precioUnitario, valorDescuento){
        let porcentaje = valorDescuento / precioUnitario;
        let porcentajeDescuento = porcentaje * 100;
        return porcentajeDescuento;
    }

}