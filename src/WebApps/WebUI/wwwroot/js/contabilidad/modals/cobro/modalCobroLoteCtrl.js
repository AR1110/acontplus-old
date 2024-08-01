//@ts-check
export {
    modalCobroLoteCtrl
}

modalCobroLoteCtrl.$inject = [
    '$scope',
    '$uibModalInstance',
    '$injector',
    'params'
]
function modalCobroLoteCtrl($scope, $uibModalInstance, $injector, params) {
    let { data, selectedDocumentos } = params;

    const comprobanteIngresoSvc = $injector.get('comprobanteIngresoService');
    const modalCobroSvc = $injector.get('modalCobroService').get();
    const fS = $injector.get('formulario');
    const nombreModalContabilidad = $injector.get('nombreModalContabilidad');
    const modalSvc = $injector.get('modalService');



    let dataFormaCobro = {};

    $scope.data = {};

    $scope.dataCuentaPorCobrar = {
        importeTotal: 0,
        saldo: 0,
        abono: 0,
    }
    $scope.selectedDocumentos = [];
    $scope.selectedDocumentosClone = [];

    $scope.cobros = [];
    $scope.datosCobro = [];

    let cuentasPorCobrarEstado = [];
    let cuotasPorCobrarEstado = [];


    $scope.expandShowCuota = expandShowCuota;
    $scope.showCobroDetalle = showCobroDetalle;
    $scope.openModalFormaCobro = openModalFormaCobro;
    $scope.askToDeleteFormaCobro = askToDeleteFormaCobro;
    $scope.showInfoCobro = showInfoCobro;
    $scope.save = save;
    $scope.closeModal = closeModal;

    console.log(modalCobroSvc)
    initiateLoad();
    function initiateLoad() {
        try {
            let idCuentaPorCobrar = null, idCliente = 0;

            if (Object.prototype.toString.call(data) === '[object Object]') {
                idCuentaPorCobrar = data.idCuentaPorCobrar;
                idCliente = data.idCliente;
            }

            if (selectedDocumentos !== null && Array.isArray(selectedDocumentos)) {
                idCliente = selectedDocumentos[0].idCliente;
            }

            showLoader();
            comprobanteIngresoSvc.getDataForm(idCuentaPorCobrar, idCliente).then(response => {

                dataFormaCobro = response;
                console.log(modalCobroSvc)
                modalCobroSvc.setEstadoCobro(dataFormaCobro.estadosPago);
                modalCobroSvc.setConfigCobro(dataFormaCobro.configCobro);

                //Cuando proviene de Cuentas por Cobrar
                if (selectedDocumentos && Array.isArray(selectedDocumentos)) {
                    let selectedDocsTemp = modalCobroSvc.calcularInteresMora(selectedDocumentos)

                    console.log(selectedDocsTemp)
                    $scope.selectedDocumentos = structuredClone(selectedDocsTemp);
                    $scope.selectedDocumentosClone = structuredClone(selectedDocsTemp);


                    let dataSelectedDoc = selectedDocumentos[0];
                    $scope.dataCuentaPorCobrar = {
                        idCliente: dataSelectedDoc.idCliente,
                        razonSocialComprador: dataSelectedDoc.razonSocialComprador,
                        codEstab: dataSelectedDoc.codEstab,
                        identificacionComprador: dataSelectedDoc.identificacionComprador
                    }

                }

                //Cuando Proviene de Factura o Nota Entrega (Cobro Rápido)
                if (idCuentaPorCobrar > 0) {
                    let selectedDocsTemp = modalCobroSvc.calcularInteresMora(response.cuentaPorCobrar);
                    $scope.selectedDocumentos = structuredClone(selectedDocsTemp);
                    $scope.selectedDocumentosClone = structuredClone(selectedDocsTemp);

                    if ($scope.selectedDocumentos.some(item => [null, undefined, []].includes(item.cuotas))) {
                        fS.sweetAlert('warning', 'No posee cuotas');
                        throw new Error('No posee cuotas');
                    }

                    let {
                        codEstab,
                        idCliente,
                        identificacionComprador,
                        razonSocialComprador,
                        serieComprobante,
                        fechaEmision,
                        importeTotal,
                        saldo,
                        abono
                    } = $scope.selectedDocumentos[0];

                    $scope.dataCuentaPorCobrar = {
                        codEstab,
                        idCliente,
                        identificacionComprador,
                        razonSocialComprador,
                        serieComprobante,
                        fechaEmision: fS.formatDateMoment(fS.formatDate(fechaEmision)),
                        importeTotal,
                        saldo,
                        abono
                    }
                }

                getTotalesCuota();

            }).catch(error => {
                console.log(error)
            }).finally(() => hideLoader());
        } catch (error) {
            hideLoader();
            console.log(error)
        }
    }



    function getTotalesCuota() {
        let importeTotal = fS.instanceDecimal(0),
            abono = fS.instanceDecimal(0), 
            totalMora = fS.instanceDecimal(0), 
            saldoActualDoc = fS.instanceDecimal(0)

        for (let item of $scope.selectedDocumentos) {
            importeTotal = importeTotal.plus(item.importeTotal); 
            abono = abono.plus(item.abono);

            for(let dataCuota of item.cuotasCalculadas){
                totalMora = totalMora.plus(dataCuota.interesPorMoraActual || 0); 
            }
            saldoActualDoc = saldoActualDoc.plus(item.saldoActualDoc)
        }

        $scope.data.importeTotal = importeTotal.toNumber();
        $scope.data.totalSaldo = saldoActualDoc.toNumber();
        $scope.data.totalAbonoAnterior = abono.toNumber();
        $scope.data.totalMora = totalMora.toNumber(); 
        $scope.data.totalValorAbono = 0;
        $scope.data.valorCambio = 0;
        $scope.data.saldoActualDoc = saldoActualDoc.toNumber();
        $scope.data.totalSaldoDoc = saldoActualDoc.toNumber();

        //cuando se realiza cobro desde modulo de comprobante ingreso  
        $scope.dataCuentaPorCobrar.importeTotal = $scope.data.importeTotal
        $scope.dataCuentaPorCobrar.abono = $scope.data.totalAbonoAnterior
        $scope.dataCuentaPorCobrar.saldo = $scope.data.totalSaldo
        $scope.dataCuentaPorCobrar.totalMora = $scope.data.totalMora; 

    }


    function expandShowCuota(item) {
        item.display = !item.display
    }

    function showCobroDetalle(data) {
        console.log(modalCobroSvc)
        let tempDetails = modalCobroSvc.getCobrosDetalle().filter(item => item.idCuotaPorCobrar === data.idCuotaPorCobrar && item.idCuentaPorCobrar === data.idCuentaPorCobrar);
        let infoCobrosDetalle = [];

        for (let pd of tempDetails) {
            if (pd.abono > 0) {
                let datoCobro = $scope.datosCobro.find(item => item.secuencial === pd.secuencial);
                infoCobrosDetalle.push({
                    ...pd,
                    subEntidadFinanciera: datoCobro.subEntidadFinanciera,
                    posfechado: datoCobro.posfechado ? 'SI' : 'NO'
                })
            }
        }

        let index = 1;
        let message = '';

        message = `<table class="table table-bordered table-sm">
                                <thead>
                                    <tr class="small">
                                        <th>N°</th>                                
                                        <th>Entidad Financiera</th>                                
                                        <th>Abono</th>
                                        <th>Saldo</th>
                                        <th>PosFechado</th>
                                    </tr>
                                </thead>
                                <tbody>`
        for (const item of infoCobrosDetalle) {
            message += `<tr class="small">
                                    <td>${index++}</td>                                                            
                                    <td>${item.subEntidadFinanciera}</td>                                                            
                                    <td>${item.abono}</td>
                                    <td>${item.saldo}</td>
                                    <td>${item.posfechado}</td>
                                </tr>`

        }
        message += `</tbody></table>`

        Swal.fire({
            icon: 'info',
            title: `<span>Cuota ${data.nroCuota}:</span> $${data.cuota} <br> <span>Mora:</span> $${data.mora}`,
            width: 600,
            html: message
        })
    }

    async function openModalFormaCobro() {
        try {
            if ($scope.data.totalSaldo == 0) {
                fS.sweetAlert('warning', 'No hay cuotas pendientes.')
                return
            }
            let { fileCtrl, ctrl, template } = nombreModalContabilidad.FORMA_COBRO;
            let controller = (await import(fileCtrl))[ctrl];

            let modalRef = modalSvc.openModalCustom({
                controller,
                template,
                size: 'lg',
                params: {
                    dataFormaCobro: structuredClone(dataFormaCobro),
                    dataCuentaPorCobrar: $scope.dataCuentaPorCobrar,
                    saldo: $scope.data.totalSaldo,
                    datosCobro: $scope.datosCobro
                },
                isRenderRazorPartial: true
            })

            modalRef.result.then(result => {
                if (result && typeof result === 'object') {
                    setDataFormaCobro(result);
                }
            })

        } catch (error) {
            console.log(error)
        }
    }

    function setDataFormaCobro(result) {
        try {
            let { posfechado, valorAbono } = result;

            modalCobroSvc.setCuentasPorCobrar($scope.selectedDocumentos);
            modalCobroSvc.setUniqueIndex ($scope.datosCobro.length + 1)
            modalCobroSvc.setEsAbonoPosfechado(posfechado);
            modalCobroSvc.setValorAbono(valorAbono);

            //--------agregando abono ---
            modalCobroSvc.aplicarAbono();

            $scope.cobrosDetalle = modalCobroSvc.getCobrosDetalle()
            $scope.selectedDocumentos = modalCobroSvc.getCuentasPorCobrar(); 


            let abonoCuota = modalCobroSvc.getAbonoCuota();



            addDatosCobro(result, abonoCuota);

            calculoTotales();

            fS.sweetAlert('success', 'Abonado Correctamente', '', 1000);
        } catch (error) {
            fS.sweetAlert('error', `Algo salio mal: ${error}`)
            console.log(error);
        }
    }

    function addDatosCobro(obj, abonoCuota) {
        $scope.datosCobro.push({
            ...obj,
            abonoCuota: fS.roundNumber(abonoCuota, 2),
            secuencial: modalCobroSvc.getUniqueIndex()
        })
    }

    //Calculo de abono y saldo una vez agregado el forma pago 
    function calculoTotales() {

        let { totalValorAbono, totalValorAbonoEfectivo } = $scope.datosCobro.reduce((prev, curr) => {
            prev.totalValorAbono = fS.instanceDecimal(prev.totalValorAbono).plus(curr.valorAbono).toNumber();
            if (curr.codEntidadFinanciera === "EFE") {
                prev.totalValorAbonoEfectivo = fS.plus(prev.totalValorAbonoEfectivo, curr.valorAbono).toNumber();
            }
            return prev;
        }, {
            totalValorAbono: 0,
            totalValorAbonoEfectivo: 0
        });

        let totalSaldo = $scope.selectedDocumentos.flatMap(item => item.cuotasCalculadas)
            .reduce((prev, curr) => fS.plus(prev, curr.saldoTotalActual).toNumber(), 0);
        let valorCambio = 0;

        $scope.data.totalValorAbono = fS.roundNumber(totalValorAbono, 5);
        $scope.data.totalSaldo = fS.roundNumber(totalSaldo, 5);

        if (totalValorAbonoEfectivo >= $scope.dataCuentaPorCobrar.saldo) {
            valorCambio = fS.minus(totalValorAbonoEfectivo, $scope.dataCuentaPorCobrar.saldo).toNumber();
        }

        $scope.data.valorCambio = fS.roundNumber(valorCambio, 5);


    }


    async function askToDeleteFormaCobro(item) {
        let { isConfirmed } = await Swal.fire({
            html: `<small>Esta seguro/a de eliminar este Abono ahora?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, eliminar',
            cancelButtonText: 'No, cancelar'
        })
        try {
            if (isConfirmed) {

                $scope.$apply(() => {

                    modalCobroSvc.setCobrosDetalle([]);
                    modalCobroSvc.setHistorialCuentas([]) ;   

                    let index = $scope.datosCobro.indexOf(item);
                    $scope.datosCobro.splice(index, 1);

                    //Todas las cuotas en su estado original                     
                    for (let item of $scope.selectedDocumentos) {
                        item.cuotasCalculadas = structuredClone(item.cuotasCalculadasClone);
                    }

                    modalCobroSvc.setCuentasPorCobrar($scope.selectedDocumentos);

                    getTotalesCuota();
 

                    //Recalculamos las cuotas con los abonos restantes   
                    let uniqueIndex = 0;
                    modalCobroSvc.uniqueIndex = uniqueIndex;
                    for (let item of $scope.datosCobro) {
                        uniqueIndex++;
                        modalCobroSvc.setUniqueIndex(uniqueIndex);

                        modalCobroSvc.setValorAbono(item.valorAbono);
                        modalCobroSvc.setEsAbonoPosfechado(item.posfechado);

                        //--------agregando abono ---
                        modalCobroSvc.aplicarAbono();
                    }  

                    calculoTotales();
                })

            }
        } catch (error) {
            console.log(error)
        }
    }

    function showInfoCobro(item) { 

        Swal.fire({
            icon: 'info',
            html: `<div class="table-responsive">
            <table class="table table-hover table-borderless table-sm">
                <tbody>
                      <tr>
                        <td><b>Ciudad:</b></td>
                        <td>${item.ciudad || '...'}</td>
                    </tr>
                    <tr>
                        <td><b>Número:</b></td>
                        <td>${item.nro || '...'}</td>
                    </tr>
                    <tr>
                        <td><b>Referencia:</b></td>
                        <td>${item.referencia || '...'}</td>
                    </tr>
                    <tr>
                        <td><b>Lote:</b></td>
                        <td>${item.lote || '...'}</td>
                    </tr>
                    <tr>
                        <td><b>Aprobación:</b></td>
                        <td>${item.aprobacion || '...'}</td>
                    </tr>   
                    <tr>
                        <td><b>Posfechado:</b></td>
                        <td>${item.posfechad?'SI':'NO'}</td>
                    </tr> 
                    <tr>
                        <td><b>Banco:</b></td>
                        <td>${item.banco || "..."}</td>
                    </tr>                      
                </tbody>
            </table>
        </div>`
        })
    }

    function save() {

    }

    function closeModal() {
        $uibModalInstance.close();
    }


}
