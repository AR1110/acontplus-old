export { 
    ModalEmpresaCtrl
}
ModalEmpresaCtrl.$inject = [
    '$scope', 
    '$uibModalInstance', 
    '$injector', 
    '$q' ,
    'params'
];

function ModalEmpresaCtrl($scope, $uibModalInstance, $injector, $q, params){        

    let empresaSvc = $injector.get('empresaService');
    let fS = $injector.get('formulario');
    let SRI_IDENTIFITION_CODE = $injector.get('SRI_IDENTIFITION_CODE');
    let clienteSvc = $injector.get('clienteService');
    let tS = $injector.get("toastService");
    

    $scope.modalTitle = 'Nueva Empresa';
    $scope.btnText = 'Guardar';

    $scope.data = {
        sriValidation: false
    };

    $scope.tiposIdentificacion = [];
    $scope.correos = [];
    $scope.telefonos = []; 

    $scope.onKeyupEmail = function (item) {
        let textChip = item.target.value || "";
        textChip = fS.removeAccents(textChip);
        item.target.value = textChip.toLowerCase();
    }

    $scope.transformChipEmail = function (item) {
        let textChip = item || "";
        textChip = fS.removeAccents(textChip);
        item = textChip.toLowerCase();
    }

    function loadDataForm(){ 
        if(params.id>0){       
            return $q.all([
                empresaSvc.getDataForm(),
                empresaSvc.getId(params.id)
            ])
        }
        return empresaSvc.getDataForm();
    }
     

    initiload();
    function initiload(){ 
        loadDataForm().then(response=>{ 
            $scope.data = {};
            
            if(Array.isArray(response)){
                let [dataUno, dataDos] = response; 
                $scope.tiposIdentificacion = dataUno.tiposIdentificacion;
                $scope.data = dataDos;
                $scope.data.numeroIdentificacion = $scope.data.ruc; 
            }else{
                $scope.tiposIdentificacion = response.tiposIdentificacion;
            } 


            let dataTipoIdentificacion = $scope.tiposIdentificacion.find(ti => { 
                return ti.codigoSri === SRI_IDENTIFITION_CODE.RUC;
            });
          
            if (dataTipoIdentificacion) {
                $scope.data.idTipoIdentificacion = dataTipoIdentificacion.idTipoIdentificacion;
            }

        })
        
        
         
    }

    function isValidIdentificacion(){

        let dataTipoIdentificacion = $scope.tiposIdentificacion.find(ti => ti.idTipoIdentificacion === $scope.data.idTipoIdentificacion);
        let numeroIdentificacion = $scope.data.numeroIdentificacion.trim(); 
        let result = {
            rucValid: false,
            cedulaValid: false,
            isPassport: false
        }


        if (dataTipoIdentificacion && dataTipoIdentificacion.codigoSri === SRI_IDENTIFITION_CODE.RUC) {
            if (isNaN(numeroIdentificacion)) {
                tS.toastr({
                    type: 'warning',
                    message: 'El número de RUC debe ser un valor numérico'
                });
                return;
            }
            if (numeroIdentificacion.length !== 13) {
                tS.toastr({
                    type: 'warning',
                    message: 'El número de RUC debe tener 13 dígitos'
                });
                return;
            }
            if (numeroIdentificacion.slice(-3) !== "001") {
                tS.toastr({
                    type: 'warning',
                    message: 'Los últimos 3 dígitos del RUC deben ser "001"'
                });
                return;
            } 
            result.rucValid = true;
        } 
        if (dataTipoIdentificacion && dataTipoIdentificacion.codigoSri === SRI_IDENTIFITION_CODE.PASSPORT) {
            result.isPassport = true;
        }
        result.numeroIdentificacion = numeroIdentificacion;
        return result;
    }


    $scope.onEnterNumeroIdentificacion = function () {
        let dataValid = isValidIdentificacion();

        if (dataValid.rucValid){
            showLoader();
            clienteSvc.checkClientSRIByRUC(dataValid.numeroIdentificacion).then(response => {
                if (response.error) {
                    tS.toastr('info', response.error);
                    return
                }
                let {
                    razonSocial,
                    direccion,
                    telefono,
                    email
                } = response;

                $scope.data.sriValidation = true;


                $scope.data.razonSocial = razonSocial;
                $scope.data.nombreComercial = razonSocial;

                $scope.correos = email ? email.split(/[\|;]/) : [];
                $scope.telefonos = telefono ? telefono.split(/[\|;]/) : [];

                if (direccion) {
                    $scope.data.direccion = direccion
                }
            })
                .catch(error => {
                    console.log(error)
                })
                .finally(() => hideLoader())
        }
         

        if (dataValid.isPassport) {
            tS.toastr({
                type: 'warning',
                message: 'No se realizan consultas al SRI para pasaportes'
            });
            return;
        }


    };


    $scope.copiarRazonSocial = function() {
        if (fS.isValidField($scope.data.razonSocial)) {
            $scope.data.nombreComercial = $scope.data.razonSocial;
        }
    }

    $scope.save = function() {
        let dataTipoIdentificacion = $scope.tiposIdentificacion.find(ti => ti.idTipoIdentificacion === $scope.data.idTipoIdentificacion);

        if (!fS.isValidField($scope.data.idTipoIdentificacion>0)) {
            tS.toastr('warning', 'Seleccione el Tipo de Identificación');
            return
        } 
        let dataValid = isValidIdentificacion();

        if (!dataValid.rucValid)  return

        

        if (!fS.isValidField($scope.data.razonSocial)) {
            tS.toastr('warning', 'Ingrese campo Razon Social');
            return
        }

        if (!fS.isValidField($scope.data.nombreComercial)) {
            tS.toastr('warning', 'Ingrese campo Nombre Comercial');
            return
        }
        

       try {
        let params = {
            ...$scope.data,
            telefonos: $scope.telefonos,
            correos: $scope.correos,
            codigoSri: dataTipoIdentificacion.codigoSri,
            estado:true
        }
           showLoader();
           if ($scope.data.idEmpresa > 0) {
               empresaSvc.put($scope.data.idEmpresa, params).then($scope.successReponse)
                    .catch(error=>{
                        console.log(error)
                    })
                   .finally(err => {
                       hideLoader();
                       console.log(err);
                   })
           } else if (!($scope.data.idEmpresa > 0)) {
               empresaSvc.post(params).then($scope.successReponse)
                    .catch(error=>{
                        console.log(error)
                    })
                   .finally(err => {
                       hideLoader();
                       console.log(err);
                   })
           }  
       } catch (error) {
        hideLoader();
        console.log(error)
       }

    }

    $scope.successReponse = function (response) {
        hideLoader();
        if (response.code === '0') {
            tS.toastr('warning', response.message, response.titleSms);
        }
        if (response.code === '1') {
            tS.toastr('success', response.message, response.titleSms);
            $uibModalInstance.close(response)
        }
    }

    $scope.closeModal = function() {
        $uibModalInstance.close();
    }
}