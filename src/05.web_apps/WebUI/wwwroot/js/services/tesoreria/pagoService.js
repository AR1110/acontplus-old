(function(){
    'use strict';
   
    angular.module('acontPlusApp')
           .factory('pagoService', pagoService);
           
    
    pagoService.$inject = ['toastService','formulario'];
    
    function pagoService(toast, form) {
        return {
            valorPago: 0,
            setValorPago,
            getValorPago,
            verificarEstadoPago,
            validarFormaPago,
            verificarEstadoSaldo,            
            getTotalPago,
            getTotalAbono,
            getTotalAbonoPosFechado,
            getValorSaldo,
            getValorCambio
        }

        function setValorPago(valor){
            this.valorPago=Number(valor);
        }

        function getValorPago(){
            return form.roundNumber(this.valorPago, 5);
        }

        function verificarEstadoPago(cuota, objEstadoPago){
            let estado = '';
            if (cuota.cxp.cuota === (cuota.abono + cuota.abonoPosfechado)) estado = objEstadoPago["CBR"];
            if (cuota.saldo > 0) estado = objEstadoPago["PP"];
            if (cuota.cxp.cuota === cuota.saldo) estado = objEstadoPago["PE"];            
            return estado;
        }

        function validarFormaPago(entidadFinanciera, pago, banco, ){
            //Si el abono es Cheque            
            if (entidadFinanciera.codigo === "CHE") {
                if (form.campo(banco.idBanco)) {
                    toast.toastr('warning', 'Seleccione el Banco', 'Pago');
                    return
                }
                if (form.campo(pago.nro)) {
                    toast.toastr('warning', 'Ingrese el Número', 'Pago');
                    return
                }
            }
            //Si es tarjeta de credito 
            if (entidadFinanciera.codigo === "TAR") {
                if (form.campo(pago.valorPago)) {
                    toast.toastr('warning', 'Ingrese el Valor del Abono', 'Pago');
                    return
                }
                if (form.campo(pago.nro)) {
                    toast.toastr('warning', 'Ingrese el Número', 'Pago');
                    return
                }
                if (form.campo(pago.idCiudad)) {
                    toast.toastr('warning', 'Seleccione la Ciudad', 'Pago');
                    return
                }
                if (form.campo(pago.referencia)) {
                    toast.toastr('warning', 'Ingrese la Referencia', 'Pago');
                    return
                }
                if (form.campo(pago.aprobacion)) {
                    toast.toastr('warning', 'Ingrese la Aprobación', 'Pago');
                    return
                }
                if (form.campo(pago.lote)) {
                    toast.toastr('warning', 'Ingrese el Lote', 'Pago');
                    return
                }
                
            }

            //Si es tranferencia 
            if (entidadFinanciera.codigo == "TRA") {
                if (form.campo(pago.valorPago)) {
                    toast.toastr('warning', 'Ingrese un Valor a Cancelar', 'Pago');
                    return
                }
                if (form.campo(banco.idBanco)) {
                    toast.toastr('warning', 'Seleccione el Banco', 'Pago');
                    return
                }
                if (form.campo(pago.nro)) {
                    toast.toastr('warning', 'Ingrese el Número', 'Pago');
                    return
                }
            }

            if (form.campo(pago.valorPago)) {
                toast.toastr('warning', 'Ingrese un Valor a Cancelar', 'Pago');
                return
            }
            if (Number(pago.valorPago) === 0) {
                toast.toastr('warning', 'El Valor a cancelar debe ser mayor 0', 'Pago');
                return
            };

            return true
        }


        function verificarEstadoSaldo(val) {
            let total = val.abono + val.abonoPosfechado;            
            return form.roundNumber(total, 5) === form.roundNumber(val.cxp.cuota, 5) ? 0 : form.roundNumber(val.saldo, 5);
        };

      

        function getTotalPago(listaPagos){
            return listaPagos.map(val => val.valor)
                             .reduce((prev, curr) => prev + curr, 0);
        }

        function getTotalAbono(cuotasAfectados){
            let totalAbono=0;
                totalAbono = cuotasAfectados.map(val=>val.detalle.abono)
                                            .reduce((prev, curr)=>prev + curr, 0);
            return form.roundNumber(totalAbono, 5);
        }   

        function getTotalAbonoPosFechado(selectedDocs){                        
            let abonoPosfechado= 0; 
                abonoPosfechado=selectedDocs.map(val=>val.cuotas.reduce((prev, curr)=>prev.concat(curr)))
                                   .map(val=>val.abonoPosfechado).reduce((prev, curr)=>prev+curr, 0);            
                                            //   .reduce((prev, curr)=>prev+curr,0);
                                            //   console.log(abono)     
                                            //   return                                       
            return form.roundNumber(abonoPosfechado, 5);
        }

        function getValorSaldo(selectedDocs){
            let valorSaldo= selectedDocs.map(val=>val.cuotas.reduce((prev, curr)=>prev.concat(curr)))
                                   .map(val=>val.saldo).reduce((prev, curr)=>prev+curr, 0);                 
            return form.roundNumber(valorSaldo, 5);
        }

        function getValorCambio(totalPago, saldoOriginal){
            let valorCambio = 0;            
            if (totalPago >= saldoOriginal) {
                valorCambio = totalPago -   saldoOriginal;
            }
            return form.roundNumber(valorCambio,5);            
        }



}
})(window.angular)