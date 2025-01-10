let mainPath = `/Home/Index?name=~/Pages/AprobacionDocumento/`;

app.component("modalAprobacionSeleccionarDoc", {
    templateUrl: `${mainPath}_ModalAprobacionSeleccionarDoc.cshtml`,
    bindings: {
        resolve: '<',
        close: '&',
        dismiss: '&',
        isNotModal: '='
    },
    controller: ['$scope', '$injector', function ($scope, $injector) {

        const $ctrl = this;

        const tS = $injector.get('toastService');
        const fS = $injector.get('formulario');
        const proformaSvc = $injector.get('proformaService');
        const notaEntregaSvc = $injector.get('notaEntregaService');

        $scope.tipos = [
            { code: 1, desc: 'NOTA DE ENTREGA A FACTURA' },
            { code: 2, desc: 'PROFORMA A FACTURA' },
            { code: 3, desc: 'PROFORMA A NOTA DE ENTREGA' },
        ]

        $scope.dataSearch = {
            tipo: 0,
            radioMultipleIndividual: 'MULTIPLE',
            fechaInicio: new Date(),
            fechaFin: new Date(),
            pageIndex: 1,
            pageSize: 50,
            totalRecords: 0,
            maxSize: 5
        }

        $scope.optionsTable = {
            rowSelection: true,
            multiSelect: true,
            autoSelect: true
        }

        $scope.data = {
            codEstab: 0,
            idTiempoCredito: 0,
            fechaEmision: new Date(),
            fechaVencimiento: new Date(),
            subTotalSinImpuestos: 0,
            iva: 0,
            subTotalIva: 0,
            subTotalIvaCero: 0,
            subTotalExentoIva: 0,
            subTotalNoObjetoIva: 0,
            subTotalNetoIva: 0,
            subTotalNetoExentoIva: 0,
            subTotalNetoNoObjetoIva: 0,
            totalIce: 0,
            irbpnr: 0,
            propina: 0,
            transporte: 0,
            recargo: 0,
            porcentajeDescuento: 0,
            totalDescuento: 0,
            total: 0
        }
        $scope.dataClone = {};
        $scope.dataClone.fechaEmision = new Date();
        $scope.dataClone.porcentajeDescuento = 0;
        $scope.dataClone.totalDescuento = 0;

        $scope.cliente = {
            idCliente: 0,
            nombreComercial: null,
            nombreFiscal: null,
            numeroIndentificacion: null,
        };

        $scope.establecimientos = [];
        $scope.ptosEmision = [];
        $scope.bodegas = [];
        $scope.decimal = {};


        $scope.docs = [];
        $scope.docsSelected = [];




        $ctrl.$onInit = function () {
            const { mainDataForm } = $ctrl.resolve.params;
            try {
                let {
                    estabs,
                    tarifasImpuesto,
                    decimal,
                } = mainDataForm;

                /**
                 * Establecimiento - Impuesto Tarifa 
                 */
                $scope.establecimientos = estabs;

                let dataEstab = $scope.establecimientos.find(item => (item.defaultEstab))

                $scope.data.codEstab = dataEstab.codEstab;
                $scope.dataSearch.codEstab = $scope.data.codEstab; //Filtro
                $scope.dataClone.codEstab = $scope.data.codEstab;


                //===========Puntos Emisiones============================================== 
                $scope.ptosEmision = dataEstab.puntosEmision;
                let dataPtoEmi = $scope.ptosEmision.find(item => (item.defaultPtoEmi))
                $scope.data.idPuntoEmision = dataPtoEmi.idPuntoEmision;
                $scope.dataSearch.idPuntoEmision = $scope.data.idPuntoEmision;

                //Decimal 
                $scope.decimal = decimal;
                $scope.tarifasImpuesto = tarifasImpuesto;


            } catch (error) {
                console.log(error);
            }
        }


        
        

        function clearDocs(){
            $scope.docs = [];
            $scope.docsSelected=[];
        }

        function isValidFilter() {
            if(!($scope.dataSearch.tipo>0)){
                tS.toastr({
                    type: 'warning',
                    message: 'Seleccione el documento a aprobar'
                })
                return
            }
            if (!$scope.dataSearch.codEstab) {
                tS.toastr('warning', 'Seleccione el Establecimiento');
                return
            }
            if (!($scope.cliente.idCliente > 0)) {
                tS.toastr('warning', 'Seleccione el cliente');
                return
            }
            if (!$scope.dataSearch.fechaInicio || !$scope.dataSearch.fechaFin) {
                tS.toastr('warning', 'Seleccione rango de fecha')
                return
            }


            return true;
        }

        $scope.esRadioIndividual = function(){
            return $scope.dataSearch.radioMultipleIndividual==='INDIVIDUAL';
        }

        $scope.onChangeRadioMultipleIndividual = function(){
            $scope.optionsTable.rowSelection = $scope.dataSearch.radioMultipleIndividual==='MULTIPLE';
            $scope.dataSearch.pageIndex = 1;
            $scope.dataSearch.totalRecords = 0;
            clearDocs()
        }

        $scope.onChangeTipo = function () {
            clearDocs()
        }


        $scope.onChangeEstab = async function () {
            try {
                let { isConfirmed } = await Swal.fire({
                    title: 'Cambiar Establecimiento?',
                    text: "Se revertiran los documentos seleccionados en caso de existir!",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Si, cambiar!',
                    cancelButtonText: 'No, cancelar!',
                })

                if (isConfirmed) {
                    clearDocs()

                    let dataEstab = $scope.establecimientos.find(item => item.codEstab === $scope.dataSearch.codEstab);

                    $scope.ptosEmision = dataEstab.puntosEmision;

                    let dataPtoEmi = $scope.ptosEmision.find(item => (item.defaultPtoEmi))
                    $scope.data.idPuntoEmision = dataPtoEmi.idPuntoEmision;

                    $scope.dataClone.codEstab = $scope.dataSearch.codEstab;
                     
                        getDocs()
                        $scope.$apply()
                   
                } else {
                    $scope.dataSearch.codEstab = $scope.dataClone.codEstab;
                    $scope.$apply();
                }

            } catch (error) {
                console.log(error);
            }
        }

        $scope.resultDateRange = function (item) {
            $scope.dataSearch.checkBoxFecha = true;
            $scope.dataSearch.fechaInicio = item.startDate;
            $scope.dataSearch.fechaFin = item.endDate;
 
                getDocs()
           
        }

        $scope.onKeyupCliente = function () {
            if (fS.isValidField($scope.cliente.nombreCliente)) {
                $scope.dataSearch.byCliente = 0;
            }
        }

        $scope.selectedClienteSearch = function (item) {
            $scope.cliente = item;
            $scope.cliente.nombreCliente = item.nombreFiscal;
            clearDocs();
                getDocs()
            
        }

        $scope.refresh = function () {

            if ($scope.docsSelected.length > 0) {
                tS.toastr('warning', 'Tienes documentos seleccionados')
                return
            }
            
                getDocs() 
        }

        $scope.pageChanged = function () {
            getDocs()
        }


        function getDocs() {

            if (!isValidFilter()) return;

            if($scope.esRadioIndividual()) {
                clearDocs()
                return
            };
            
            if ($scope.dataSearch.tipo === 1) {
                getNotasEntrega();
                return
            }

            getProformas();
        }

        function getDataSearchNotasEntrega(){
            return {
                codEstab: $scope.dataSearch.codEstab,
                byCliente: $scope.cliente.idCliente,
                checkBoxFecha: $scope.dataSearch.checkBoxFecha,
                //codEstado: "PAPR",
                fechaInicio: fS.formatDateMoment($scope.dataSearch.fechaInicio),
                fechaFin: fS.formatDateMoment($scope.dataSearch.fechaFin),
                pageIndex: $scope.dataSearch.pageIndex,
                pageSize: $scope.dataSearch.pageSize,
                idPuntoEmision: $scope.dataSearch.idPuntoEmision > 0 ? $scope.dataSearch.idPuntoEmision : null,
                convertToDoc: false,
                nroSecuencial: fS.validAndFormatedRangeSequential($scope.dataSearch.nroSecuencial),
            }
        }

        function getNotasEntrega() { 
            clearDocs()
            notaEntregaSvc.getAll(getDataSearchNotasEntrega()).then(async (response) => {
                let { notaEntregas, dataTotals } = response;
                console.log(notaEntregas)
                $scope.docs = notaEntregas;
                $scope.dataSearch.totalRecords = dataTotals.totalRecords;
            })
        }

        function getDataSearchProformas(){
            return  {
                checkBoxFecha: $scope.dataSearch.checkBoxFecha,
                codEstab: $scope.dataSearch.codEstab,
                idPuntoEmision: $scope.dataSearch.idPuntoEmision > 0 ? $scope.dataSearch.idPuntoEmision : 0,
                byCliente: $scope.cliente.idCliente,
                fechaInicio: fS.formatDateTimeZone($scope.dataSearch.fechaInicio),
                fechaFin: fS.formatDateTimeZone($scope.dataSearch.fechaFin),
                pageIndex: $scope.dataSearch.pageIndex,
                pageSize: $scope.dataSearch.pageSize,
                codEstado: "PE",
                nroSecuencial: fS.validAndFormatedRangeSequential($scope.dataSearch.nroSecuencial),
            }
        }

        function getProformas() { 
            clearDocs()
            proformaSvc.getAll(getDataSearchProformas()).then(response => {
                console.log(response)
                $scope.docs = response.proformas;
                $scope.dataSearch.totalRecords = response.dataTotals.totalRecords;
                
            })
        }

        $scope.buscarPorNroSecuencial = function(){

            if(!isValidFilter()) return; 

            if(!fS.isValidField($scope.dataSearch.nroSecuencial)) {
                tS.toastr({
                    type: 'warning',
                    message: 'Ingrese número secuencial'
                })
                return 
            } 

            $scope.dataSearch.checkBoxFecha = true;

            if (!fS.validAndFormatedRangeSequential($scope.dataSearch.nroSecuencial)) {
                tS.toastr('error', 'Define correctamente el número de secuencial o el rango de número secuencial!')
                return
            }
            
            $scope.dataSearch.checkBoxFecha = false;
            


            if ($scope.dataSearch.tipo === 1) {
                notaEntregaSvc.getAll(getDataSearchNotasEntrega()).then(response=>{
                    console.log(response)
                    let data = response.notaEntregas;
                    if(data.length>0){
                        setDocs(data)
                        return
                    }
                    tS.toastr({
                        type: 'info',
                        message:  'No se encontro los datos'
                    })
                })
                return
            }

            proformaSvc.getAll(getDataSearchProformas()).then(response=>{
                let data = response.proformas;
                if(data.length>0){
                    setDocs(data)
                    return
                }
                tS.toastr({
                    type: 'info',
                    message:  'No se encontro los datos'
                })
                console.log(response)
            })
        }

        function setDocs(data){
            const mergedArray = [
                ...new Map([...$scope.docs, ...data].map(item => [item.idDocumento, item])).values()
              ];
              $scope.docsSelected = mergedArray;
              $scope.docs = mergedArray;
        }

        $scope.close = function () {
            $ctrl.close();
        }


        console.log(this)

    }]



})