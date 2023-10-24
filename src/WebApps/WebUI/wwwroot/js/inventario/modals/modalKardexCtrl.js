

export {
    modalKardexCtrl
}

modalKardexCtrl.$inject = [
    '$scope',
    '$uibModalInstance',
    'commonService',
    'kardexService',
    'modalService',
    'nombreModal',
    'formulario',
    'toastService',
    'params'
];

function modalKardexCtrl($scope, $uibModalInstance, commonSvc, kardexSvc, modalSvc, nombreModal, fS, tS, params) {
    console.log(nombreModal)

    $scope.dataSearch = {};
    $scope.articulo = params;
    $scope.kardexs = [];

    $scope.data = {};


    onInit();
    async function onInit() {

        $scope.dataSearch.checkBoxFecha = true;

        let startOfMonth = moment().startOf('month').toDate();
        let endOfMonth = moment().endOf('month').toDate();
        $scope.dataSearch.fechaInicio = startOfMonth;
        $scope.dataSearch.fechaFin = endOfMonth;

        $scope.dataSearch.byArticulo = $scope.articulo.idArticulo;

        await commonSvc.getEstabAsign().then(response => {
            $scope.establecimientos = response;

            if ($scope.establecimientos.length > 0) {
                console.log($scope.establecimientos)
                let dataEstab = $scope.establecimientos.find(estab => (estab.predeterminado
                ));
                $scope.dataSearch.codEstab = dataEstab.codEstab;
                commonSvc.getDataFormEstabAsig(dataEstab).then(response => {
                    $scope.bodegas = response[1];
                    if ($scope.bodegas.length > 0) { 
                        let dataBodega = $scope.bodegas[0];
                        $scope.dataSearch.byBodega = dataBodega.idBodega
                    }
                })
            } else {
                tS.toastr('warning', 'NO TIENES ASIGNADO NINGÚN ESTABLECIMIENTO');
            }
        })

        getKardex();
    }

    function getKardex() {
        try {
            showLoader();
            $scope.dataSearch.checkBoxDefault = true;
            const params = Object.assign($scope.dataSearch, {
                checkBoxFecha: true,
                fechaInicio: fS.formatDateMoment($scope.dataSearch.fechaInicio),
                fechaFin: fS.formatDateMoment($scope.dataSearch.fechaFin),
            })

            kardexSvc.get(params).then(response => {
                if (Array.isArray(response)) {  
                    $scope.kardexs = response[2] || [];
                    if ($scope.kardexs.length === 0) {
                        hideLoader();
                        tS.toastr('info', 'No se encontraron los resultados');
                        drawTable();
                        return
                    }

                    $scope.data.cantTotalEntrada = calculoTotales("cantidadEntrada");
                    $scope.data.totalEntrada = calculoTotales("totalEntrada");

                    $scope.data.cantTotalSalida = calculoTotales("cantidadSalida");
                    $scope.data.totalSalida = calculoTotales("totalSalida");

                    $scope.data.stock = calculoTotales("saldo");
                    $scope.data.totalGenetal = calculoTotales("totalGeneral");

                    for (let value of $scope.kardexs) {
                        value.totalGeneral = (value.precioCosto * value.saldo).toFixed(2)
                    }

                    drawTabulator();
                }
                 
                if (response.code === "0") {
                    hideLoader();
                    Swal.fire({
                        icon: 'warning',
                        html: `<small>${response.message}</small>`
                    })
                }
            }).catch(error => {
                hideLoader()
                console.log(error)
            }).finally(() => hideLoader())
        } catch (error) {
            hideLoader();
            console.error(error)
        }
    }



    function drawTabulator() { 
        let table = new Tabulator('#table-kardex', {
            height: "400px",
            width: "100%",
            pagination: "local",
            langs: {
                "es-es": {
                    "pagination": {
                        "first": "Primera", //text for the first page button
                        "first_title": "Primer Pagina", //tooltip text for the first page button
                        "last": "Last",
                        "last_title": "Last Page",
                        "prev": "Prev",
                        "prev_title": "Prev Page",
                        "next": "Next",
                        "next_title": "Next Page",
                        "all": "All",
                    },
                }
            },
            paginationSize: 50,
            paginationSizeSelector: [50, 100],
            // layout:"fitDataFill",
            // layout: "fitDataStretch",
            // layout:"fitColumns", 
            layout: "fitDataFill",

            //layout:"fitDataTable",           
            //renderHorizontal:"virtual",
            // autoColumns:true,
            columnHeaderVertAlign: "bottom",
            // movableRows:true,              
            rowFormatter: function (row) {
                if (row.getData().tipoDoc === 'CIV') {
                    // row.getElement().classList().add(row.getData().style);                                        
                    row.getElement().style.backgroundColor = "#fedf7e";
                }
                if (row.getData().style === 'table-danger') {
                    row.getElement().style.backgroundColor = "#F5BCB0";
                }
            },
            data: $scope.kardexs,
            columns: [{
                //create column group ---frozen:true,
                title: "Descripcion",
                widthGrow: 2,
                frozen: true,
                columns: [{
                    title: "F. Emision",
                    field: "fechaEmision",
                    hozAlign: "center",
                    headerSort: false,
                    sorter: "date",
                    width: 120
                },
                {
                    title: "T. Doc",
                    field: "tipoDoc",
                    hozAlign: "center",
                    headerSort: false,
                    width: 60
                },
                {
                    title: "Nro. Doc",
                    field: "nroDocumento",
                    hozAlign: "left",
                    headerSort: false,
                    width: 130
                },
                {
                    title: "Cliente/Proveedor",
                    field: "clienteProveedor",
                    headerSort: false,
                    hozAlign: "left",
                    width: 150,
                    tooltip: true
                },
                {
                    title: "Bodega",
                    field: "bodega",
                    hozAlign: "center",
                    headerSort: false,
                    width: 150
                },
                {
                    title: "Usuario",
                    field: "usuario",
                    hozAlign: "center",
                    headerSort: false,
                    width: 150
                },
                {
                    title: "Estado",
                    field: "estado",
                    hozAlign: "center",
                    headerSort: false,
                    width: 100
                },

                ],
            },
            { //create column group
                title: "Entradas",
                columns: [{
                    title: "Medida",
                    field: "medidaEntrada",
                    width: 70,
                    headerSort: false,
                    cssClass: "table-entradas",
                },
                {
                    title: "Cant.",
                    field: "cantidadEntrada",
                    width: 60,
                    headerSort: false,
                    cssClass: "table-entradas",
                    bottomCalc: sumCantidadEntrada,
                },
                {
                    title: "Costo U.",
                    field: "costo",
                    hozAlign: "center",
                    headerSort: false,
                    sorter: "date",
                    width: 75,
                    cssClass: "table-entradas",
                },
                {
                    title: "Total",
                    field: "totalEntrada",
                    hozAlign: "center",
                    headerSort: false,
                    sorter: "date",
                    width: 75,
                    cssClass: "table-entradas",
                },
                ],
            },
            { //create column group
                title: "Salidas",
                columns: [{
                    title: "Medida",
                    field: "medidaSalida",
                    width: 70,
                    headerSort: false,
                    cssClass: "table-salidas",
                },
                {
                    title: "Cant.",
                    field: "cantidadSalida",
                    width: 60,
                    headerSort: false,
                    cssClass: "table-salidas",
                    bottomCalc: sumCantidadSalida,
                },
                {
                    title: "P. Venta",
                    field: "venta",
                    hozAlign: "center",
                    headerSort: false,
                    sorter: "date",
                    width: 75,
                    cssClass: "table-salidas",
                },
                {
                    title: "Total",
                    field: "totalSalida",
                    hozAlign: "center",
                    headerSort: false,
                    width: 75,
                    cssClass: "table-salidas",
                    bottomCalc: sumTotalSalida,
                },
                ],
            },
            { //create column group
                title: "Saldos",
                columns: [{
                    title: "Cant. ",
                    field: "saldo",
                    width: 60,
                    headerSort: false,
                    cssClass: "table-saldos",
                },
                {
                    title: "Costo U.",
                    field: "precioCosto",
                    width: 70,
                    headerSort: false,
                    sorter: "number",
                    cssClass: "table-saldos",
                },
                {
                    title: "Total",
                    field: "totalGeneral",
                    hozAlign: "center",
                    width: 60,
                    headerSort: false,
                    sorter: "number",
                    cssClass: "table-saldos",
                },
                ],
            },
            ]
        });

        //trigger an alert message when the row is clicked
        table.on("rowClick", function (e, row) {
            openModalTipoDocumento(row.getData())
        });
    }

    function sumCantidadEntrada() {
        return $scope.data.cantTotalEntrada || 0
    } 

    function sumCantidadSalida() {
        return $scope.data.cantTotalSalida || 0
    }

    function sumTotalSalida() {
        return $scope.data.totalSalida || 0
    }  

    $scope.openModalSearch = async () => {
        const {
            MODAL_FILTRO_CSHTML
        } = nombreModal.kardex;
        const modalRef = modalSvc.openModalCustom({
            controller: ModalFiltroKardex,
            template: MODAL_FILTRO_CSHTML,
            isRenderRazorPartial: true,
            size: 'lg',
            params: {
                articulo: $scope.articulo,
                dataSearch: $scope.dataSearch,
                articuloFiltro: $scope.articuloFiltro
            },
        })
        modalRef.result.then(response => {
            $scope.articulo = response.articulo;
            $scope.dataSearch = response.dataSearch;
            $scope.articuloFiltro = response.articuloFiltro;
            if (typeof response === 'object' && $scope.dataSearch.isSearch) {
                getKardex();
            }
        })
    }




    function calculoTotales(prop) {
        let total = $scope.kardexs.map(item => (item[prop] || 0)).reduce((obj, cur) => Number(obj) + Number(cur), 0);

        return fS.roundNumber(total, 3)
    }


    // getTotalesSaldo() {            
    //     if(this.form.campo(this.kardexs) || this.kardexs.length===0) return

    //     let obj = this.kardexs[this.kardexs.length - 1];        
    //     this.precioCostoSaldo = this.form.roundNumber(obj.precioCosto, 5);
    //     this.totalGeneral     = this.form.roundNumber(obj.totalGeneral, 5);       
    // }

    $scope.getReport = async function () {
        if ($scope.kardexs.length === 0) {
            tS.toastr('warning', 'No hay registros para el reporte', 'Reporte')
            return
        }

        const {
            value: formatType
        } = await Swal.fire({
            icon: 'warning',
            title: 'Tipo Formato',
            input: 'radio',
            inputOptions: {
                pdf: 'PDF',
                excel: 'EXCEL'
            },
            inputValidator: (value) => {
                if (!value) {
                    return 'Seleccione el Tipo de Formato!'
                }
            },
            confirmButtonText: '<i class="mdi mdi-download"></i> Descargar',
            showDenyButton: true,
            denyButtonText: 'No, cancelar',
            allowOutsideClick: false,
            showLoaderOnDeny: true,
            allowEscapeKey: false
        })

        if (!formatType) return

        let parameters = {
            hasIdUsuarioRol: true,
            reportParams: JSON.stringify({
                codigo: "KRG",
                format: formatType,
                codEstab: $scope.dataSearch.codEstab,
                hasParams: true,
                aditionalParams: []
            }),

            dataParams: JSON.stringify(Object.assign($scope.dataSearch, {
                checkBoxFecha: true
            }))
        }

        commonSvc.getReport({
            parameters,
            formatType
        })
    }


    function openModalTipoDocumento(item) {
        try {
            if (("idDocumento" in item) && ("tipoDoc") in item) {
                if (item.codTransaccion == 'E' && item.tipoDoc == 'FE') {
                    showLoader()
                    this._mS.getData('get', 'DocumentoRecibido/Preview/' + item.idDocumento, null, true).then(
                        response => {
                            hideLoader()
                            $('#facturaModal').modal('show')
                            $('#bodyFactura').html(response.payload)
                        }
                    ).catch(error => {
                        hideLoader()
                        console.log(error)
                    })
                } else {
                    this._commonSvc.viewDetailDocumentII({
                        id: item.idDocumento,
                        codTransaccion: item.codTransaccion,
                        codigoDocumento: item.tipoDoc,
                        size: 'xl',
                        windowClass: 'uibModalFullScreen'
                    })
                }
            }
        } catch (error) {
            console.log(error)
        }
    }


    $scope.closeModal = function () {
        $uibModalInstance.close();
    }

}