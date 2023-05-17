app.controller('aprobComprobanteCtrl', aprobComprobanteCtrl);

aprobComprobanteCtrl.$inject = ['$scope', 'mainService', 'commonService', 'modalService', 'nombreModal', 'formulario', 'toastService'];

function aprobComprobanteCtrl($scope, mS, commonSvc, _modalSvc, _nombreModalConst, _form, _tS) {

    // let accion = JSON.parse(localStorage.getItem("accion")); 

    // if (accion === null) {
    //     location.href = "/Home/Index";
    //     return
    // } else {
    //     $scope.accion = accion[0];
    // }

    $scope.dataSearch = {
        pageIndex: 1,
        pageSize: 10000
    }

    $scope.clienteFiltro = {}
    $scope.usuarioSearchFiltro = {};
    $scope.mes = new Date().getMonth() + 1;

    $scope.askToOpenModalOption = async () => {
        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
                confirmButton: 'btn btn-success',
                cancelButton: 'btn btn-danger m-l-5'
            },
            buttonsStyling: false
        })

        const resultOp = await swalWithBootstrapButtons.fire({
            title: 'Opción Documento Aprobación',
            input: 'select',
            inputOptions: {
                "NE": 'NOTA DE ENTREGA A FACTURA</small>',
                "PR": 'PROFORMA A FACTURA</PROFORMA>'
            },
            inputPlaceholder: 'Seleccionar...',
            showCancelButton: true,
            confirmButtonText: 'Continuar <i class="fa fa-arrow-right"></i>',
            cancelButtonText: '<small>&times; Cerrar</small>',
            reverseButtons: false,
            allowOutsideClick: false,
            focusConfirm: true,
            inputValidator: (value) => new Promise((resolve) => value ? resolve() : resolve('Seleccione el Tipo Documento'))
        })

        if (!resultOp.isConfirmed) return

        let {
            MODAL_FILE_CTRL,
            MODAL_SELECT_DOC
        } = _nombreModalConst.aprob_comp;
        let controller = (await import('./../../' + MODAL_FILE_CTRL))[MODAL_SELECT_DOC['controller']]
        let template = MODAL_SELECT_DOC['template'];
        let params = {
            TIPO_DOC: commonSvc.tipoDoc[resultOp.value]
        }


        _modalSvc.openModalCustom({
            controller,
            template,
            size: 'xl',
            windowClass: 'uibModalFullScreen',
            params
        }).result.then(response => {
            if (typeof response === 'object') {
                $scope.getAprobComprobantes();
            }
        })
    }


    $scope.openModalFiltro = async function () {
        let {
            MODAL_FILE_CTRL,
            MODAL_FILTRO
        } = _nombreModalConst.aprob_comp;
        let controller = (await import('./../../' + MODAL_FILE_CTRL))[MODAL_FILTRO['controller']]
        let template = MODAL_FILTRO['template'];

        let params = {
            dataSearch: $scope.dataSearch,
            clienteFiltro: $scope.clienteFiltro,
            usuarioSearchFiltro: $scope.usuarioSearchFiltro,
            mes: $scope.mes
        }

        let modalRef = _modalSvc.openModalCustom({
            controller,
            template,
            params,
            size: 'lg'
        })

        modalRef.result.then(result => {
            let {
                dataSearch,
                clienteFiltro,
                usuarioSearchFiltro,
                mes,
                isSearch
            } = result;
            $scope.dataSearch = dataSearch;
            $scope.clienteFiltro = clienteFiltro;
            $scope.usuarioSearchFiltro = usuarioSearchFiltro;
            $scope.mes = mes;
            if (isSearch) {
                $scope.getAprobComprobantes();
            }
        })
    }


    $scope.getAprobComprobantes = () => {
        try {
            showLoader();
            $scope.aprobComprobantes = [];

            if ($scope.dataSearch.checkBoxCliente ||
                $scope.dataSearch.checkBoxFecha ||
                $scope.dataSearch.checkBoxUsuario ||
                $scope.dataSearch.checkBoxEstado) {
                $scope.dataSearch.checkBoxDefault = false
            } else {
                $scope.dataSearch.checkBoxDefault = true;
            }

            mS.getData('get', '/AprobDocument/Get?json=' + JSON.stringify($scope.dataSearch)).then(response => {
                if (response.code === '0') {
                    hideLoader();
                    $scope.aprobComprobantes = [];
                    console.warn(response)
                    return
                }
                if (response.code === '1') {
                    $scope.aprobComprobantes = JSON.parse(response.payload) || [];

                    const total = $scope.aprobComprobantes.map(item => item.total).reduce((prev, acc) => prev + acc, 0)
                    $scope.total = _form.roundNumber(total, 2)
                    hideLoader();
                }
            }).catch(error => {
                $scope.aprobComprobantes = [];
                console.log(error)
            })
        } catch (error) {
            $scope.aprobComprobantes = [];
            console.log(error)

        }
    }

    $scope.initiload = () => {
        commonSvc.getEstabAsign().then(response => {
            $scope.establecimientos = response;
            let codEstab = $scope.establecimientos.length > 0 ? $scope.establecimientos[0].codEstab : 0;
            $scope.dataSearch.codEstab = codEstab;
            $scope.getAprobComprobantes();
        })
    }
    $scope.initiload();



    $scope.showBtnApprove = (item) => {
        return !['APR', 'A'].includes(item.codEstado)
    }

    $scope.showBtnEditar = (item) => {
        return !['APR', 'A'].includes(item.codEstado)
    }

    $scope.showBtnDelete = (item) => {
        return !['APR', 'A'].includes(item.codEstado)
    }

    $scope.openModalDetalle = async (item) => {
        try {

            let {
                MODAL_FILE_CTRL,
                MODAL_APROB_DOC_DETALLE
            } = _nombreModalConst.aprob_comp;
            let controller = (await import('./../../' + MODAL_FILE_CTRL))[MODAL_APROB_DOC_DETALLE['controller']]
            let template = MODAL_APROB_DOC_DETALLE['template'];

            $scope.openModalParam({
                controller,
                template,
                item
            })
        } catch (error) {
            console.log(error)
        }
    }


    $scope.openModalEdit = async (item) => {
        try {

            let {
                MODAL_FILE_CTRL,
                MODAL_APROB_DOC_EDIT
            } = _nombreModalConst.aprob_comp;
            let controller = (await import('./../../' + MODAL_FILE_CTRL))[MODAL_APROB_DOC_EDIT['controller']]
            let template = MODAL_APROB_DOC_EDIT['template'];

            $scope.openModalParam({
                controller,
                template,
                item
            })
        } catch (error) {
            console.log(error)
        }
    }


    $scope.approveDocument = async (item) => {
        try {
            let {
                MODAL_FILE_CTRL,
                MODAL_APPROVE_DOC
            } = _nombreModalConst.aprob_comp;
            let controller = (await import('./../../' + MODAL_FILE_CTRL))[MODAL_APPROVE_DOC['controller']]
            let template = MODAL_APPROVE_DOC['template'];


            $scope.openModalParam({
                controller,
                template,
                item
            })
        } catch (error) {
            console.log(error)
        }
    }




    /**
     * 
     * @param {Object} param0 
     */
    $scope.openModalParam = async ({
        controller,
        template,
        item
    }) => {
        let params = {}
        await mS.getData('get', '/AprobDocument/GetId?id=' + item.idAprob_Document).then(response => {
            if (response.code === '0') {
                _tS.toastr('warning', response.message, response.titleSms);
            }
            if (response.code === '1') {
                params = JSON.parse(response.payload);
                params[0].forEach(value => {
                    value.serie = item.serie
                })
            }
        })



        if (!Object.keys(params).length) return

        _modalSvc.openModalCustom({
            controller,
            template,
            size: 'xl',
            windowClass: 'uibModalFullScreen',
            params
        }).result.then(response => {
            if (typeof response === 'object') {
                $scope.getAprobComprobantes();
            }
        })
    }


    $scope.askToDelete = async (item) => {
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
            title: 'Anular Aprobación?',
            html: `<small>Esta seguro de Anular este Documento Nro. <b>${item.serie}</b>!</small>`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: '<i class="fas fa-trash-alt"></i> Sí, eliminar!',
            cancelButtonText: '&times; No, cancelar!',
            reverseButtons: false,
            allowOutsideClick: false
        })

        if (isConfirmed) {
            mS.getData('delete', '/AprobDocument/Delete?id=' + item.idAprob_Document).then(response => {
                if (response.code === '0') {
                    _tS.toastr('warning', response.message, response.titleSms);
                }
                if (response.code === '1') {
                    _tS.toastr('success', response.message, response.titleSms);
                    $scope.getAprobComprobantes();
                }
            })
        }
    }

    $scope.getReport = (item) => {
        try {

            let format = 'pdf';
            let dataParms = {
                id: item.idAprob_Document,
                codEstab: item.codEstab,
                codigo: 'RAC',
                format,
            }

            const parameters = {
                dataParams: JSON.stringify(dataParms)
            }

            commonSvc.getReportDynamic({
                parameters,
                format
            })
        } catch (error) {
            console.log(error)
        }
    }

}