(function(){

    'use strict';

    let url = 'Config/Entidad/';
    let mS = '';
    let tS = {};

    app.controller('entidadCtrl', entidadCtrl);

    entidadCtrl.$inject = ['$scope', '$injector', 'modalService', 'decodeToken'];

    function entidadCtrl($scope, $injector, _modalSvc, decodeToken) {
        // let accion = JSON.parse(localStorage.getItem("accion"));
        // if(accion===null){
        //     location.href = "/Home/Index";
        // }else{
        //     $scope.accion = accion[0];
        // } 
        mS = $injector.get('mainService');
        tS = $injector.get('toastService');


        let idUsuarioRol = parseInt(decodeToken.idUsuarioRol);

        const json = {
            idRol: idUsuarioRol
        }


        $scope.maxSize = 5;
        $scope.totalRecords = 0;
        $scope.pageIndex = 1;
        $scope.pageSize = 900000000;
        $scope.recordsQuantity = [5, 10, 25, 50]

        $scope.getEntidades = function () {
            try {
                showLoader();
                $scope.entidades = [];

                mS.getData('get', url + 'Get?json=' + JSON.stringify(json), null, true).then(response => {
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



        $scope.openModal = function (item) {
            try {
                const modalRef = _modalSvc.openModalCustom({
                    controller: 'ModalEntidadCtrl',
                    template: '~/Pages/Entidad/Shared/_ModalEntidad.cshtml',
                    size: 'lg',
                    params: item,
                    isRenderRazorPartial: true
                });
                modalRef.result.then(result => {
                    if (typeof result === 'object') {
                        $scope.getEntidades();
                    }
                })

            } catch (error) {
                console.log(error)
            }                       
        };

        $scope.openModalConfigSri = function (item) {
            try {
                const modalRef = _modalSvc.openModalCustom({
                    controller: 'ModalEntidadCtrl',
                    template: '~/Pages/Entidad/Shared/_ModalEntidadConfigSri.cshtml',
                    size: 'lg',
                    params: item,
                    isRenderRazorPartial: true
                });
                modalRef.result.then(result => {
                    if (typeof result === 'object') {
                        $scope.getEntidades();
                    }
                })
            } catch (error) {
                console.log(error)
            }           
        }

        $scope.askToDelete = function (idEntidad) {
            try {
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
                        showLoader();
                        mS.getData('post', url + 'Delete?idEntidad', idEntidad).then(response=>{
                            hideLoader();
                            if (response.id == "0") {
                                tS.toastr('warning', response.message, response.titleSms);
                                return
                            }
                            if (response.id == "1") {
                                tS.toastr('success', response.message, response.titleSms);
                                $scope.getEntidades();
                            }
                        }).catch(error=>{
                            hideLoader();
                            console.log(error)
                        })
                    }
                })            
            } catch (error) {
                hideLoader();
                console.log(error)            
            }
        }
    }



    app.controller('ModalEntidadCtrl', ModalEntidadCtrl);

    
    ModalEntidadCtrl.$inject = ['$scope', '$q','$uibModalInstance', 'params'];

    function ModalEntidadCtrl($scope, $q, $uibModalInstance, params) {
    
        //let _eSvc             =  new EntidadService($http, _commonSvc);
        $scope._params = params;
        $scope.fecha = new Date();
        $scope.anio = $scope.fecha.getFullYear() + '';

        $scope.data = {};
        $scope.tipoRegistro = 1;
        $scope.data.obligadoLlevarContabilidad = false;
        $scope.COD_NORMATIVA_REGIMEN_RETENCION = 'R'

        $scope.initiload = async function () {
            try {
                const idEntidad = params ? params.idEntidad : 0;

                showLoader();
                const results = await $q.all([
                    mS.getData('get', '/SubContribuyente/OptionSubContribuyente').then(res => res.data),
                    mS.getData('get', '/Ciudad/ReadCiudadProvincia').then(res => res.data),
                    mS.getData('get', `EntidadConfigSri/Get?json=${JSON.stringify({idEntidad})}`, null, true)
                ])
                

                $scope.subContribuyentes = results[0];
                $scope.ciudadPronvincias = results[1];
                // $scope.anioFiscales = results[3];
                // $scope.data.idAnioFiscal = $scope.anioFiscales.find(val => val.descripcion === $scope.anio).idAnioFiscal;

                if (params) {
                    $scope.data = params;
                    $scope.tipoRegistro = 2;
                }

                //Datos relacionados al SRI 
                if (params && params.hasOwnProperty('isConfigSri')) {
                    const dataEntidadSri = JSON.parse(results[4].payload);
                    $scope.data = dataEntidadSri[0][0] || {};
                    $scope.regimenes = dataEntidadSri[1];
                }

                hideLoader();
            } catch (error) {
                hideLoader();
                console.error(error)
            }

            $uibModalInstance.rendered.then(() => {
                $("input[name='ruc']").focus();
            })
        }

        $scope.initiload();

        $scope.validarRuc = function () {
            if (!!$scope.data.ruc) {
                $scope.typeNotify = 'is-invalid';
                $scope.message = 'Número de RUC debe tener 13 dígitos';
                $scope.id = 0;

                if ($scope.data.ruc.length == 13) {
                    mS.getData('post', '/ValidarDatos/VerificarDatos', {
                        tipoValidacion: 'IDENTI',
                        numeroIdentificacion: $scope.data.ruc
                    }).then(response => {
                        $scope.formValid = response.id;
                        $scope.typeNotify = response.typeNotify;
                        $scope.message = response.message;
                    })
                }
            };
        }

        $scope.validarRetencionRegimen = function (item) {
            // if(!item.estado && item.codNormativa==='AR'){
            //     item.descripcion =""
            //     return
            // }
            if (item.estado && item.codNormativa === $scope.COD_NORMATIVA_REGIMEN_RETENCION && $scope.data.idSubContribuyente > 0) {
                item.descripcion = $scope.subContribuyentes.find(
                    item => item.subContribuyente.idSubContribuyente === $scope.data.idSubContribuyente
                ).tipoContribuyente.descripcion
            }
        }




        $scope.saveUpdate = function () {
            try {
                let tituloModal = $scope.tipoRegistro === 1 ? 'Guardar' : 'Actualizar';

                if (!$scope.data.ruc) {
                    tS.toastr('warning', 'Ingrese el nuúmero de RUC', tituloModal);
                    return;
                }

                if ($("#ruc").hasClass('is-invalid')) {
                    tS.toastr('warning', 'Ingrese el número de RUC válido', tituloModal);
                    return;
                }

                if (!$scope.data.razonSocial) {
                    tS.toastr('warning', 'Ingrese la Razón Social', tituloModal)
                    return
                }
                if (!$scope.data.nombreComercial) {
                    tS.toastr('warning', 'Ingrese el Nombre Comercial', tituloModal)
                    return
                }

                $scope.data.idCiudad = $scope.data.idCiudad ? $scope.data.idCiudad : 0


                let enpPoint = $scope.tipoRegistro === 1 ? url +'Create' : `${url}Update/${$scope.data.idEntidad}`;
                let method = $scope.tipoRegistro == 1 ? 'post' : 'put';
                showLoader();
                mS.getData(method, enpPoint, $scope.data, true).then(response => {
                    hideLoader();                     
                    if (response.id === "0" || response.code === "0") {
                        tS.toastr('warning', response.message)
                    }
                    if (response.id === "1" || response.code === "1") {                    
                        tS.toastr('success', response.message)
                    }
                    $uibModalInstance.close(response)
                }).catch(error => {
                    hideLoader();
                    console.log(error);
                })

            } catch (error) {
                hideLoader();
                toastr.error(error)
            }
        }

        $scope.onChangeSubContribuyente = function () {
            for (let item of $scope.regimenes) {
                if (item.codNormativa === $scope.COD_NORMATIVA_REGIMEN_RETENCION) {
                    item.descripcion = $scope.subContribuyentes.find(
                        item => item.subContribuyente.idSubContribuyente === $scope.data.idSubContribuyente
                    ).tipoContribuyente.descripcion.toUpperCase()

                }
            }
        }

        $scope.saveConfigSri = function () {
            if (!$scope.data.idSubContribuyente) {
                tS.toastr('warning', 'Seleccione el Contribuyente')
                return
            }

            if (!$scope.data.nroContribuyente) {
                if ($scope.data.nroContribuyente.length < 3) {
                    tS.toastr('warning', 'El Nro Contribuyente Especial número mínimo es de 3');
                    return
                }
            }

            if (!$scope.data.idAnioFiscal) {
                tS.toastr('warning', 'Seleccione el Año Fiscal');
                return;
            }

            if ($scope.regimenes.some(item => item.estado && item.codNormativa === 'AR' && !item.descripcion)) {
                tS.toastr('warning', 'Ingrese la Descripción de Agente de Retención');
                return
            }

            let data = {
                jsonHeader: JSON.stringify($scope.data),
                jsonDetail: JSON.stringify($scope.regimenes)
            }

            showLoader();
            mS.getData('put', `EntidadConfigSri/Update/${$scope.data.idEntidadConfigSri}`, null, true).then(response => {
                if (response.id == "0" || response.code == "0") {
                    hideLoader();
                    tS.toastr('warning', response.message, response.titleSms);
                };
                if (response.id == "1" || response.code == "1") {
                    hideLoader();
                    tS.toastr('success', response.message, response.titleSms);
                    $uibModalInstance.close(response)
                }
            }).catch(error => {
                hideLoader();
                console.error(error)
            })
        }

        $scope.closeModal = function () {
            $uibModalInstance.close();
        }
    }



})(window.angular)