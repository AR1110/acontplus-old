export {
    ModalClienteCtrl,
    ModalClienteListaCtrl
}

ModalClienteCtrl.$inject = ["$uibModalInstance", "$scope", "commonService", "clienteService", "toastService", "params"]

function ModalClienteCtrl($uibModalInstance, $scope, commonSvc, clienteSvc, tS, params) {
 

    $scope.tabContent = 0; //Por defecto tab general
    $scope.data = {};

    $scope.correos = [];
    $scope.telefonos = [];
    $scope.placas = [];

    $scope.isDisableInputIdentificacion = false;
    $scope.isDisableSelectIdentificacion = false;

    $scope.onKeyupEmail = clienteSvc.onKeyupEmail
    $scope.transformChipEmail = clienteSvc.transformChipEmail;

    if(params.idCliente>0){
        $scope.tipoRegistro = 2;
        $scope.titleModal = 'Editar Cliente';
        $scope.textBtnSaveModal = 'Actualizar';
        $scope.iconBtnSaveModal = 'ti-pencil';
    }else{
        $scope.tipoRegistro = 1;
        $scope.titleModal = 'Nuevo Cliente';
        $scope.textBtnSaveModal = 'Guardar';
        $scope.iconBtnSaveModal = 'ti-save';
    }


    $scope.initiload = async function () {
        try {
            await clienteSvc.getDataForm().then(response => {
                let {
                    tipoIdentificacion,
                    tipoContribuyentes,
                    tiempoCreditos,
                    ciudades,
                    tiposEntidad,
                    tiposCliente,
                    empresas,
                    cargos
                } = response;

                $scope.tiposIdentificacion = tipoIdentificacion;
                $scope.tipoContribuyentes = tipoContribuyentes;
                $scope.tiempoCreditos = tiempoCreditos;
                $scope.ciudades = ciudades;

                // $scope.tiposEntidad = tiposEntidad;
                $scope.tiposCliente = tiposCliente;
                $scope.empresas = empresas;
                $scope.cargos = cargos;
                console.log(empresas)
                if ($scope.tipoRegistro ===1) {
                    $scope.data.idTipoIdentificacion = $scope.tiposIdentificacion[0].idTipoIdentificacion;
                    $scope.data.codigoIdentificacion = $scope.tiposIdentificacion[0].codigo;

                    $scope.data.idTiempoCredito = $scope.tiempoCreditos.length > 0 ? $scope.tiempoCreditos[0].idTiempoCredito : 0
                }

                console.log($scope.tiposIdentificacion)
                console.log($scope.tipoContribuyentes)
                console.log($scope.ciudades)
            }).catch(error => {
                console.log(error);
            })


            if ($scope.tipoRegistro === 2) {
                clienteSvc.findById(params.idCliente).then(response => {

                    let {
                        correos,
                        telefonos,
                        placas,
                        empleado,
                        estado
                    } = response;

                    $scope.isDisableInputIdentificacion = false;

                    $scope.data = response;
                    $scope.tempIdTipoIdentificacion = $scope.data.idTipoIdentificacion;

                    $scope.correos = correos;
                    $scope.telefonos = telefonos;
                    $scope.placas = placas;

                    $scope.selectedEmpleado = empleado;

                    //Cuando el estado este Inactivo se presenta el estado para activar
                    $scope.showEstado = !estado;

                    $("#nombreComercial").focus();

                }).catch(error => {
                    console.log(error);
                })
            }

        } catch (error) {
            console.log(error);
        }
    }

    $scope.initiload();

    $uibModalInstance.rendered.then(result => {

        if ($scope.tipoRegistro === 1) {
            $("#numeroIdentificacion").focus();
        } else {
            $("#nombreComercial").focus();
        }
    })


    $scope.dataFindByIdTipoIdentificacion = function () {
        return $scope.tiposIdentificacion.find(item => item.idTipoIdentificacion === $scope.data.idTipoIdentificacion) || {}
    }

    $scope.onChangeTipoIdentificacion = function () {
        if($scope.tipoRegistro==2){
            Swal.fire({
            //    title: 'Are you sure?',
                text: "Esta seguro de cambiar el tipo de identificación!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Si!',
                cancelButtonText: 'No!'
              }).then((result) => {
                if (result.isConfirmed) {
                    $scope.setTipoIdentificacion();   
                    $scope.$apply();                                  
                }else{
                    $scope.data.idTipoIdentificacion = $scope.tempIdTipoIdentificacion;
                    $scope.$apply();
                }
            })
            return
        }
        $scope.setTipoIdentificacion();
       
    }

    $scope.setTipoIdentificacion = function(){
        $scope.data.codigoIdentificacion = $scope.dataFindByIdTipoIdentificacion().codigo;

        $scope.typeNotify = '';
        $scope.message = ''
        $scope.data.numeroIdentificacion = '';

        $scope.isDisableInputIdentificacion = false;
        $scope.data.validationSri = false;

        //Tipo Identificacion Consumir Final
        if ($scope.data.codigoIdentificacion === 'CF') {
            $scope.isDisableInputIdentificacion = true;
            $scope.data.numeroIdentificacion = '9'.repeat(13)
        }
    }

    $scope.validarNumeroIdentificacion = function () {

        try {
            let codigoIdentificacion = $scope.dataFindByIdTipoIdentificacion().codigo;

            let inputTextNumeroIdentificacion = $("#numeroIdentificacion");

            let query = {
                dataExists: '1',
                bySearch: $scope.data.numeroIdentificacion,
                codigoIdentificacion
            }

            $scope.data.validationSri = false;

            if (!$scope.data.numeroIdentificacion) return

            if (codigoIdentificacion === 'C') {
                inputTextNumeroIdentificacion.attr("maxlength", 10);

                if ($scope.data.numeroIdentificacion.toString().length < 10) {
                    $scope.typeNotify = 'is-invalid';
                    $scope.message = 'Número de Cédula debe tener 10 dígitos';
                    return
                }
            }

            if (codigoIdentificacion === 'R') {
                inputTextNumeroIdentificacion.attr('maxlength', 13);
                if ($scope.data.numeroIdentificacion.toString().length < 13) {
                    $scope.typeNotify = 'is-invalid';
                    $scope.message = 'Número de RUC debe tener 13 dígitos';
                    return
                }

                if ($scope.data.numeroIdentificacion.slice($scope.data.numeroIdentificacion.length - 3) !== '001') {
                    $scope.typeNotify = 'is-invalid';
                    $scope.message = 'Número de RUC tiene que contener (001) en últimos dígitos';
                    return
                }
            }

            $scope.typeNotify = '';
            $scope.message = '';

            clienteSvc.checkClientByIdentification(query, codigoIdentificacion, $scope.consultaIdentificacionSRI)
        } catch (error) {
            console.log(error);
        }

    }

    $scope.consultaIdentificacionSRI = function (codigoIdentificacion) {
        if (codigoIdentificacion === 'R') {
            showLoader();
            clienteSvc.checkClientSRIByRUC($scope.data.numeroIdentificacion).then(response => {
                hideLoader();
                if (response.numeroRuc) {

                    let {
                        razonSocial,
                        establecimientos
                    } = response;

                    $scope.data.nombreComercial = razonSocial.replaceAll('"', '');
                    $scope.data.nombreFiscal = razonSocial.replaceAll('"', '');
                    $scope.data.direccion = establecimientos.find(item => item.matriz === 'SI').direccionCompleta

                    $scope.data.validationSri = true;

                    $scope.typeNotify = 'is-valid';
                    $scope.message = 'Número de RUC correcta';

                } else {
                    $scope.typeNotify = 'is-invalid';
                    $scope.message = 'No se encontró los datos';
                }
            }).catch(error => {
                hideLoader();
                console.log(error);
                $scope.typeNotify = 'is-invalid';
                $scope.message = 'No se encontró los datos';
            })
        }

        if (codigoIdentificacion === 'C') {
            showLoader();
            clienteSvc.checkClientSRIByCedula($scope.data.numeroIdentificacion).then(response => {
                hideLoader();
                if (response.numeroRuc || response.nombreCompleto) {

                    let {
                        nombreCompleto
                    } = response;
                    $scope.data.nombreComercial = nombreCompleto.replaceAll('"', '');
                    $scope.data.nombreFiscal = nombreCompleto.replaceAll('"', '');
                    $scope.data.validationSri = true;

                    $scope.typeNotify = 'is-valid';
                    $scope.message = 'Número de Cédula correcta';
                } else {
                    $scope.typeNotify = 'is-invalid';
                    $scope.message = 'No se encontró los datos';
                }
            }).catch(error => {
                hideLoader();
                console.log(error);
                $scope.typeNotify = 'is-invalid';
                $scope.message = 'No se encontró los datos';
            })

        }
    }



    $scope.copiarNombreComercial = function () {       
        $scope.data.nombreComercial = $scope.data.nombreFiscal;        
    }

    $scope.resultModalEmpresa = async function (res) {
        if (typeof res === 'object') {
            const {empresas} = await clienteSvc.getDataForm();
            $scope.empresas = empresas;
        }
    }

    $scope.searchEmpleadoFilter = function(textSearch) {
        return commonSvc.querySearchEmpleado(textSearch)
    }

    $scope.onKeyupSearchEmpleado = function(searchText) {
        if (!searchText) {
            $scope.data.idEmpleado = null;
        }
    }

    $scope.selectedEmpleadoChange = function(item) {
        $scope.data.idEmpleado = item.idEmpleado;
    }

    $scope.resultModalCargo = async function(result) {
        if (typeof result === 'object') {
            const {cargos} = await clienteSvc.getDataForm();
            $scope.cargos = cargos;
        }
    }

    $scope.refreshTiempoCredito = async function() {
        const {tiempoCreditos} = await clienteSvc.getDataForm();
        $scope.tiempoCreditos = tiempoCreditos;
    }

    $scope.getBarcode = function (item) {
        // console.log(item)
        if (!item) {
            tS.toastr('warning', "Debe ingresar la razón social y el número de identificacion del cliente para generar el código de barras")
            return
        }
        if (item == '9999999999999') {
            tS.toastr('warning', "No se puede generar código de barra para el consumidor final")
            return
        }
        $scope.data.barcodeGenerated = true
        JsBarcode("#barcode", item, {
            format: "CODE128",
            lineColor: "#000",
            width: 1.5,
            height: 75,
            displayValue: false
        });
        // this.data.barcodeCard = $('#barcode').attr('src').replace(/^data:image\/[a-z]+;base64,/, "")
        $scope.data.barcodeCard = document.getElementById('barcode').value

        //console.log(strImage);
        //return barcodeData
    }
    $scope.exportTpvCard = function (item) {
        // html2canvas(document.querySelector("#cardBusiness")).then(canvas => {
        //     document.body.appendChild(canvas)
        // });
        let container = document.getElementById("cardBusiness");; /* full page */
        html2canvas(container, {
            allowTaint: true
        }).then(function (canvas) {

            let link = document.createElement("a")
            document.body.appendChild(link)
            link.download = item + "_tpv.jpg"

            link.href = canvas.toDataURL()
            link.target = '_blank';
            link.click()
            link.download()
            $scope.data.barcodeGenerated = false
            // let image = new Image();
            // image.src = canvas.toDataURL()

            // let w = window.open("", '_blank');
            // w.document.write(image.outerHTML);
            // w.document.close();
        });
    }




    $scope.save = function () {
        try {
            let params = {
                ...$scope.data,
                correos: $scope.correos,
                telefonos: $scope.telefonos,
                placas: $scope.placas
            }

            if (!clienteSvc.validateForm(params)) return

            console.log(params)
            showLoader();


            if ($scope.tipoRegistro === 1) {
                clienteSvc.save(params).then($scope.saveResponse).catch(error => {
                    hideLoader();
                    console.log(error)
                })
            }

            if ($scope.tipoRegistro === 2) {
                clienteSvc.update($scope.data.idCliente, params).then($scope.saveResponse).catch(error => {
                    hideLoader();
                    console.log(error)
                })
            }

        } catch (error) {
            hideLoader();
            console.log(error);
        }
    }

    $scope.saveResponse = async function (response) {
        if (response.code === "0") {
            hideLoader();
            tS.toastr('warning', response.message);
        }
        if (response.code === "1") {
            hideLoader();
            tS.toastr('success', response.message);

            let idCliente = $scope.tipoRegistro === 1 ? response.payload : $scope.data.idCliente;
            let dataCliente = await clienteSvc.findById(idCliente) || {};
            $uibModalInstance.close(dataCliente);
        }
    }


    $scope.closeModal = function () {
        $uibModalInstance.close();
    }

}


