app.controller('impuestoCtrl', impuestoCtrl);

impuestoCtrl.$inject = ['$http', '$scope', 'mainService', 'toastService', 'formulario'];

function impuestoCtrl($http, $scope, mS, toast, form) {
    $scope.showImpuestoRentaV1 = false;
    if(!$scope.showImpuestoRentaV1){
        return;
    }
    

    // let accion = JSON.parse(localStorage.getItem("accion"));
    // if (accion === null) {
    //     location.href = "/Home/Index";
    // } else {
    //     $scope.accion = accion[0];
    // }


    $scope.data = {};
    $scope.impuestos = [];
    $scope.tipoImpuestos = [];


    $scope.maxSize = 5;
    $scope.totalRecords = 0;
    $scope.pageIndex = 1;
    $scope.pageSize = 10;
    $scope.recordsQuantity = [5, 10, 25, 50]

    $scope.get = () => {
        mS.getData('get', '/ImpuestoRenta/Get?pageIndex=' + $scope.pageIndex + '&pageSize=' + $scope.pageSize).then(response => {
            if (response.id == "0") {
                toast.toastr('warning', response.message, response.titleSms);
                return
            }

            $scope.impuestos = response.data;
            $scope.totalRecords = $scope.impuestos[0].totalRecords;
        }, error => console.log(error))
    }
    $scope.get();

    $scope.pagechanged = () => {
        $scope.get();
    }

    $scope.changePageSize = () => {
        $scope.pageIndex = 1;
        $scope.get();
    }

    $scope.optionTipoImpuesto = () => {
        mS.getData('GET', '/TipoImpuesto/OptionTipoImpuesto').then(response => {
            if (response.id == "0") {
                toast.toastr('warning', response.response, response.titleSms);
                return
            }
            $scope.tipoImpuestos = response.data;
        }, error => console.log(error))
    }
    $scope.optionTipoImpuesto();

    $scope.abrirModal = ({ retencionRenta: data }, tipo) => {
        $scope.tipo = tipo;
        $scope.colorHeader = tipo == 1 ? 'bg-info' : 'bg-success';
        $scope.iconoModal = tipo == 1 ? 'fa fa-plus' : 'fa fa-edit';
        $scope.tituloModal = tipo == 1 ? ' Agregar Impuesto' : ' Actualizar Impuesto';
        $scope.btnTitulo = tipo == 1 ? 'Guardar' : 'Actualizar';
        $scope.btnColor = tipo == 1 ? 'btn-info' : ' btn-success';
        $scope.icono = tipo == 1 ? 'ti-save' : 'fa fa-edit';
        // $scope.tipoImpuesto = tipo == 1 ? {} : data;
        $scope.data = tipo == 1 ? {} : data;
        $('#agregarImpuesto').modal('show');
        return;
    }


    $scope.saveUpdate = function (tipo) {
        if (form.campo($scope.data.idTipoImpuestoRenta)) {
            toast.toastr('warning', 'Por favor, seleccione el Tipo Impuesto', $scope.tituloModal);
            return;
        }
        if (form.campo($scope.data.codigoAnexo)) {
            toast.toastr('warning', 'Por favor, ingrese el Código Anexo', $scope.tituloModal);
            return;
        }
        if (form.campo($scope.data.descripcion)) {
            toast.toastr('warning', 'Por favor, ingrese la Descripción', $scope.tituloModal);
            return;
        }
        if (form.campo($scope.data.porcentaje)) {
            toast.toastr('warning', 'Por favor, ingrese el Porcentaje', $scope.tituloModal);
            return;
        }
        if (form.campo($scope.data.campoFormulario103)) {
            toast.toastr('warning', 'Por favor, ingrese el Campo Formulario 103', $scope.tituloModal);
            return;
        }

        const url = tipo == 1 ? '/ImpuestoRenta/Post' : '/ImpuestoRenta/Put?id=' + $scope.data.idRetencionRenta;
        $http({
            method: tipo === 1 ? 'post' : 'put',
            url: url,
            data: $scope.data
        }).then(({ data: response }) => {
            if (response.id == "0") {
                toast.toastr('warning', response.message, response.titleSms);
                return
            }
            if (response.id == 1) {
                toast.toastr('success', response.message, response.titleSms);
                $scope.get();
                $("#agregarImpuesto").modal('hide');
            }

        })
    }

    //Delete Impuesto
    $scope.delete = function ({ idRetencionRenta }) {
        Swal.fire({
            icon: 'warning',
            html: `<small>Esta seguro/a de eliminar este Impuesto ahora?</small>`,
            showConfirmButton: true,
            confirmButtonText: 'Si, eliminar',
            showCancelButton: true,
            cancelButtonText: 'No, cancelar',
            allowOutsideClick: false
        }).then((result) => {
            if (result.isConfirmed) {
                mS.getData('delete', '/ImpuestoRenta/Delete?id=' + idRetencionRenta).then(response => {
                    if (response.id == "0") {
                        toast.toastr('warning', response.message, response.titleSms, 'toast-top-center');
                        return
                    }
                    if (response.id == "1") {
                        toast.toastr('success', response.message, response.titleSms, 'toast-top-center');
                        $scope.get();
                        return
                    }
                }, error => console.log(error))
            }
        })
    }



    $("#agregarImpuesto").on("hide.bs.modal", e => {
        $scope.data = {};
        $scope.get();
    })

}



