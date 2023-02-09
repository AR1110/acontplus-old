app.controller('tipoClienteProveedorCtrl', tipoClienteProveedorCtrl);

tipoClienteProveedorCtrl.$inject = ['$http', '$scope', 'formulario'];

function tipoClienteProveedorCtrl($http, $scope, form) {
    'use strict';
    let accion = JSON.parse(localStorage.getItem("accion"));
    if(accion===null){
        location.href = "/Home/Index";
    }else{
        $scope.accion = accion[0];
    }
    
    $scope.data = {};
    $scope.tipoPersona = {};
    $scope.tipoPersonas = [];

    $scope.maxSize = 5;
    $scope.totalRecords = 0;
    $scope.pageIndex = 1;
    $scope.pageSize = 10;
    $scope.recordsQuantity = [5, 10, 25, 50]

    $scope.initiload = async()=>{
        const {data:response} = await $http.post('/TipoClienteProveedor/Get?pageIndex=' + $scope.pageIndex + '&pageSize=' + $scope.pageSize, { tipoValidacion: 'G' });
        if (response.id == "0") {
            toastr.success(response.message, response.titleSms, {positionClass: 'toast-bottom-center'})
            return
        }
        $scope.tipos = response.data;        
        $scope.totalRecords = $scope.tipos.length>0? $scope.tipos[0].totalRecords:0;

        $scope.tipoPersonas = await $http.get('/TipoPersona/ReadTipoPersona').then(({data:response})=>response.data)

    }
   
    $scope.initiload();

    $scope.pagechanged = ()=> $scope.initiload();    

    $scope.changePageSize = ()=> {
        $scope.pageIndex = 1;
        $scope.initiload();
    }

    $scope.abrirModal = (data, tipo) => {
        $scope.tipo = tipo;
        $scope.colorHeader = tipo == 1 ? 'bg-info' : 'bg-success';
        $scope.iconoModal = tipo == 1 ? 'fa fa-plus-circle' : ' fa fa-edit';
        $scope.tituloModal = tipo == 1 ? ' Agregar Tipo C/P' : ' Actualizar Tipo C/P';
        $scope.btnModal = tipo == 1 ? 'Guardar' : ' Actualizar';
        $scope.icono = tipo == 1 ? 'fa fa-save 5x' : 'fa fa-edit 5x';
        $scope.data = tipo == 1 ? {} : data;
        $scope.tipoPersona = tipo == 1 ? {} : data.tipoPersona;
        $("#agregar").modal('show');        
    }

    $scope.obtenerTresLetras = data => {
        if(form.campo(data.descripcion)) return
        $scope.data.codigo = form.obtenerTresLetras(data.descripcion);        
    }

    $scope.saveUpdate = async(type) => {
        if (form.campo($scope.data.descripcion)) {
            toastr.success('Por favor, ingrese la Descripción', $scope.tituloModal);
            return;
        }
        if (form.campo($scope.data.codigo)) {
            toastr.success('Por favor, ingrese el Código', $scope.tituloModal);
            return;
        }
        if (form.campo($scope.tipoPersona.idTipoPersona)) {
            toastr.success('Por favor, seleccione el Tipo Persona', $scope.tituloModal);
            return;
        }

        $scope.data.tipoPersona = $scope.tipoPersona;
        const url = type === 1 ? '/TipoClienteProveedor/Post' : '/TipoClienteProveedor/Put';
        
        let {data:response} = await $http.post(url, $scope.data);
        if (response.id == "0") {
            toastr.warning(response.message, response.titleSms, {positionClass: 'toast-bottom-center'})            
        }
        if (response.id == "1") {            
            toastr.success(response.message, response.titleSms, {positionClass: 'toast-bottom-center'})            
            $("#agregar").modal('hide');            
        }        
    }

    $scope.delete = async(idTipoCP) => {
        let {isConfirmed} = await Swal.fire({
            icon: 'warning',
            html: '<small>Esta seguro/a de eliminar este Tipo Cliente/Proveedor?</small> ',
            showConfirmButton: true,
            confirmButtonText: 'Si,eliminar!',
            showCancelButton: true,
            cancelButtonText: 'No,cancelar',
            allowOutsideClick: false
        })

        if(isConfirmed){
            const {data:response} = await $http.post('/TipoClienteProveedor/Delete?idTipoCP=' + idTipoCP);
            if (response.id === "0") {
                toastr.warning(response.message, response.titleSms, {positionClass: 'toast-bottom-center'})                
            }
            if (response.id == "1") {
                $scope.initiload();
                toastr.success(response.message, response.titleSms, {positionClass: 'toast-bottom-center'})                                                
            }
            
        }          
    }



    $("#agregar").on('hide.bs.modal', e => {  
        $scope.initiload();
        $scope.data = {};
        $scope.tipoPersona = {};
    })

}