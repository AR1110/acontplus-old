(function () {

    'use strict';
    app.controller('compraNoHabitualCtrl', compraNoHabitualCtrl);


    compraNoHabitualCtrl.$inject = [
        '$scope',
        'commonService',
        'compraNoHabitualService',
        'mainService',
        'modalService',
        'nombreModalCompra',
        'formulario'
    ]


    function compraNoHabitualCtrl($scope, commonSvc, compraNoHabSvc, mS, modalSvc, nombreModalCompra, fS) {

        //Variables Generales
        let { fileCtrl, controllers, templates } = nombreModalCompra.COMPRA_NO_HABITUAL;

        //Filtro 

        $scope.proveedor = {
            nombreProveedor: ''
        }

        $scope.searchUser = {
            nombreCompleto: ''
        }
        $scope.moreSearchOptions = false;

        $scope.dataSearch = {
            checkBoxFecha: true,
            // fechaInicio: new Date(),
            // fechaFin: new Date()
        };

        $scope.estadoDocs = [{
            estado: 'AC',
            descripcion: 'Activo'
        }, {
            estado: 'A',
            descripcion: 'Anulado',
        }]



        /**
         * 
         * @param {object} {controller, template, params}
         */
        $scope.openModal = ({
            controller,
            template,
            params,
            isRenderRazorPartial
        }) => {
            let modalRef = modalSvc.openModalCustom({
                controller,
                template,
                params,
                size: 'xl',
                windowClass: 'uibModalFullScreen',
                isRenderRazorPartial
            })

            modalRef.result.then(result => {
                if (typeof result === 'object') {
                    $scope.getComprasNoHabitual();
                }
            })
        }


        //Formulario Nuevo
        $scope.openModalNew = async () => {
            try {
                let controller = (await import(fileCtrl))[controllers['MN']];
                let template = templates['MN'];
                let modalParms = {
                    controller,
                    template,
                    params: {
                        data: {}
                    },
                    isRenderRazorPartial: true
                }
                $scope.openModal(modalParms)

            } catch (error) {
                console.log(error)
            }

        }



        $scope.resultRangeFilter = function (item) {
            $scope.dataSearch.fechaInicio = item.startDate,
                $scope.dataSearch.fechaFin = item.endDate
            $scope.getComprasNoHabitual();
        }

        //====================Cliente===========
        $scope.onKeyupProveedor = function () {

            $scope.dataSearch.idProveedor = 0;

        }
        $scope.onSelectProveedor = function (item) {
            $scope.dataSearch.idProveedor = item.idProveedor;
            $scope.getComprasNoHabitual();
        }

        $scope.onKeyupUser = function () {
            if (!$scope.searchUser.nombreCompleto) {
                $scope.dataSearch.idUsuario = 0;
            }
        }
        $scope.onSelectUser = function (item) {
            $scope.dataSearch.idUsuario = item.idUsuario;
            $scope.getComprasNoHabitual();
        }

        $scope.onClickBtnMore = function () {
            $scope.moreSearchOptions = !$scope.moreSearchOptions;
        }


        $scope.sumImporteTotal = function () {
            let importeTotal = 0;
            for (let item of $scope.documentoIngreso) {
                importeTotal += item.importeTotal;
            }
            $scope.importeTotal = fS.roundNumber(importeTotal, 2);
        }



        //Obtenemos Datos 
        $scope.getComprasNoHabitual = () => {
            try {
                showLoader();

                let query = {
                    typeList: 1,
                    codEstab: $scope.dataSearch.codEstab,
                    dateStart: fS.formatDateMoment($scope.dataSearch.fechaInicio),
                    dateEnd: fS.formatDateMoment($scope.dataSearch.fechaFin),
                    checkBoxProveedor: $scope.dataSearch.idProveedor > 0,
                    idProveedor: $scope.dataSearch.idProveedor,
                    checkBoxEstado: $scope.dataSearch.estado ? true : false,
                    estado: $scope.dataSearch.estado,
                    isSearchNroDoc: $scope.dataSearch.nroSecuencial ? true : false,
                    nroSecuencial: $scope.dataSearch.nroSecuencial
                };
                $scope.documentoIngreso = [];
                $scope.sumImporteTotal();
                compraNoHabSvc.get(query).then(response => {
                    $scope.documentoIngreso = response;
                    $scope.sumImporteTotal();
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

        //Formulario Nuevo
        $scope.openModalEditar = async (item) => {
            try {
                let controller = (await import(fileCtrl))[controllers['MU']];
                let template = templates['MU'];

                let modalParams = {
                    controller,
                    template,
                    isRenderRazorPartial: true
                }
                showLoader();
                compraNoHabSvc.findById(item.idDocumentoIngreso).then(response => {
                    hideLoader();
                    modalParams.params = response;
                    $scope.openModal(modalParams)
                }).catch(error => {
                    hideLoader();
                    console.log(error);
                })
            } catch (error) {
                hideLoader();
                console.log(error)
            }
        }


        //Cancelar un Documento
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
                    title: '<small>Anular Compra no Habitual?</small>',
                    html: `<small>Esta Ud. seguro/a de anular esta Compra No Habitual <b>N° ${item.serieComprobante}</b></small>?`,
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: 'Si, anular!',
                    cancelButtonText: 'No, cancelar!',
                    reverseButtons: false
                })

                if (isConfirmed) {
                    compraNoHabSvc.updateStatus(item.idDocumentoIngreso).then(response => {
                        if (response.code === "0") {
                            fS.sweetAlert('warning', response.message, response.titleSms);
                        }
                        if (response.code === "1") {
                            fS.sweetAlert('success', response.message, response.titleSms, 1000);
                            $scope.getComprasNoHabitual();
                        }
                    })
                }
            } catch (error) {
                Swal.close();
                console.log(error)
            }

        }

        $scope.initiload = () => {
            try {
                commonSvc.getEstabAsign().then(response => {
                    $scope.establecimientos = response;
                    let codEstab = $scope.establecimientos.length > 0 ? $scope.establecimientos[0].codEstab : 0;
                    $scope.dataSearch.codEstab = codEstab;
                    $scope.getComprasNoHabitual();
                })
            } catch (error) {
                console.log(error);
            }
        }
        $scope.initiload();




        $scope.openModalDetalle = async (item) => {
            try {

                try {

                    let controller = (await import(fileCtrl))[controllers['MD']];
                    let template = templates['MD'];
                    let modalParams = {
                        controller,
                        template,
                        isRenderRazorPartial: true
                    }

                    compraNoHabSvc.get({
                        idDocumentoIngreso: item.idDocumentoIngreso,
                        typeList: 4
                    }).then(response => {
                        modalParams.params = response;
                        $scope.openModal(modalParams)
                    }).finally(() => hideLoader())
                } catch (error) {
                    console.log(error)
                }

            } catch (error) {
                console.log(error);
            }
        }
    }
})(window.angular)