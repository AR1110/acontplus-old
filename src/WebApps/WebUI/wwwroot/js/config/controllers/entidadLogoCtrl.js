(function () {
    'use strict';
    angular.module('acontPlusApp')
        .controller('entidadLogoCtrl', entidadLogoCtrl);

    entidadLogoCtrl.$inject = ['$scope', 'mainService', 'toastService'];

    function entidadLogoCtrl($scope, mS, tS) {
        // let accion = JSON.parse(localStorage.getItem("accion"));
        // if(accion===null){
        //     location.href = "/Home/Index";
        // }else{
        //     $scope.accion = accion[0];
        // }

        var url = '/EntidadLogo/';
        $scope.logo = {};

        $scope.entidades = []; 
        $scope.logos = [];

        $scope.tipoOperacion = 0; 

        $scope.file = '';
         
        $scope.openModal = function (data = null, type) {
            $scope.tipoOperacion = type;
            if (type == 1) {
                $('#logoModal').modal('show');
                return;
            };
            if (type == 2) {                
                $scope.logo = data;                
                let blob = new Blob([data.imagen], { type: data.mimeType });
                let file = new File([blob], data.nombreImagen);
                $scope.file = file;
                $('#logoModal').modal('show');
                return;
            };
        };

        $scope.initialLoad = function () {
            mS.getData('get', '/Entidad/OptionEntidad').then(function (response) {                
                $scope.entidades = response.data;
            }, error=>console.log(error));

            mS.getData('get', url + 'Get').then(function (response) {
                if (response.id == 0) {
                    tS.toastr('warning', response.message, response.titleSms);
                    return;
                }
                $scope.logos = response.data;
                return
            }, error=>console.log(error));
        };
        $scope.initialLoad();

        $scope.save = function () {
            let method = $scope.tipoOperacion===1?'Post':'Put';                        
            let file = $scope.file;
            if (file == null || file == undefined) {
                tS.toastr('warning', 'Por favor suba el archivo del logo');
                return  
            };
           
            mS.getDataFile(url + method, file, $scope.logo).then(function (response) {
                if (response.id == 0) {
                    tS.toastr('warning', response.message, response.titleSms);
                    return;
                };
                if (response.id == 1) {
                    $scope.logo = {};
                    $scope.initialLoad();
                    $('#logoModal').modal('hide');
                    tS.toastr('success', response.message, response.titleSms);
                    return;
                }
            }, error=>console.log(error));
        };

        $scope.put = function () {
            mS.getData('put', url + 'Put', $scope.logo).then(function (response) {
                if (response.id == 0) {
                    tS.toastr('warning', response.message, response.titleSms);
                    return;
                };
                if (response.id == 1) {
                    $scope.logo = {};
                    $scope.initialLoad();
                    $('#modalUpdate').modal('hide');
                    tS.toastr('success', response.message, response.titleSms);
                    return;
                };
            }, error=>console.log(error));
        };

        $scope.askToDelete = function (item) {            
            Swal.fire({
                icon: 'warning',
                text: 'Esta seguro/a de eliminar este logo ahora?',
                showDenyButton: true,
                confirmButtonText: `Si`,
                denyButtonText: `No`,
                allowOutsideClick: false
            }).then(result => {
                if (result.isConfirmed) {
                    $scope.delete(item);
                    return;
                };
            });
            return;
        };

        $scope.delete = function (item) {
            mS.getData('delete', url + 'Delete?id=' + item.logo.idEntidadLogo).then(response=>{
                if (response.id == 0) {
                    tS.toastr('warning', response.message, response.titleSms);
                    return;
                };
                if (response.id == 1) {                    
                    $scope.initialLoad();
                    $('#logoModal').modal('hide');
                    tS.toastr('success', response.message, response.titleSms);
                    return;
                }
            }, error=>console.log(error));
        };
    };
})(window.angular)