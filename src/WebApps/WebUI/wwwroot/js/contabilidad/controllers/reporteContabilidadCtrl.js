(function(){

    'use strict';

    app.controller('reporteContabilidadCtrl', reporteContabilidadCtrl);

    reporteContabilidadCtrl.$inject = ['$scope', '$injector'];

    function reporteContabilidadCtrl($scope, $injector)    {
        let cuentaPorCobrarSvc = $injector.get("cuentaPorCobrarService");
        let tS = $injector.get("toastService");
        let fS = $injector.get("formulario");
        const DOC_TYPE = $injector.get('DOC_TYPE');
        const commonSvc = $injector.get('commonService');

        $scope.dataSearch = {
            codEstab: '',
            idPuntoEmision: 0,
            ckFecha: true,  
            idCliente: 0,
            codEstado: '',
            codDoc: '',
            ckCuotas: false,
            ckCxcVencida: false
        }
        $scope.cliente = {};
        initial();
        function initial() {
            showLoader();
            cuentaPorCobrarSvc
                .getDataFilterReport()
                .then((response) => {
                    const { estabs, estadosDoc, tiposDoc } = response;
                    $scope.establecimientos = estabs;
                    $scope.estadosDoc = estadosDoc;
                    $scope.tiposDoc = tiposDoc;
                    let dataEstab = $scope.establecimientos.find((estab) => estab.defaultEstab);
                    $scope.puntosEmision = dataEstab.puntosEmision;
                    let dataPuntoEmision = $scope.puntosEmision.find((ptoEmi) => ptoEmi.defaultPtoEmi);
                    $scope.dataSearch.codEstab = dataEstab.codEstab;
                    $scope.dataSearch.idPuntoEmision = dataPuntoEmision.idPuntoEmision;

                    if ($scope.estadosDoc.length > 0) {
                        $scope.dataSearch.codEstado = estadosDoc.find((estado) => estado.codigo === 'NCBR').codigo;
                    }
                })
                .finally(() => hideLoader());
        }

        $scope.onChangeEstab = () => {
            let dataEstab = $scope.establecimientos.find((estab) => estab.codEstab === $scope.dataSearch.codEstab);
            $scope.puntosEmision = dataEstab.puntosEmision;
            if ($scope.puntosEmision.length > 0) {
                dataSearch.idPuntoEmision = $scope.puntosEmision.find((pto) => pto.defaultPtoEmi).idPuntoEmision;
            } else {
                tS.toastr('warning', 'No tienes asignados puntos de emisión!') 
                $scope.dataSearch.idPuntoEmision = 0;
            }
        };


        $scope.resultRangeFilter = function (item) {
            $scope.dataSearch.fechaInicio = item.startDate,
            $scope.dataSearch.fechaFin = item.endDate;
        }


        $scope.onKeyupCliente = function () { 
            if (!$scope.cliente.nombreCliente) {
                $scope.dataSearch.identificacion = null;

            }
        }

        $scope.onSelectCliente = function (data) { 
            $scope.dataSearch.identificacion = data.numeroIdentificacion;
            $scope.dataSearch.idCliente = data.idCliente;

        }




        const getTipoDoc = () => {
            if ($scope.dataSearch.codDoc === DOC_TYPE.FV) {
                return DOC_TYPE.FV_SRI;
            }
            return $scope.dataSearch.codDoc
        }
        
        $scope.getReport = (format) => {
            let dataParams = {
                tipo: 1,
                ckFecha: $scope.dataSearch.ckFecha,
                codEstab: $scope.dataSearch.codEstab,
                idCliente: fS.isValidField($scope.dataSearch.idCliente),
                codEstado: fS.isValidField($scope.dataSearch.codEstado),
                fechaInicio: fS.formatDateMoment($scope.dataSearch.fechaInicio),
                fechaFin: fS.formatDateMoment($scope.dataSearch.fechaFin),
                ckCxcVencida: $scope.dataSearch.ckCxcVencida,
                ckCuotas: $scope.dataSearch.ckCuotas,
                codDoc: fS.isValidField(getTipoDoc())
            };

            const parameters = {
                hasIdUsuarioRol: true,
                reportParams: JSON.stringify({
                    hasParams: false,
                    codigo: $scope.dataSearch.ckCuotas ? 'CCCR' : 'CCR',
                    format: format,
                    aditionalParams: []
                }),
                dataParams: JSON.stringify(dataParams)
            };
            
            commonSvc.getReport({
                parameters,
                formatType: format
            })
        }















    }




})(window.angular)