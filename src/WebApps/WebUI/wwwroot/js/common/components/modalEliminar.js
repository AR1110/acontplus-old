app.component("modalEliminarComponent", {
    template: `
    <style>
       
        .modal-confirm  .modal-confirm-content  {
            padding: 20px;
            border-radius: 5px;
            border: none;
            text-align: center;
            font-size: 14px;
        }
        .modal-confirm .modal-header {
            border-bottom: none;   
            position: relative;
        }
        .modal-confirm h5 {
            text-align: center;
            font-size: 26px;
            margin: 30px 0 -10px;
        }
        .modal-confirm .close {
            position: absolute;
            top: -5px;
            right: -2px;
        }
       
        .modal-confirm .modal-footer {
            border: none;
            text-align: center;		
            border-radius: 5px;
            font-size: 13px;
            padding: 10px 15px 25px;
        }
        .modal-confirm .modal-footer a {
            color: #999;
        }		
        .modal-confirm .icon-box {
            width: 80px;
            height: 80px;
            margin: 0 auto;
            border-radius: 50%;
            z-index: 9;
            text-align: center;
            border: 3px solid #f15e5e;
        }
        .modal-confirm .icon-box i {
            color: #f15e5e;
            font-size: 46px;
            display: inline-block;
            margin-top: 13px;
        } 
        .modal-confirm .btn-danger {
            background: #f15e5e;
        }
        .modal-confirm .btn-danger:hover, .modal-confirm .btn-danger:focus {
            background: #ee3535;
        }
        .trigger-btn {
            display: inline-block;
            margin: 100px auto;
        }
    </style>
    <div class="modal-confirm">
        <div class="modal-confirm-content">
            <div class="modal-header flex-column">
                <div class="icon-box"> 
                    <i class="fa fa-times"></i>
                </div>						
                <h5 class="modal-title w-100">¿Esta seguro que desea anular este documento?</h5>	
                <button type="button" class="close " data-dismiss="modal" aria-hidden="true"  ng-click="$ctrl.cancel()">&times;</button>
            </div>
            <div class="modal-body">
                 
                <p ng-if="isFactElect">Acceda a la página del SRI -> Facturación Electrónica -> Producción -> Anulación -> Solicitud de Anulación para anular el documento y evitar su validez tributaria. Esta acción es solo para control del sistema.</p>
                <tabla-info-adicional-component data="dataObservaciones"></tabla-info-adicional-component>
            </div>
            <div class="modal-footer justify-content-center">
            <button type="button" class="   btn btn-danger" ng-click="anular()">Si, anular!</button>
                <button type="button" class="  btn btn-secondary" data-dismiss="modal" ng-click="$ctrl.cancel()">Cancelar</button>
            </div>
        </div>
    </div>
    `,
    //controllerAs: '$ctrl',
    bindings: {
        id: '=',
        resolve: '<',
        close: '&',
        dismiss: '&',
        isFactElect: '=',
        codDoc: '='
    },
    controller: [
        "$scope",
        "facturaService",
        "notaEntregaService",
        'formulario',
        'toastService',
        function ($scope, fSvc,notaEntregaSvc, fS, tS) {
            $scope.dataObservaciones = [{
                nombre: 'Motivo de anulación',
                valor: null
            }]

            const $ctrl = this; 
            let id = 0;
            let codDoc=null;

            $ctrl.$onInit = function () {
                id = $ctrl.resolve.params.id;
                $scope.isFactElect = $ctrl.resolve.params.codDoc==='FV';
                codDoc = $ctrl.resolve.params.codDoc;
            };


            $scope.anular = function () {
                if(!(id>0)){
                    tS.toastr({
                        type: 'warning',
                        message: 'Id documento invalido'
                    })
                    return  
                }

                if ($scope.dataObservaciones.length === 0) {
                    tS.toastr({
                        type: 'warning',
                        message: 'Ingrese motivo de anulación'
                    })
                    return
                }

                if ($scope.dataObservaciones.some((val) => !fS.isValidField(val.nombre) || !fS.isValidField(val.valor))) {
                    tS.toastr({
                        type: 'warning',
                        message: 'Ingrese todos los campos'
                    })
                    return
                }

                if(codDoc==='FV'){

                    fSvc.anular(id, $scope.dataObservaciones).then(response => {
                        if (response.code === "0") {
                            fS.sweetAlert("warning", response.message);
                        }
                        if (response.code === "1") {
                            fS.sweetAlert(
                                "success",
                                response.message, '', 1000
                            );
                            $ctrl.close({
                               $value:{
                                esAnulado: true
                               }
                            });
                        }
    
                    })

                }
                
                if(codDoc==='NE'){
                    notaEntregaSvc.anular(id, $scope.dataObservaciones).then(response => {
                        if (response.code === "0") {
                            fS.sweetAlert("warning", response.message);
                        }
                        if (response.code === "1") {
                            fS.sweetAlert(
                                "success",
                                response.message, '', 1000
                            );
                            $ctrl.close({
                               $value:{
                                esAnulado: true
                               }
                            });
                        }
    
                    }).catch(error => { 
                        console.log(error);
                    }) 
                }


            }

            $ctrl.cancel = function () {
                $ctrl.dismiss();
            };

        },
    ],
});
