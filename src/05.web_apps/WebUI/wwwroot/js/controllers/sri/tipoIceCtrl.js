app.controller('tipoIceCtrl', tipoIceCtrl);

tipoIceCtrl.$inject = ['$http', '$scope', 'mainService', 'toastService', 'formulario'];

function tipoIceCtrl($http, $scope, mS, toast, form) {
    $scope.data = {};
    $scope.actividadEmpresa = {};
    $scope.actividadesEmpresa = [];
    $scope.tipoIces = [];

    $scope.maxSize = 5;
    $scope.totalRecords = 0;
    $scope.pageIndex = 1;
    $scope.pageSize = 10;
    $scope.recordsQuantity = [5, 10, 25, 50]


    $scope.initiload = async()=> {
        const {data:response} = await $http.get('/TipoIce/get?pageIndex=' + $scope.pageIndex + '&pageSize=' + $scope.pageSize)        
        if (response.id == "0") {
            toastr.warning(response.message, response.titleSms, {positionClass: 'toast-bottom-center'}) 
            return
        }
        $scope.tipoIces = response.data;
        $scope.totalRecords = $scope.tipoIces.length>0? $scope.tipoIces[0].totalRecords:0
        
        $scope.actividadesEmpresa = await $http.get("/ActividadEmpresa/GetAll").then(({data:response})=>response.data)

    }
    $scope.initiload();

    $scope.pagechanged = ()=> $scope.initiload();    
    $scope.changePageSize = function() {
        $scope.pageIndex = 1;
        $scope.initiload();
    }

    $scope.abrirModal = function(data, type) {
        $scope.type = type;
        $scope.colorHeader = type == 1 ? 'bg-info' : 'bg-success';
        $scope.iconoModal = type == 1 ? 'fa fa-plus' : 'fa fa-edit';
        $scope.tituloModal = type == 1 ? ' Agregar Tipo Ice' : 'Actualizar Tipo Ice';
        $scope.btnTitulo = type == 1 ? 'Guardar' : ' Actualizar';
        $scope.btnColor = type == 1 ? ' btn-info' : ' btn-success';
        $scope.icono = type == 1 ? 'ti-save' : 'fa fa-edit';
        $scope.data = type == 1 ? {} : data;
        $scope.actividadEmpresa = type == 1 ? {} : data.actividadEmpresa;
        $('#agregarTipoIce').modal('show');        
    }


    $scope.saveUpdate = async(type)=>{
        if (form.campo($scope.data.codigo)) {
            toast.toastr('warning', 'Por favor, ingrese el Código', $scope.tituloModal);
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
        if ([null, undefined, ""].includes($scope.data.valor)) {
            toast.toastr('warning', 'Por favor, ingrese el Valor', $scope.tituloModal);
            return;
        }
        if (form.campo($scope.actividadEmpresa.idActividadEmpresa)) {
            toast.toastr('warning', 'Por favor, seleccione el Actividad de la Empresa', $scope.tituloModal);
            return;
        }
        $scope.data.actividadEmpresa = $scope.actividadEmpresa;
        let url = type == 1 ? '/TipoIce/Post' : '/TipoIce/Put';
        
        let {data:response} = await $http.post(url, $scope.data)
        
        if (response.id == "0") {
            toast.toastr('warning', response.message, response.titleSms);
            return
        }
        if (response.id == "1") {
            toast.toastr('success', response.message, response.titleSms);
            $("#agregarTipoIce").modal('hide');                
        }        
    }

    $scope.delete = async(item)=> {
        let {isConfirmed} = await Swal.fire({
            icon: 'warning',
            html: `<small>Esta seguro/a de eliminar este Tipo ICE ahora?</small>`,
            showConfirmButton: true,
            confirmButtonText: 'Si, eliminar',
            showCancelButton: true,
            cancelButtonText: 'No, cancelar',
            allowOutsideClick: false
        })
                
        if (isConfirmed) {
            const {data:response} = await $http.post('/TipoIce/Delete?idTipoIce=' + item.idTipoIce)
            if (response.id == "0") {
                toast.toastr('warning', response.message, response.titleSms);
                return
            }
            if (response.id == "1") {
                $scope.initiload();                    
                toast.toastr('success', response.message, response.titleSms);
            }            
        }        
    }

    $("#agregarTipoIce").on("hide.bs.modal", e => {
        $scope.data = {}
        $scope.actividadEmpresa = {};
        $scope.initiload();
    })


}
