


export class ModalPagoHistorialCtrl{
    static $inject = ['$scope','mainService', '$uibModalInstance', 'toastService','formulario', 'params']
    constructor($scope, _mS, $uibModalInstance, _toastr, _form, _params){
        
        this.$scope            = $scope;
        this._mS               = _mS;        
        this.$uibModalInstance = $uibModalInstance;
        this._toastr           = _toastr;
        this._form             = _form;        
        this.historialPagos    = [];

        let {pagos, data, TIPO_DOC} = _params;

        this.pagosTemp = pagos;

        this.data      = data;
        this.TIPO_DOC  = TIPO_DOC;
    }


    async $onInit(){   
        
        this.historialPagos = this.pagosTemp.map(item=>{
            let idCompE = item.idComprobanteEgreso;

            let url = `/Pago/GetByDocument?idComprobanteEgreso=${idCompE}&idTipoDocumento=${this.TIPO_DOC.idTipoDocumento}&idComprobante=${this.data.id}`;

            this._mS.getData('get', url).then(response=>{
                item.pagos =  JSON.parse(response.data);
                item.showPago = true;     
            })

            return item;
        }) 
        
        console.log(this.historialPagos)
        
    }

    $onChanges(){
       // alert(newValue)
    }

    $onDestroy(){
        //alert(9)
    }    

    getPagoDetalle(data) {
        this._mS.getData('get', `/PagoDetalle/GetByDocument?idPago=${data.idPago}&idTipoDocumento=${this.TIPO_DOC.idTipoDocumento}&idComprobante=${this.data.id}`).then(response => {
            if (response.id == "0") {
                this._toastr.toastr('warning', response.message, response.titleSms);
                return
            }
            data.pagoDetalles = JSON.parse(response.data) || [];
            data.showDetalle = !data.showDetalle;              
        })
    };

    cerrarModal(){
        this.$uibModalInstance.close('hola');
    }

}



