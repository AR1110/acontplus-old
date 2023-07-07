app.controller('compraNoHabitualCtrl', compraNoHabitualCtrl);


compraNoHabitualCtrl.$inject = ['$scope', 'commonService', 'compraNoHabitualService', 'mainService', 'toastService', 'modalService', 'nombreModal', 'formulario']


function compraNoHabitualCtrl($scope, commonSvc, compraNoHabSvc, mS, tS, modalSvc, nombreModal, _fS) {

    //Variables Generales
    const {
        MODAL_FILE_PATH
    } = nombreModal.compra_no_habitual;
    const {
        MODAL_NUEVO,
        MODAL_EDITAR,
        MODAL_DETALLE
    } = nombreModal.compra_no_habitual;

    //Filtro 
    $scope.dataSearch = {
        checkBoxFecha: true,
        // fechaInicio: new Date(),
        // fechaFin: new Date()
    };

    // $scope.meses = _fS.meses();
    // $scope.mes = new Date().getMonth() + 1;
    $scope.proveedorFilter = {};

    $scope.estadoDocs = [{
        estado: 'AC',
        descripcion: 'Activo'
    }, {
        estado: 'A',
        descripcion: 'Anulado',
    }]
    $scope.openModalFiltro = function() {
        $("#modalFiltro").modal('show');
    }    

    //-------------------------------------------Proveedor filter------------------------------
    $scope.searchProveedorFilter = (textSearch) => {
        return commonSvc.proveedorSearch(textSearch);
    }

    $scope.proveedorFilte = {};
    $scope.searchProveedorFilterChange = function (item) {
        $scope.dataSearch.byProveedor = item.proveedor.idProveedor
    }

    //Busqueda Avanzada 
    $scope.busquedaAvanzada = () => {
        if ($scope.dataSearch.checkBoxProveedor) {
            if (_fS.campo($scope.dataSearch.byProveedor)) {
                tS.toastr('warning', 'Por favor seleccione el Proveedor');
                return;
            };
        }

        if ($scope.dataSearch.checkBoxFecha) {
            if (_fS.campo($scope.dataSearch.fechaInicio)) {
                tS.toastr('warning', 'Por favor seleccione la Fecha Inicio');
                return;
            };
            if (_fS.campo($scope.dataSearch.fechaFin)) {
                tS.toastr('warning', 'Por favor seleccione la Fecha Fin');
                return;
            };
        }


        if ($scope.dataSearch.checkBoxEstado) {
            if ($scope.dataSearch.byEstado === null || $scope.dataSearch.byEstado === undefined) {
                tS.toastr('warning', 'Por favor seleccione el Estado');
                return
            }
        }

        $scope.getComprasNoHabitual();
        $("#modalFiltro").modal('hide');
    }




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

        let modalParms = {
            controller: (await import('./../../' + MODAL_FILE_PATH))[MODAL_NUEVO['controller']],
            template: MODAL_NUEVO['template'],
            params: {
                data: {}
            },
            isRenderRazorPartial: true
        }

        $scope.openModal(modalParms)
    }

    //Formulario Nuevo
    $scope.openModalEditar = async (item) => {
        try {

            let modalParams = {
                controller: (await import('./../../' + MODAL_FILE_PATH))[MODAL_EDITAR['controller']],
                template: MODAL_EDITAR['template'],
                isRenderRazorPartial: true
            }
            showLoader();
            compraNoHabSvc.findById(item.idDocumentoIngreso).then(response => {
               hideLoader();
                modalParams.params = response;
                $scope.openModal(modalParams)
            }).catch(error=>{
                hideLoader();
                console.log(error);
            })
        } catch (error) {
            hideLoader();
            console.log(error)
        }



    }

    $scope.sumImporteTotal = function () {
        let importeTotal = 0;
        for (let item of $scope.documentoIngreso) {
            importeTotal += item.importeTotal;
        }
        $scope.importeTotal = _fS.roundNumber(importeTotal, 2);
    }

    //Obtenemos Datos 
    $scope.getComprasNoHabitual = () => {
        try {
            showLoader();

            let query = {
                typeList: 1,
                checkBoxFecha: true,
                checkBoxEstab: $scope.dataSearch.checkBoxEstab,
                checkBoxProveedor: $scope.dataSearch.checkBoxProveedor,
                checkBoxEstado: $scope.dataSearch.checkBoxEstado,
                dateStart: _fS.formatDateTimeZone($scope.dataSearch.fechaInicio),
                dateEnd: _fS.formatDateTimeZone($scope.dataSearch.fechaFin),
                codEstab: $scope.dataSearch.codEstab,
                idProveedor: $scope.dataSearch.byProveedor,
                estado: $scope.dataSearch.byEstado,
            };
          

            $scope.documentoIngreso = [];
            $scope.sumImporteTotal();
            compraNoHabSvc.getAll(query).then(response => {
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


    //Cancelar un Documento
    $scope.askToDelete = async (item) => {
        console.log('delet')
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
                mS.getData('put', 'CompraNoHabitual/Cancel/' + item.idDocumentoIngreso, null, true).then(response => {

                    if (response.code === "0") {
                        _fS.sweetAlert('warning', response.message, response.titleSms);
                    }
                    if (response.code === "1") {
                        _fS.sweetAlert('success', response.message, response.titleSms, 1000);
                        $scope.getComprasNoHabitual();
                    }
                })
            }
        } catch (error) {
            Swal.close();
            console.log(error)
        } finally {

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

                let modalParams = {
                    controller: (await import('./../../' + MODAL_FILE_PATH))[MODAL_DETALLE['controller']],
                    template: MODAL_DETALLE['template'],
                    isRenderRazorPartial: true
                }

                mS.getData('get', 'CompraNoHabitual/' + JSON.stringify({
                    idDocumentoIngreso: item.idDocumentoIngreso,
                    typeList: 4
                }), null, true).then(response => {
                    if (response.code === "0") {
                        console.log(response)
                        hideLoader();
                    }

                    if (response.code === "1") {

                        modalParams.params = JSON.parse(response.payload);
                        $scope.openModal(modalParams)

                        hideLoader();
                    }
                })
            } catch (error) {
                console.log(error)
            }

        } catch (error) {
            console.log(error);
        }
    }



}