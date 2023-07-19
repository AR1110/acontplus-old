(function() {
    'use strict';

    app.controller('tarifaCtrl', tarifaCtrl);

    tarifaCtrl.$inject = ['$scope', 'tarifaService', 'toastService'];

    function tarifaCtrl($scope, tarifaSvc, tS) {
        // let accion = JSON.parse(localStorage.getItem("accion"));
        // if(accion===null){
        //     location.href = "/Home/Index";
        // }else{
        //     $scope.accion = accion[0];
        // }
        
        
        $scope.data = {};
        $scope.tarifas = [];

        $scope.dataSearch = {
            pageIndex: 1,  
            pageSize: 5
        };
        //Paginacion 
        $scope.totalRecords = 0;
 

        $scope.getTarifas = function() {
            try {
                $scope.tarifas = [];
                tarifaSvc.getAll($scope.dataSearch).then(response => {
                    $scope.tarifas = response;
                    $scope.totalRecords = $scope.tarifas.length > 0 ? $scope.tarifas[0].totalRecords : 0;
                })
            } catch (error) {
                hideLoader();
                console.log(error);
            }       
        }

        $scope.getTarifas();

        $scope.abrirModal = function(data, type) {
            $scope.type = type;
            $scope.tituloModal = type == 1 ? 'Agregar Tarifa' : 'Actualizar Tarifa';
            $scope.iconoModal = type == 1 ? 'fa fa-plus-circle' : 'fa fa-edit';
            $scope.icono = type == 1 ? 'ti-save' : ' fa fa-edit';
            $scope.btnModal = type == 1 ? 'Guardar' : 'Actualizar';
            $scope.data = type == 1 ? {} : Object.assign({}, data);
            $("#agregar").modal('show');
        }
        $scope.$watch("data.descripcion", function(des) {
            if (des && $scope.type == 1) {
                $scope.data.codigo = des.substring(0, 3);  
            }
        })

        $scope.saveUpdate = function(type) {
            if (!$scope.data.descripcion) {
                tS.toastr('warning', 'Por favor, ingrese la Descripción', $scope.tituloModal);
                return;
            }
            //if (form.campo($scope.data.codigo)) {
            //    toast.toastr('warning','Por favor, ingrese el Código', $scope.tituloModal);
            //    return;
            //}
            showLoader();

            if($scope.data.idTarifa > 0){
                tarifaSvc.update($scope.data.idTarifa, $scope.data).then($scope.successReponse)
                .catch(err => {
                    hideLoader();
                    console.log(err);
                }).catch(err => {
                    hideLoader();
                    console.log(err);
                })
            }
        }

        
        $scope.successReponse = function(response) {
            hideLoader();
            if (response.code==='0') {
                tS.toastr('warning', response.message, response.titleSms);            
            }
            if (response.code==='1') {
                tS.toastr('success', response.message, response.titleSms);
                $("#agregar").modal('hide');                            
               $scope.getTarifas();
            }
        }

        $scope.delete = function({ idTarifa }) {
            try {
                Swal.fire({
                    icon: 'warning',
                    html: `<small>Esta seguro/a de eliminar este Tarifa ahora?</small>`,
                    showConfirmButton: true,
                    confirmButtonText: 'Si, eliminar',
                    showCancelButton: true,
                    cancelButtonText: 'No, eliminar',
                    allowOutsideClick: false
                }).then(result => {
                    if (result.isConfirmed) {
                        showLoader();
                        tarifaSvc.delete(idTarifa).then(response => {
                            hideLoader();
                            if (response.code == "0") {
                                tS.toastr('warning', response.message, response.titleSms);                         
                            }
                            if (response.code == "1") {
                                tS.toastr('success', response.message, response.titleSms);
                                $scope.getTarifas();
                            }
                        }).catch(error => {
                            hideLoader();
                            console.log(error);
                        })
                    }
                })
            } catch (error) {
                hideLoader();
                console.log(error);
            }
        }



        $(".modal").on('hide.bs.modal', function(e) {
           
            $scope.data = {};
        })
    }
})(window.angular);