ModalClienteListaCtrl.$inject = ['$scope', 'clienteService', '$uibModalInstance', 'toastService']

function ModalClienteListaCtrl($scope, clienteSvc, $uibModalInstance, tS) {

       
    $scope.selected = [];
    $scope.dataSearch = {
        pageIndex: 1,
        pageSize: 100
    }
    

    

    $scope.copyTextSearch = function() {
        if (!$scope.dataSearch.bySearch) return

        let copyText = document.getElementById("searchCliente");

        copyText.select();
        copyText.setSelectionRange(0, 99999);

        navigator.clipboard.writeText($scope.dataSearch.bySearch);
        tS.toastr('info', 'Copiado: ' + $scope.dataSearch.bySearch)
    }

    $scope.resultModal = function(result) {
        if(typeof result==='object') {
            $scope.seleccionarCliente(result);
        }
    }


    $scope.onKeyupSearchCliente = function(e) {
        $scope.getSearchCustomer();
    }

    $scope.resetList = function() {
        $scope.dataSearch.bySearch = $scope.dataSearch.bySearch || null;
        $scope.getSearchCustomer();
    }


    $scope.getSearchCustomer = function() {
        try {
            showLoader();
            $scope.dataSearch.bySearch = $scope.dataSearch.bySearch || null;
            $scope.clientes = [];
            
            clienteSvc.getAll($scope.dataSearch).then(response => {                
                    $scope.clientes = response;
                    $scope.totalRecords = $scope.clientes.length > 0 ? $scope.clientes[0].totalRecords : 0
                    hideLoader();                   
                }
            ).catch(error => {
                console.error(error)
                hideLoader()
            })

        } catch (error) {
            hideLoader();
            console.log(error)
        }
    }

    $scope.getSearchCustomer();


    $scope.seleccionarCliente = (item) => {
        if (!item.validationSri && ['R', 'C'].includes(item.tipoIdentificacion)) {
            Swal.fire({
                icon: 'warning',
                title: 'Datos Incorrectos',
                html: 'Número de identificación inválido, desea editar?',
                showConfirmButton: true,
                showCancelButton: true,                                
            })
            return
        }
        $uibModalInstance.close(item)
    }

    $scope.closeModal = function() {
        $uibModalInstance.close();
    }



}
