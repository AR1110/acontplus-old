export {
    modalNotaCreditoDetalleCtrl
}

modalNotaCreditoDetalleCtrl.$inject = ['$scope', '$uibModalInstance'];

function modalNotaCreditoDetalleCtrl($scope, $uibModalInstance){

    // async $onInit() {
    //     try {
    //         showLoader(); 
    //         let resultsDataForm = await this._commonSvc.getDataFormVenta(); 

    //         this.establecimientos = resultsDataForm[0];

    //         if (this.establecimientos.length > 0) {

    //             let dataEstab = this.establecimientos.find(item => item.codEstab === this.dataDocumento.codEstab)

    //             let resultsDataFormEstab = await this.getDataFormEstabAsig(dataEstab);
    //             this.puntosEmisiones = resultsDataFormEstab[0];

    //             this.bodegas = resultsDataFormEstab[1];
    //             this.idBodega = this.bodegas.length > 0 ? this.bodegas[0].idBodega : 0;

    //         } else {
    //             this._tS.toastr('info', 'NO TIENE ASIGNADO NINGÚN ESTABLECIMIENTO');
    //         }


    //         this.decimal = resultsDataForm[1][0]
    //         this.configDetalle = resultsDataForm[2];
    //         this.tipoIvas = resultsDataForm[3];
    //         this.tarifas = resultsDataForm[4];

    //         this.idTarifa = this.tarifas.length > 0 ? this.tarifas[0].idTarifa : 0;

    //         this.tiempoCreditos = resultsDataForm[5];

    //         this.setColumnDefsVista();


    //         //Cargamos los Datos 
    //         this.data = this.dataDocumento;
    //         this.nroDocSecuencial = this.data.nroDocSecuencial;
    //         this.gridOptions.data = this.detalleDocumento;

    //         this.fechaEmisionEscrita = this._fS.getFechaEscrita(this.data.fechaEmision);

    //         this.$scope.$apply();

    //     } catch (error) {

    //         console.log(error)

    //     } finally {

    //         hideLoader();
    //     }
    // }

    $scope.closeModal = function(){
        $uibModalInstance.close();
    }
}