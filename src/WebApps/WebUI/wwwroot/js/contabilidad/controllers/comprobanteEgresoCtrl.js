//@ts-check
(function () {

    'use strict';

    app.controller('comprobanteEgresoCtrl', comprobanteEgresoCtrl);

    comprobanteEgresoCtrl.$inject = ['$scope', '$injector'];
    function comprobanteEgresoCtrl($scope, $injector) {
        let comprobanteEgresoSvc = $injector.get('comprobanteEgresoService');
        let commonSvc = $injector.get('commonService');
        let fS = $injector.get('formulario');

        $scope.recordsQuantity = [25, 50, 100];

        $scope.moreSearchOptions = false;

        $scope.dataSearch = {
            pageIndex: 1,
            pageSize: 25,
            checkBoxFecha: true,
            totalRecords:0,
            maxSize: 5
        }

        $scope.establecimientos = [];
        $scope.comprobantesEgreso = [];

        $scope.proveedor = {};
        $scope.searchEmpleado = {};

        initLoad();
        function initLoad() {

            showLoader();
            comprobanteEgresoSvc.getDataFilter().then(response => {
                if (response) {
                    $scope.establecimientos = response.estabs;
                    if ($scope.establecimientos.length > 0) {
                        let dataEstab = $scope.establecimientos.find(estab => estab.defaultEstab);
                        if (dataEstab) {
                            $scope.dataSearch.codEstab = dataEstab.codEstab;
                        }
                    }
                }
                getComprobantesEgreso();
            }).catch(error => {
                console.log(error)
            }).finally(() => hideLoader());

            comprobanteEgresoSvc.getPosfechadoPagosModal()

        }

        function getComprobantesEgreso() {
            try {

                let params = {
                    pageIndex: $scope.dataSearch.pageIndex,
                    pageSize: $scope.dataSearch.pageSize,
                    codEstab: fS.isValidField($scope.dataSearch.codEstab),
                    checkBoxFecha: $scope.dataSearch.checkBoxFecha,
                    fechaInicio: fS.formatDateMoment($scope.dataSearch.fechaInicio),
                    fechaFin: fS.formatDateMoment($scope.dataSearch.fechaFin),
                    byEstado: [0, 1].includes($scope.dataSearch.byEstado) ? $scope.dataSearch.byEstado : null,
                    byPersona: [1, 2].includes($scope.dataSearch.byTipoPersona) ? fS.isValidField($scope.dataSearch.byPersona) : null,
                    byUsuario: fS.isValidField($scope.dataSearch.byUsuario)
                }

                showLoader();
                comprobanteEgresoSvc.getAll(params).then(response => {
                    $scope.comprobantesEgreso = response; 
                    if($scope.comprobantesEgreso.length>0){
                        $scope.dataSearch.totalRecords = $scope.comprobantesEgreso[0].totalRecords || 0;
                    }
                }).catch(error=>{
                    console.log(error)
                }).finally(()=>hideLoader());
            } catch (error) {
                console.log(error)
            }
        }

        $scope.resultRangeFilter = function (item) {
            $scope.dataSearch.fechaInicio = item.startDate,
                $scope.dataSearch.fechaFin = item.endDate
            getComprobantesEgreso();
        }

        $scope.refresh = function () {
            getComprobantesEgreso();
        }

        $scope.onClickBtnMore = function () {
            $scope.moreSearchOptions = !$scope.moreSearchOptions
        }

        $scope.onKeyupProveedor = function () {
            if (!$scope.proveedor.nombreProveedor) {
                $scope.dataSearch.byPersona = null;
                $scope.dataSearch.checkBoxFecha = true;
            }
        }
        $scope.onSelectProveedor = function (item) {
            $scope.dataSearch.byPersona = item.numeroIdentificacion;
            $scope.dataSearch.checkBoxFecha = true;
            getComprobantesEgreso();
        }

        //====================Empleado===========
        $scope.onKeyupEmpleado = function () {
            if (!$scope.searchEmpleado.nombreCompleto) {
                $scope.dataSearch.byPersona = null;
            }
        }
        $scope.onSelectEmpleado = function (item) {
            $scope.dataSearch.byPersona = item.nroIdentificacion;
            getComprobantesEgreso();
        }
        //====================Empleado===========

        $scope.onKeyupUser = function () {
            if (!$scope.modelNombreCompleto) {
                $scope.dataSearch.byUsuario = 0;
            }
        }

        $scope.onSelectUser = function (item) {
            $scope.dataSearch.byUsuario = item.idUsuario;
            getComprobantesEgreso();
        }

        $scope.pagechanged = function () {
            getComprobantesEgreso();
        };

        $scope.changePageSize = function () {
            $scope.dataSearch.pageIndex = 1;
            getComprobantesEgreso();
        };



        async function showAlert(){
            return await Swal.fire({
                icon: 'warning',
                html: '<small>Esta seguro/a de Anular este registro de pago ahora?</small>',
                input: 'text',
                inputPlaceholder: 'Ingrese la observación',
                showConfirmButton: true,
                confirmButtonText: 'Sí, anular',
                showCancelButton: true,
                cancelButtonText: 'No, cancelar!',
                allowOutsideClick: false,
                inputValidator: (value) => {
                    if (!value) {
                        return 'Ingrese la Observación!'
                    }
                    if (value.length <= 8) {
                        return 'La observación tiene que tener al menos 10 caracteres!'
                    }
                }
            })
        }

        /**
         * 
         * @param {*} codigoEstadoPago 
         * @param {*} estadosPago 
         * @returns 
         */
        function getDataIdEstadoPago(codigoEstadoPago, estadosPago) {
            const dataEstadoPago = estadosPago.find(ep => ep.codigo === codigoEstadoPago);
            return dataEstadoPago ? dataEstadoPago.idEstadoPago : 0;
        }

        /**
         * 
         * @param {*} cuentasPorPagar 
         * @param {*} cuotasPorPagar 
         * @param {*} estadosPago 
         * @returns 
         */
        function getDataParams(cuentasPorPagar, cuotasPorPagar, estadosPago) {
            // Agrupa cuentas por pagar
            const cuentasPorPagarAgrupado = cuentasPorPagar.reduce((acc, curr) => {
                let existeDato = acc.find(dataCxc => dataCxc.idCuentaPorPagar === curr.idCuentaPorPagar);
             //   let abono = curr.cobro ? curr.abono : 0;
                let abono =   curr.abono  ;

                if (!existeDato) {
                    acc.push({
                        idCuentaPorPagar: curr.idCuentaPorPagar,
                        abonoDoc: fS.instanceDecimal(curr.abonoDoc).toNumber(),
                        abono,
                    });
                } else {
                    existeDato.abono = fS.instanceDecimal(existeDato.abono).plus(curr.abono).toNumber();
                }
                return acc;
            }, []);

            // Agrupa cuotas por pagar
            const cuotasPorPagarAgrupado = cuotasPorPagar.reduce((acc, curr) => {
                let existeDato = acc.find(dataCxc => dataCxc.idCuotaPorPagar === curr.idCuotaPorPagar);
                //  let abono = curr.cobro ? curr.abono : 0;
                let abono = curr.abono

                if (!existeDato) {
                    acc.push({
                        idCuotaPorPagar: curr.idCuotaPorPagar,
                        abonoCuota: curr.abonoCuota,
                        abono,
                    });
                } else {
                    existeDato.abono = fS.instanceDecimal(existeDato.abono).plus(curr.abono);
                }
                return acc;
            }, []);

            // Calcula los valores residuales y el estado de pago para cuentas por cobrar
            const tempCuentasPorPagar = cuentasPorPagarAgrupado.map(item => {
                //let valorResiduo = fS.minus(item.abonoDoc,item.abono).toNumber()
                let valorResiduo = fS.instanceDecimal(item.abonoDoc).minus(item.abono).toNumber();

                //quitar cuando se haya validado bien tema de decimales en compras 
                let abonoDocRounded = fS.roundNumber(item.abonoDoc, 2);
                let abonoRounded = fS.roundNumber(item.abono, 2)
                let valorResiduoValidar = fS.minus(abonoDocRounded, abonoRounded, 2);
                
                return {
                    idCuentaPorPagar: item.idCuentaPorPagar,
                    abono: valorResiduo,
                    idEstadoPago: getDataIdEstadoPago(valorResiduoValidar === 0 ? 'PE' : 'PP', estadosPago)
                };
            });

            // Calcula los valores residuales y el estado de pago para cuotas por cobrar
            const tempCuotasPorCobrar = cuotasPorPagarAgrupado.map(item => {
                let valorResiduo = fS.instanceDecimal(item.abonoCuota).minus(item.abono).toNumber()
                
                return {
                    idCuotaPorPagar: item.idCuotaPorPagar,
                    abono: valorResiduo,
                    idEstadoPago: getDataIdEstadoPago(valorResiduo === 0 ? 'PE' : 'PP', estadosPago)
                };
            });

            // Retorna los datos agrupados y calculados
            return {
                cuenta: tempCuentasPorPagar,
                cuota: tempCuotasPorCobrar
            };
        }


        $scope.askToCancel = async function (item) {
            try {

                let cuentasPorPagar = [], cuotasPorPagar = [], estadosPago = [];

                let response = await comprobanteEgresoSvc.getDataToDelete(item.idComprobanteEgreso) ;
                
                cuentasPorPagar = response.cuentasPorPagar;
                cuotasPorPagar = response.cuotasPorPagar;
                estadosPago = response.estadosPago;

                if (cuentasPorPagar.length === 0 || cuotasPorPagar.length === 0) {

                    console.log("cuentasPorPagar", cuentasPorPagar);
                    console.log("cuotasPorPagar", cuotasPorPagar);
                    return;
                }

                let result = await showAlert();
                if (result.isConfirmed) {
                    try {

                        const dataParams = getDataParams(cuentasPorPagar, cuotasPorPagar, estadosPago);
                        const data = {
                            observacion: result.value,
                            ...dataParams
                        };  
                        
                       
                        showLoader();
                        comprobanteEgresoSvc.anular(item.idComprobanteEgreso, data).then(response => {
                            if (response.code == "0") {
                                fS.sweetAlert('warning', response.message, response.titleSms)
                            }
                            if (response.code == "1") {
                                fS.sweetAlert('success', response.message, response.titleSms, 1000)
                                getComprobantesEgreso();
                            }
                        }).catch(error => {
                            console.log(error);
                        }).finally(() => {
                            hideLoader();
                        })
                    } catch (error) {
                        hideLoader();
                        console.log(error)
                    }
                } 
            } catch (error) {
                console.log(error)
            }
        }


        $scope.getReport = async (item) => {
 
            const formatType = 'pdf';
            let dataParams = JSON.stringify({
                codEstab: item.codEstab,
                id: item.idComprobanteEgreso
            })

            const parameters = {
              
                reportParams: JSON.stringify({
                    hasParams: true,
                    codEstab: item.codEstab,
                    codigo: "RCEGR",
                    format: formatType,
                    aditionalParams: []
                }),
                dataParams
            }

            commonSvc.getReport({
                parameters,
                formatType,
                v2: true
            })
        }

    }


})(window.angular)