(() => {

    'use strict'; 

    app.controller('notaCreditoClienteCtrl', notaCreditoClienteCtrl);

    notaCreditoClienteCtrl.$inject = [
        '$scope', 
        'commonService',
        'notaCreditoService',
        'modalService',
        'nombreModal',
        'formulario',
        'decodeToken'
    ]

    function notaCreditoClienteCtrl($scope, commonSvc, notaCreditoSvc, modalSvc, nombreModalConst, fS, decodeToken) {

        'use strict';

        const TIPO_DOC = commonSvc.tipoDoc['NC'];

        $scope.dataSearch = {
            pageIndex: 1,
            pageSize: 1000
        }

        $scope.cliente = {

        }
        let idUsuarioRol = Number(decodeToken.idUsuarioRol)

        //---------------------------------Busqueda Avanzada ----------------------------------
        //========================Start Filters=================

        $scope.resultRangeFilter = function (item) {
            $scope.dataSearch.fechaInicio = item.startDate,
                $scope.dataSearch.fechaFin = item.endDate
            $scope.getNotaCreditos();
        }



        $scope.onKeyupCliente = function () {
            if (!$scope.cliente.nombreCliente) {
                $scope.dataSearch.idCliente = 0;
            }
        }
        $scope.onSelectCliente = function (item) {
            $scope.dataSearch.idCliente = item.idCliente;
            $scope.getNotaCreditos();
        }

        $scope.usuarioSearch = function (textSearch) {
            try {
                let query = {
                    idRol: idUsuarioRol,
                    busqueda: textSearch
                }

                if (query.busqueda.length > 2) {
                    return commonSvc.usuarioSearch(query)
                        .catch(error => {
                            console.log(error);
                            throw error;
                        })
                }
            } catch (error) {
                console.log(error);
            }
        }

        $scope.onKeyupUsuarioSearch = function () {
            if (!$scope.modelNombreCompleto) {
                $scope.dataSearch.byUsuario = 0;
            }
        }

        $scope.selectedUsuarioSearch = function (item) {
            $scope.dataSearch.byUsuario = item.idUsuario;
        }

        $scope.onClickBtnMore = function () {
            $scope.moreSearchOptions = !$scope.moreSearchOptions;
        }

        $scope.searchFilterLocal = function () {
            let notaCreditos = JSON.parse(JSON.stringify($scope.cloneNotaCreditos));
            $scope.notaCreditos = $filter("filter")(notaCreditos, $scope.dataSearch.bySearch);
            // $scope.calculoColumnTotal();
        }

        //=====================Eend Filters=======================

        $scope.getNotaCreditos = function () {
            try {
                showLoader(); 
                let dataSearch = {
                    tipo:1,
                    codEstab: $scope.dataSearch.codEstab, 
                    idPuntoEmision: $scope.dataSearch.idPuntoEmision,
                    byCliente: $scope.dataSearch.idCliente,
                    checkBoxFecha: true, 
                    byUsuario: $scope.dataSearch.byUsuario, 
                    idEstadoDocumento: $scope.dataSearch.idEstadoDocumento,
                    fechaInicio: fS.formatDateMoment($scope.dataSearch.fechaInicio),
                    fechaFin: fS.formatDateMoment($scope.dataSearch.fechaFin),
                    pageIndex: 1,
                    pageSize: 300
                }


                $scope.notaCreditos = [];
                notaCreditoSvc.get(dataSearch).then(response => { 
                    $scope.notaCreditos = response || [];
                    $scope.cloneNotaCreditos = JSON.parse(JSON.stringify($scope.notaCreditos)) 
                }).finally(()=>hideLoader())
            } catch (error) {
                hideLoader();
                console.log(error)

            }
        }

        $scope.initiload = () => {

            showLoader();
            notaCreditoSvc.get({tipo: 3}).then(response=>{
                hideLoader();
                $scope.establecimientos = response.estabs;
                $scope.estadoDocumentos = response.estadosDoc; 
                
                if($scope.establecimientos.length>0){
                    let dataEstab = $scope.establecimientos.find(estab=>(estab.defaultEstab));
                    $scope.puntosEmision = dataEstab.puntosEmision;
                    $scope.dataSearch.codEstab = dataEstab.codEstab;
                    $scope.dataSearch.idPuntoEmision = $scope.puntosEmision.find(pto=>(pto.defaultPtoEmi)).idPuntoEmision;
                    $scope.getNotaCreditos();                    
                }  
            }).catch(()=>{
                hideLoader();
            })    

        }
        $scope.initiload();

        $scope.estabFilter = function(){
            let dataEstab = $scope.establecimientos.find(estab=>estab.codEstab===$scope.dataSearch.codEstab);
            $scope.puntosEmision = dataEstab.puntosEmision;
            $scope.dataSearch.idPuntoEmision = $scope.puntosEmision.find(pto=>(pto.defaultPtoEmi)).idPuntoEmision;
            $scope.getNotaCreditos();
        }


        $scope.openModalNew = async () => {
            let { MODAL_FILE_CTRL, MODAL_NUEVO } = nombreModalConst.nota_credito_cliente;
            let controller = (await import('../../' + MODAL_FILE_CTRL))[MODAL_NUEVO['controller']];
            let template = MODAL_NUEVO['template'];
            let params = {
                TIPO_REGISTRO: 'NUEVO'
            }
            $scope.openModalParam({
                controller,
                template,
                params
            })
        }


        $scope.openModalDetalle = async (item) => {
            try {
                let { MODAL_FILE_CTRL, MODAL_DETALLE } = nombreModalConst.nota_credito_cliente;
                let controller = (await import('../../' + MODAL_FILE_CTRL))[MODAL_DETALLE['controller']];
                let template = MODAL_DETALLE['template'];
                let response = await commonSvc.getDataTipoDocVenta({
                    id: item.idNotaCredito,
                    codigoDocumento: TIPO_DOC.codigo
                })

                if (!response.isComplete) return

                let params = {
                    TIPO_REGISTRO: 'DETALLE',
                    data: response
                }

                $scope.openModalParam({
                    controller,
                    template,
                    params
                })
            } catch (error) {
                console.log(error)
            }
        }

        $scope.openModalEditar = async (item) => {
            try {
                showLoader();
                let { MODAL_FILE_CTRL, MODAL_EDITAR } = nombreModalConst.nota_credito_cliente;
                let controller = (await import('../../' + MODAL_FILE_CTRL))[MODAL_EDITAR['controller']];
                let template = MODAL_EDITAR['template'];

                let response = await commonSvc.getDataTipoDocVenta({
                    id: item.idNotaCredito,
                    codigoDocumento: TIPO_DOC.codigo
                })


                if (!response.isComplete) return

                let params = {
                    TIPO_REGISTRO: 'EDITAR',
                    data: response
                }
                $scope.openModalParam({
                    controller,
                    template,
                    params
                })
            } catch (error) {

                console.log(error)
            } finally {
                hideLoader();
            }
        }

        $scope.openModalParam = ({ controller, template, size = 'xl', params }) => {

            modalSvc.openModalCustom({
                controller,
                template,
                size,
                params,
                windowClass: 'uibModalFullScreen'
            }).result.then(result => {
                
                if (typeof result === 'object') {
                    $scope.getNotaCreditos();
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

                let { isConfirmed } = await swalWithBootstrapButtons.fire({
                    title: '<small>Anular Nota Credito?</small>',
                    html: `<small>Esta Ud. seguro/a de anular este documento <b>N° ${item.nroDoc}</b></small>?`,
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: 'Si, anular!',
                    cancelButtonText: 'No, cancelar!',
                    reverseButtons: false
                })

                if (isConfirmed) {
                    showLoader();
                    notaCreditoSvc.delete(item.idNotaCredito).then(response=>{
                        if(response.code==="0"){
                            fS.sweetAlert('warning', response.message, response.titleSms);
                        }
                        if(response.code=="1"){
                            fS.sweetAlert('success', response.message, response.titleSms, 1000);
                            $scope.getNotaCreditos();
                        }
                    }).finally(()=>hideLoader())
                }
            } catch (error) {
                console.log(error)
            } finally {
                Swal.close()
            }

        }


        $scope.getReport = (item) => {
            try {

                let format = 'pdf';
                let dataParms = {
                    id: item.idNotaCredito,
                    codEstab: item.codEstab,
                    codigo: 'RNCC',
                    format,
                }

                const parameters = {
                    dataParams: JSON.stringify(dataParms)
                }

                commonSvc.getReportDynamic({ parameters, format })
            } catch (error) {
                console.log(error)
            }
        }


    }


})(window.angular)