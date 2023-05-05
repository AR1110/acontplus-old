/**
 * Type Url:
 * 1=>Ip Local
 * 2=>Ip Servidor
 */
app.controller('entidadCtrl', entidadCtrl);

entidadCtrl.$inject = ['$scope', 'mainService', 'commonService', 'modalService', 'toastService', 'decodeToken'];

function entidadCtrl($scope, mS, _commonSvc, _modalSvc, toast, decodeToken) {
    // let accion = JSON.parse(localStorage.getItem("accion"));
    // if(accion===null){
    //     location.href = "/Home/Index";
    // }else{
    //     $scope.accion = accion[0];
    // }        


    let idUsuarioRol = parseInt(decodeToken.idUsuarioRol);

    const json = {
        idRol: idUsuarioRol
    }
    console.log(json)

    $scope.maxSize = 5;
    $scope.totalRecords = 0;
    $scope.pageIndex = 1;
    $scope.pageSize = 900000000;
    $scope.recordsQuantity = [5, 10, 25, 50]

    $scope.getEntidades = function () {
        try {
            showLoader();
            $scope.entidades = [];

            mS.getData('get', 'Entidad/Get?json=' + JSON.stringify(json), null, true).then(response => {
                console.log(response)
                if (response.code === "0") {
                    hideLoader();
                }
                if (response.code === "1") {
                    $scope.entidades = JSON.parse(response.payload)
                    $scope.totalRecords = $scope.entidades.length > 0 ? $scope.entidades[0].totalRecords : 0
                    hideLoader();
                }
            }).catch(error => {
                hideLoader();
                console.log(error)
            })
        } catch (error) {
            hideLoader();
            console.log(error);
        }
    }
    $scope.getEntidades();



    $scope.openModal = async (item) => {
        const {
            ModalEntidadCtrl
        } = await import('../../modal/admin/modalEntidadCtrl.min.js' + CHANGE_VERSION());
        const modalRef = _modalSvc.openModalCustom({
            controller: ModalEntidadCtrl,
            template: 'Entidad/_ModalEntidad.cshtml',
            size: 'lg',
            params: item
        });
        modalRef.result.then(result => {
            if (typeof result === 'object') {
                $scope.getEntidades();
            }
        })
    };

    $scope.openModalConfigSri = async (item) => {
        const data = Object.assign({}, item)
        data.isConfigSri = true;
        const {
            ModalEntidadCtrl
        } = await import('../../modal/admin/modalEntidadCtrl.min.js' + CHANGE_VERSION());
        const modalRef = _modalSvc.openModalCustom({
            controller: ModalEntidadCtrl,
            template: 'Entidad/_ModalEntidadConfigSri.cshtml',
            size: 'lg',
            params: data
        });
        modalRef.result.then(result => {
            if (typeof result === 'object') {
                $scope.getEntidades();
            }
        })
    }

    $scope.askToDelete = function (idEntidad) {
        Swal.fire({
            icon: 'warning',
            html: '<small>Esta seguro de elimnar este registro ahora?</small>',
            showCancelButton: true,
            cancelButtonText: 'No, cancelar',
            showConfirmButton: true,
            confirmButtonText: 'Si, eliminar',
            allowOutsideClick: false
        }).then(result => {
            if (result.isConfirmed) {
                $scope.postDelete(idEntidad);
            }
        })
    }

    $scope.postDelete = async (idEntidad) => {
        const {
            response
        } = await mS.getData('post', '/Entidad/Delete?idEntidad', idEntidad)
        if (response.id == "0") {
            toast.toastr('warning', response.message, response.titleSms);
            return
        }
        if (response.id == "1") {
            toast.toastr('success', response.message, response.titleSms);
            $scope.getEntidades();
        }
    }
}