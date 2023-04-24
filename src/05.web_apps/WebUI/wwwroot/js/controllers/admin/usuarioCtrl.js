(() => {

    const MODAL_PATH_PARTIAL = {
        modal_nuevo: 'Usuario/_ModalNuevo.cshtml',
        modal_editar: 'Usuario/_ModalEditar.cshtml',
        modal_user_config: "Usuario/_ModalUserConfig.cshtml",
        modal_asign_punto_emision_bodega: 'Usuario/_ModalAsignPtoEmisionBodega.cshtml'
    }

    let Id_Usuario_Rol = 0;
    let role = null;


    app.controller('usuarioCtrl', usuarioCtrl);

    usuarioCtrl.$inject = ['$scope', 'mainService', 'commonService', 'modalService', 'toastService', 'decodeToken'];

    function usuarioCtrl($scope, _mS, _commonSvc, _modalSvc, toast, decodeToken) {
        // let accion = JSON.parse(localStorage.getItem("accion"));
        // if(accion===null){
        //     location.href = "/Home/Index";
        // }else{
        //     $scope.accion = accion[0];
        // }        
        Id_Usuario_Rol = parseInt(decodeToken.idUsuarioRol);
        role = decodeToken.role;

        $scope.dataSearch = {
            idRol: Id_Usuario_Rol,
            pageIndex: 1,
            pageSize: 100
        }

        $scope.maxSize = 5;
        $scope.totalRecords = 0;
        $scope.recordsQuantity = [5, 10, 25, 50];

        $scope.getUsuarios = function () {
            try {

                showLoader();
                $scope.usuarios = [];
                _mS.getData('get', 'Usuario/' + JSON.stringify($scope.dataSearch), null, true).then(response => {
                    if (response.code === "0") {
                        hideLoader();
                        console.log(response)
                    }
                    if (response.code === "1") {
                        $scope.usuarios = JSON.parse(response.payload) || [];
                        hideLoader();
                    }
                }).catch(error => {
                    hideLoader();
                    console.log(error);
                })
            } catch (error) {
                hideLoader();
                console.log(error)
            }

        }


        $scope.getUsuarios();


        $scope.pagechanged = function () {
            $scope.getUsuarios()
        }

        $scope.changePageSize = function () {
            $scope.dataSearch.pageIndex = 1;
            $scope.getUsuarios();
        }

        $scope.openModalUserNew = () => {
            let params = {
                tipoRegistro: 'N'
            }
            $scope.openModalParam({
                controller: 'modalUserCtrl',
                template: MODAL_PATH_PARTIAL.modal_nuevo,
                params
            })
        }

        $scope.openModalUserEdit = async (item) => {
            let params = {
                data: item,
                tipoRegistro: 'E'
            }
            $scope.openModalParam({
                controller: 'modalUserCtrl',
                template: MODAL_PATH_PARTIAL.modal_editar,
                params,
                size: 'md'
            })
        }

        $scope.openModalParam = async ({
            controller,
            template,
            size = 'lg',
            params,
            isReloading = true
        }) => {
            _modalSvc.openModalCustom({
                controller,
                template,
                size,
                params
            }).result.then(result => {
                if (typeof result === 'object') {
                    $scope.getUsuarios();
                }
            })
        }

        $scope.askToDelete = async (item) => {
            try {
                const swalWithBootstrapButtons = Swal.mixin({
                    customClass: {
                        confirmButton: 'btn btn-success',
                        cancelButton: 'btn btn-danger ml-2'
                    },
                    buttonsStyling: false
                })

                let {
                    isConfirmed
                } = await swalWithBootstrapButtons.fire({
                    title: '<small>Eliminar Usuario</small>',
                    html: "<small>Este proceso no puedes revertir!</small>",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: 'Si, eliminar!',
                    cancelButtonText: 'No, cancelar!',
                    reverseButtons: false,
                    allowOutsideClick: false
                })

                if (isConfirmed) {
                    _mS.getData('delete', 'Usuario/' + item.idUsuario, null, true).then(response => {
                        if (response.id == "0") {
                            toast.toastr('warning', response.message, response.titleSms);
                        }
                        if (response.id == "1") {
                            toast.toastr('success', response.message, response.titleSms);
                            $scope.getUsuarios();
                        }
                    })
                }
            } catch (error) {
                console.log(error)
            }
        }



        $scope.openModalUserConfig = async (params) => {
            try {
                $scope.openModalParam({
                    controller: 'modalUserConfigCtrl',
                    template: MODAL_PATH_PARTIAL.modal_user_config,
                    params,
                    size: 'xl'
                })
            } catch (error) {

            }
        }
    }




    //----------------------------------START ADD-UPDATE USER----------------------------------------------
    app.controller("modalUserCtrl", modalUserCtrl);

    modalUserCtrl.$inject = ['$scope', '$uibModalInstance', 'mainService', 'toastService', 'params'];

    function modalUserCtrl($scope, $uibModalInstance, mS, tS, params) {

        $scope.params = params;
        $scope.tipoRegistro = params.tipoRegistro;

        $scope.data = {};

        $scope.$watchGroup([() => $scope.data.contrasena, () => $scope.data.contrasena1], pass => {
            if (pass[1] && $scope.tipoRegistro === 'N') {
                if (pass[1] === pass[0]) {
                    $scope.classValidPassword = 'is-valid';
                } else {
                    $scope.classValidPassword = 'is-invalid';
                }
            }
        })

        mS.getData('get', '/Politica/GetAll').then(response => {
            $scope.politicas = response.data || [];
        })
        if ($scope.tipoRegistro === 'E') {
            $scope.data = Object.assign({}, $scope.params.data);
        }


        $scope.verPassword = (inputPass) => {
            let input = null;
            if (inputPass === 1) {
                input = document.getElementById('passwordUno');
            } else {
                input = document.getElementById('passwordDos');
            }
            if (input.type === 'password') {
                input.type = 'text';
            } else {
                input.type = 'password';
            }
        }

        $scope.onSave = () => {

            $scope.tituloModal = 'Guardar';


            if (!$scope.data.nroIdentificacion) {
                tS.toastr('warning', 'Ingrese el Nro. Identificación', $scope.tituloModal);
                return;
            }

            if (!$scope.data.nombres) {
                tS.toastr('warning', 'Ingrese el nombre', $scope.tituloModal);
                return;
            }

            if (!$scope.data.apellidos) {
                tS.toastr('warning', 'Ingrese el apellido', $scope.tituloModal);
                return;
            }

            if (!$scope.data.correo) {
                tS.toastr('warning', 'Ingrese el correo Electrónico', $scope.tituloModal);
                return;
            }

            if ($(".correo").hasClass('is-invalid')) {
                tS.toastr('warning', 'Ingrese un Correo válido', $scope.tituloModal);
                return
            }
            if (!$scope.data.contrasena) {
                tS.toastr('warning', 'Ingrese la contraseña', $scope.tituloModal);
                return;
            }
            if ($scope.data.contrasena !== $scope.data.contrasena1) {
                tS.toastr('warning', 'Las Contraseñas No coinciden', $scope.tituloModal);
                return;
            }

            if (!$scope.data.idPolitica) {
                tS.toastr('warning', 'Seleccione la Politica', $scope.tituloModal);
                return;
            }

            $scope.data.nombreCompleto = `${$scope.data.nombres} ${$scope.data.apellidos}`

            let data = {
                nroIdentificacion: $scope.data.nroIdentificacion,
                correo: $scope.data.correo,
                nombreUsuario: $scope.data.nombreUsuario,
                contrasena: $scope.data.contrasena,
                nombreCompleto: $scope.data.nombreCompleto,
                idPolitica: $scope.data.idPolitica,
                idRol: Id_Usuario_Rol, //Id Usuario Rol del Usuario Iniciado Session 
                codRol: 'AD'
            }

            mS.getData('post', 'Usuario/' + JSON.stringify(data), null, true).then(response => {
                if (response.code == "0" || response.id == "0") {
                    tS.toastr('warning', response.message, response.titleSms);
                }
                if (response.code == "1" || response.id == "0") {
                    tS.toastr('success', response.message, response.titleSms);
                    $uibModalInstance.close(response)
                }
            })
        }


        $scope.onUpdate = () => {
            try {
                let tituloModal = 'Actualizar';

                if (!$scope.data.nroIdentificacion) {
                    tS.toastr('warning', 'Ingrese el usuario', tituloModal);
                    return;
                };

                if (!$scope.data.nombreCompleto) {
                    tS.toastr('warning', 'Ingrese el Nombre Completo', tituloModal);
                    return;
                }

                if (!$scope.data.correo) {
                    tS.toastr('warning', 'Ingrese el correo Electrónico', tituloModal);
                    return;
                }

                if ($(".correo").hasClass('is-invalid')) {
                    tS.toastr('warning', 'Ingrese un Correo válido', tituloModal);
                    return
                }

                mS.getData('put', `Usuario/${$scope.data.idUsuario}/${JSON.stringify($scope.data)}`, null, true).then(response => {
                    console.log(response)
                    if (response.code == "0" || response.id == "0") {
                        tS.toastr('warning', response.message, response.titleSms);
                    }
                    if (response.code == "1" || response.id == "1") {
                        tS.toastr('success', response.message, response.titleSms);
                        $uibModalInstance.close(response)
                    }
                }).catch(error => {
                    console.log(error)
                })
            } catch (error) {
                console.log(error)
            }
        }


        $scope.closeModal = () => {
            $uibModalInstance.close();
        }


    }

    //----------------------------------END ADD-UPDATE USER----------------------------------------------





    //--------------------------------START CONFIG USER----------------------------------------------------
    app.controller('modalUserConfigCtrl', modalUserConfigCtrl);

    modalUserConfigCtrl.$inject = ["$scope", "$uibModalInstance", "$filter", "mainService", "modalService", "toastService", "params"];

    function modalUserConfigCtrl($scope, $uibModalInstance, $filter, mS, modalSvc, tS, params) {

        $scope.params = params;

        $scope.options = {
            rowSelection: true,
            multiSelect: false,
            autoSelect: false,
            decapitate: false,
        };

        $scope.selectedUsuarioRol = [];
        $scope.usuarioRoles = [];
        $scope.establecimientos = [];



        $scope.role = role;


        $scope.disbledTabPermission = true;


        $scope.initiload = () => {
            try {
                showLoader();
                $scope.usuarioRoles = [];
                mS.getData('get', 'UsuarioRol/Get/' + params.idUsuario, null, true).then(response => {
                    if (response.code === "0") {
                        hideLoader();
                        tS.toastr('warning', response.message)
                    }
                    if (response.code === "1") {
                        console.log(response)
                        $scope.usuarioRoles = JSON.parse(response.payload) || [];
                        hideLoader();
                    }
                })

            } catch (error) {
                hideLoader();
                console.log(error)
            }
        }

        $scope.initiload();


        $scope.isRoleMain = function () {
            return ['RT', 'ADM', 'BS', 'ALT', 'ADMFREE', 'SU'].includes($scope.role)
        }



        $scope.getEstablecimientos = () => {
            let json = {
                idUsuarioRol: $scope.dataEntidadRol.idUsuarioRol,
                typeList: 1,
                idRol: Id_Usuario_Rol
            }

            $scope.establecimientos = [];
            mS.getData('get', '/EstabAsig/Get?json=' + JSON.stringify(json)).then(response => {
                if (response.code === '0') {
                    console.log(response)
                }
                if (response.code === '1') {
                    $scope.establecimientos = JSON.parse(response.payload) || [];
                }
            })
        }

        $scope.getUserPermissions = () => {

            let jsonParams = JSON.stringify({
                idUsuarioRol: $scope.dataEntidadRol.idUsuarioRol
            })
            showLoader();
            mS.getData('get', 'UsuarioPermiso/Get/' + jsonParams, null, true).then(response => {
                if (response.code === "0") {
                    hideLoader();
                    console.log(response)
                }
                if (response.code === '1') {
                    let [dataSalePermissions, dataArticlePermissions, dataCajaPermissions] = JSON.parse(response.payload);

                    $scope.dataSalePermissions = dataSalePermissions;
                    $scope.dataArticlePermissions = dataArticlePermissions;
                    $scope.dataCajaPermissions = dataCajaPermissions;

                    // const jsonStringWithoutBrackets = JSON.parse(jsonString.replaceAll('[', '').replaceAll(']', ''));
                    // const obj = JSON.parse(jsonStringWithoutBrackets.jsonPermission);                    

                    $scope.salePermissions = JSON.parse($scope.dataSalePermissions.jsonPermission);
                    $scope.articlePermissions = JSON.parse($scope.dataArticlePermissions.jsonPermission)
                    $scope.cajaPermissions = JSON.parse($scope.dataCajaPermissions.jsonPermission)


                    console.log($scope.salePermissions)
                    console.log($scope.articlePermissions)
                    console.log($scope.cajaPermissions)
                    hideLoader();
                }
            })
        }

        $scope.getAuthorizationKeyRequests = () => {
            if (!$scope.isRoleMain()) return;

            let jsonParams = JSON.stringify({
                typeList: 1,
                idUsuarioRol: $scope.dataEntidadRol.idUsuarioRol
            })
            $scope.authorizationKeyRequests = [];
            mS.getData('get', 'Solicitud/Get/' + jsonParams, null, true).then(response => {
                if (response.code === "0") {
                    tS.toastr('warning', response.message)
                }
                if (response.code === "1") {
                    $scope.authorizationKeyRequests = JSON.parse(response.payload);
                }
            })
        }


        $scope.onClickEntidadRol = (item) => {
            try {

                $scope.dataEntidadRol = item;
                $scope.disbledTabPermission = false;

                $scope.getEstablecimientos();
                $scope.getUserPermissions();
                $scope.getAuthorizationKeyRequests();
            } catch (error) {
                $scope.disbledTabPermission = true;
                console.log(error)
            }
        }



        /**
         * ----------------------------------------------START ESTAB---------------------------
         * Asignacion de Establecimiento
         * @param {object} item 
         */

        $scope.onChangePredeterminada = (item) => {
            try {
                mS.getData('put', '/EstabAsig/Update?id=' + item.idEstab_Asig).then(response => {
                    if (response.code === '0') {
                        tS.toastr('warning', response.message, response.titleSms);
                        $scope.getEstablecimientos($scope.dataEntidadRol)
                    }
                    if (response.code === '1') {
                        tS.toastr('success', response.message, response.titleSms);
                        $scope.getEstablecimientos($scope.dataEntidadRol)
                    }
                }).catch(error => {
                    $scope.getEstablecimientos($scope.dataEntidadRol)
                    console.log(error)
                })

            } catch (error) {
                console.log(error)
            }
        }

        $scope.asignarEstab = async (item) => {
            try {

                const swalWithBootstrapButtons = Swal.mixin({
                    customClass: {
                        confirmButton: 'btn btn-success',
                        cancelButton: 'btn btn-danger ml-2'
                    },
                    buttonsStyling: false
                })

                let {
                    isConfirmed
                } = await swalWithBootstrapButtons.fire({
                    html: `<small>Está seguro de ${item.estado?'Asignar':'Quitar'} este Sucursal: <b>${item.nombreComercial}</b> a Usuario: <b>${$scope.params.nombreCompleto}</b></small>`,
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: `Sí, ${item.estado?'asignar':'quitar'}`,
                    cancelButtonText: 'No, cancelar!',
                    reverseButtons: false,
                    allowOutsideClick: false,
                    allowEscapeKey: false
                })


                if (isConfirmed) {

                    showLoader();
                    item.idUsuarioRol = $scope.dataEntidadRol.idUsuarioRol;

                    mS.getData('post', '/EstabAsig/Insert', item).then(response => {
                        if (response.code === '0') {
                            tS.toastr('warning', response.message, response.titleSms);
                            $scope.getEstablecimientos($scope.dataEntidadRol)
                            hideLoader();
                        }
                        if (response.code === '1') {
                            tS.toastr('success', response.message, response.titleSms);
                            $scope.getEstablecimientos($scope.dataEntidadRol);
                            hideLoader();
                        }
                    }).catch(error => {
                        hideLoader();
                        $scope.getEstablecimientos($scope.dataEntidadRol)
                        console.log(error)
                    })
                } else {
                    $scope.getEstablecimientos($scope.dataEntidadRol)
                }
            } catch (error) {
                console.log(error)
            }
        }
        //-----------------------------------------------END ESTAB---------------------------------


        $scope.openModalAsignPtoEmisionAndBodega = (data) => {
            try {
                modalSvc.openModalCustom({
                    controller: 'modalAsignPtoEmisionAndBodegaCtrl',
                    template: MODAL_PATH_PARTIAL.modal_asign_punto_emision_bodega,
                    params: {
                        sucursal: data
                    },
                    size: 'lg'
                })
            } catch (error) {
                console.log(error)
            }
        }




        $scope.savePermission = () => {
            try {
                showLoader();


                let jsonPermission = JSON.stringify([{
                        idUserPermission: $scope.dataSalePermissions.idUserPermission,
                        jsonPermission: $scope.salePermissions
                    },
                    {
                        idUserPermission: $scope.dataArticlePermissions.idUserPermission,
                        jsonPermission: $scope.articlePermissions
                    },
                    {
                        idUserPermission: $scope.dataCajaPermissions.idUserPermission,
                        jsonPermission: $scope.cajaPermissions
                    }
                ]);

                let data = {
                    jsonPermission
                }

                mS.getData('put', 'UsuarioPermiso', data, true).then(response => {
                    console.log(response)
                    if (response.code === "0") {
                        hideLoader();
                        console.log(response)
                    }
                    if (response.code === "1") {
                        hideLoader();
                        tS.toastr('success', response.message);
                        $scope.getUserPermissions()

                    }
                }).catch(error => {
                    console.log(error)
                    hideLoader();
                })

            } catch (error) {
                hideLoader();
                console.log(error)
            }
        }


        $scope.searchUserAdmin = (searchText) => {
            try {
                let jsonParams = JSON.stringify({
                    typeList: 3,
                    searchText
                })
                return mS.getData('get', 'Solicitud/Get/' + jsonParams, null, true).then(response => {
                    return JSON.parse(response.payload) || []
                })
            } catch (error) {
                console.log(error)
            }
        }

        $scope.onSelectUser = (data, item) => {

            item.usuarioAprobante = data.nombreCompleto;
            item.idUsuarioRolAprobante = data.idUsuarioRol;
        }



        $scope.approveAuthorizationKeyRequest = (item) => {
            try {
                Swal.fire({
                    title: 'Aprobar Solicitud de Clave de Autorización',
                    text: `Se está dando permiso al usuario para ${item.codigoAccion==='E'?'editar':'anular'} el documento de venta!`,
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Aprobar!',
                    cancelButtonText: 'Cancelar!'
                }).then((result) => {
                    if (result.isConfirmed) {
                        mS.getData('put', 'Solicitud/Put/' + JSON.stringify({
                            typeOperation: 1,
                            id: item.idSolicitud
                        }), null, true).then(response => {
                            if (response.code === "0") {
                                Swal.fire({
                                    icon: 'warning',
                                    text: response.message
                                })
                            }
                            if (response.code === "1") {
                                $scope.getAuthorizationKeyRequests();
                                Swal.fire({
                                    icon: 'success',
                                    text: response.message,
                                    timer: 1000
                                })
                            }
                        })
                    }
                })
            } catch (error) {

            }
        }




        $scope.closeModal = () => {
            $uibModalInstance.close();
        }
    }

    //------------------------------------------START CONFIG USER----------------------------------------------------



    //-------------------------------START ASIGNACIÓN DE PUNTO DE EMISIÓN Y BODEGA------------------------------------------------------
    app.controller("modalAsignPtoEmisionAndBodegaCtrl", modalAsignPtoEmisionAndBodegaCtrl)

    modalAsignPtoEmisionAndBodegaCtrl.$inject = ["$scope", "$q", "$uibModalInstance", "mainService", "toastService", "params"];

    function modalAsignPtoEmisionAndBodegaCtrl($scope, $q, $uibModalInstance, mS, tS, params) {

        $scope.sucursal = Object.assign({}, params.sucursal)
        $scope.puntosEmisiones = []
        $scope.bodegas = [];

        let json = {
            codEstab_Asig: $scope.sucursal.codEstab_Asig
        }
        const URL_PTO_EMISION = '/PtoEmiAsig/Get?json=' + JSON.stringify(json);
        const URL_BODEGA = '/BodegAsig/Get?json=' + JSON.stringify(json);

        $scope.initiload = () => {
            try {
                showLoader();
                $q.all([
                    mS.getData('get', URL_PTO_EMISION),
                    mS.getData('get', URL_BODEGA),
                ]).then(results => {

                    if (results[0].code == "1") {
                        $scope.puntosEmisiones = JSON.parse(results[0].payload) || [];
                    }
                    if (results[1].code === "1") {
                        $scope.bodegas = JSON.parse(results[1].payload) || [];
                    }
                    hideLoader();
                }).catch(error => {
                    hideLoader();
                    console.log(error);
                })

            } catch (error) {
                hideLoader();
                console.log(error)
            }
        }

        $scope.initiload();


        $scope.getPuntoEmision = () => {
            mS.getData('get', URL_PTO_EMISION).then(response => {
                $scope.puntosEmisiones = JSON.parse(response.payload) || [];
            })
        }

        $scope.onChangePuntoEmisionPredeterminada = (item) => {
            try {
                showLoader();
                mS.getData('put', '/PtoEmiAsig/Update?id=' + item.idPtoEmi_Asig).then(response => {
                    if (response.code === '0') {
                        hideLoader();
                        tS.toastr('warning', response.message, response.titleSms);
                        $scope.getPuntoEmision()
                    }
                    if (response.code === '1') {
                        hideLoader();
                        tS.toastr('success', response.message, response.titleSms);
                        $scope.getPuntoEmision()
                    }
                })
            } catch (error) {
                hideLoader();
                console.log(error)
            }
        }

        $scope.asignarPuntoEmision = async (item) => {
            try {
                const swalWithBootstrapButtons = Swal.mixin({
                    customClass: {
                        confirmButton: 'btn btn-success',
                        cancelButton: 'btn btn-danger ml-2'
                    },
                    buttonsStyling: false
                })

                let {
                    isConfirmed
                } = await swalWithBootstrapButtons.fire({
                    icon: 'warning',
                    html: `<small>Está seguro de ${item.estado?'Asignar':'Quitar'} este Punto de Emisión: <b>${item.ptoEmi}</b> a Sucursal: <b>${$scope.sucursal.nombreComercial}</b></small>`,
                    showCancelButton: true,
                    confirmButtonText: `Sí, ${item.estado?'asignar':'quitar'}`,
                    cancelButtonText: 'No, cancel!',
                    reverseButtons: false,
                    allowOutsideClick: false
                })

                if (isConfirmed) {
                    item.codEstab_Asig = $scope.sucursal.codEstab_Asig
                    mS.getData('post', '/PtoEmiAsig/Insert', item).then(response => {
                        if (response.code === '0') {
                            hideLoader();
                            tS.toastr('warning', response.message, response.titleSms);
                            $scope.getPuntoEmision()
                        }
                        if (response.code === '1') {
                            hideLoader();
                            tS.toastr('success', response.message, response.titleSms);
                            $scope.getPuntoEmision()
                        }
                    })
                } else {
                    hideLoader();
                    $scope.getPuntoEmision()
                }
            } catch (error) {
                hideLoader();
                console.log(error)
            }
        }



        $scope.getAsignacionBodega = () => {
            mS.getData('get', URL_BODEGA).then(response => {
                $scope.bodegas = JSON.parse(response.payload) || [];
            })
        }



        $scope.onChangePredeterminadaBodega = (item) => {
            try {
                showLoader();
                mS.getData('put', '/BodegAsig/Update?id=' + item.idBodeg_Asig).then(response => {
                    if (response.code === '0') {
                        hideLoader();
                        tS.toastr('warning', response.message, response.titleSms);
                        $scope.getAsignacionBodega()
                    }
                    if (response.code === '1') {
                        hideLoader();
                        tS.toastr('success', response.message, response.titleSms);
                        $scope.getAsignacionBodega()
                    }
                })
            } catch (error) {
                hideLoader();
                console.log(error)
            }
        }

        $scope.asignarBodega = async (item) => {
            try {
                const swalWithBootstrapButtons = Swal.mixin({
                    customClass: {
                        confirmButton: 'btn btn-success',
                        cancelButton: 'btn btn-danger ml-2'
                    },
                    buttonsStyling: false
                })

                let {
                    isConfirmed
                } = await swalWithBootstrapButtons.fire({
                    icon: 'warning',
                    html: `<small>Está seguro de ${item.estado?'Asignar':'Quitar'} este Bodega: <b>${item.bodega}</b> a Sucursal: <b>${$scope.sucursal.nombreComercial}</b></small>`,
                    showCancelButton: true,
                    confirmButtonText: `Sí, ${item.estado?'asignar':'quitar'}`,
                    cancelButtonText: 'No, cancel!',
                    reverseButtons: false,
                    allowOutsideClick: false,
                })

                if (isConfirmed) {
                    showLoader();
                    item.codEstab_Asig = $scope.sucursal.codEstab_Asig
                    mS.getData('post', '/BodegAsig/Insert', item).then(response => {
                        if (response.code === '0') {
                            hideLoader();
                            tS.toastr('warning', response.message, response.titleSms);
                            $scope.getAsignacionBodega()
                        }
                        if (response.code === '1') {
                            hideLoader();
                            tS.toastr('success', response.message, response.titleSms);
                            $scope.getAsignacionBodega()
                        }
                    })
                } else {
                    hideLoader();
                    $scope.getAsignacionBodega()
                }

            } catch (error) {
                hideLoader();
                console.error(error)
            }
        }

        $scope.closeModal = () => {
            $uibModalInstance.close();
        }
    }




})(window.angular)