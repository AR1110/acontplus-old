
export {
    ModalCuotaCtrl,
    ModalConfigMoraCtrl
}

ModalCuotaCtrl.$inject = [
    '$scope', 
    '$uibModalInstance', 
    'mainService',
    'modalService', 
    'nombreModalContabilidad', 
    'toastService', 
    'formulario', 
    'params'
];

function ModalCuotaCtrl($scope, $uibModalInstance, mS, modalSvc, nombreModalContabilidad,  tS, fS, params){
    let {idCuentaPorCobrar} = params;

    $scope.tiempoCreditos = [];
    $scope.cuotas = [];
    $scope.showColumnPorcentajeInteres = false;
    $scope.showColumnPrecioFijo = false;
    $scope.codEstado = null;
    $scope.cloneIdTiempoCredito = 0;
    $scope.totalCuota = 0;
    $scope.totalDiferencia = 0;

    $scope.isReload = false;

    let url = 'CuentaPorCobrar/'

    $scope.initiload = initiload;
    $scope.initiload();

    function initiload(){
        try {
            showLoader();
            let query ={
                tipo: 2,
                idCuentaPorCobrar
            }

            mS.getData('get', url + '?json=' + JSON.stringify(query)  , null, true).then(response=>{
                hideLoader();
                if(response.code==='0'){
                    throw response
                }
                if(response.code==="1"){
                    let mainDataRepository = JSON.parse(response.payload);
                    $scope.comprobante = mainDataRepository[0][0];
                    $scope.comprobante.fechaEmision = formatDateFecha($scope.comprobante.fechaEmision);
                    $scope.comprobante.fechaEmisionFormat =  moment( $scope.comprobante.fechaEmision).format('DD-MM-YYYY');
                    $scope.comprobante.configFecha =  $scope.comprobante.fechaEmision;
                    $scope.cloneIdTiempoCredito = $scope.comprobante.idTiempoCredito;
                    $scope.showColumnPorcentajeInteres = $scope.comprobante.tipoConfig ==='PI';
                    $scope.showColumnPrecioFijo = $scope.comprobante.tipoConfig ==='PF';

                    $scope.totalCuota = $scope.comprobante.importeTotal;

                    $scope.tiempoCreditos = mainDataRepository[1];
                    
                    let tempCuotas = mainDataRepository[2];
                    $scope.cuotas = tempCuotas.map(cuotaMappFrom)
                    console.log($scope.comprobante)

                    let tempCuotasMora = mainDataRepository[3];
                    $scope.cuotasMora = tempCuotasMora;
                }
            }).catch(error=>{
                hideLoader();
                console.log(error)
            })
        } catch (error) {
            hideLoader();
            console.log(error)
        }
    } 

    function cuotaMappFrom(item){
        return ({
            ...item,
            fechaVencimiento: new Date(item.fechaVencimiento)
        })
    }

    function formatDateFecha(fecha){
       
        const fechaCadena = fecha;
        const formatoEntrada = "DD/MM/YYYY HH:mm";
        const fechaReal = moment(fechaCadena, formatoEntrada).toDate();

        return fechaReal;
    }

    $scope.getFechaEscritaCuota = function(item) {        
        if (item.fechaVencimiento) {
            return item.fechaVencimiento.toLocaleDateString("es-ES", { year: 'numeric', month: 'long', day: 'numeric' });
        }            
    }

    function getTotalCuota() {
        let total = $scope.cuotas.map(val => Number(val.cuota)).reduce((prev, curr) => prev + curr, 0);
        return fS.roundNumber(total, 3);
    }

    $scope.askToChangeCreditTime = async function() {
        try {
            if(!($scope.comprobante.idTiempoCredito>0)){
                tS.toastr('warning', 'Seleccione el tiempo credito');
                return
            }

            let dataCredito = $scope.tiempoCreditos.find(item=>item.idTiempoCredito===$scope.comprobante.idTiempoCredito);
           
            let {isConfirmed} = await Swal.fire({
                html: `<small>Está seguro/a de generar <h3><b> ${dataCredito.numeroCuota}</b></h3> cuotas de este Comprobante</small>`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Si!',
                cancelButtonText: 'No!'
            })

            if(isConfirmed){
                $scope.crearCuota();
                $scope.cloneIdTiempoCredito = $scope.comprobante.idTiempoCredito;
                $scope.$apply()
            }else{
                $scope.comprobante.idTiempoCredito = $scope.cloneIdTiempoCredito;
                $scope.$apply()
            }

        } catch (error) {
            console.log(error)
        }        
    }

    $scope.crearCuota = function() {
        let query = {
            idCuentaPorCobrar,
            idTiempoCredito: $scope.comprobante.idTiempoCredito,
            fechaEmision: fS.formatDateTimeZone($scope.comprobante.fechaEmision, "YYYY-MM-DD HH:mm:ss A"),
            codEstado: $scope.comprobante.codEstado,
            importeTotal: $scope.comprobante.importeTotal
        };

        showLoader();
        mS.getData('post', 'CuentaPorCobrar/Insert/Cuota', {data: query},  true).then(response => {
            hideLoader();
            console.log(response)
            if (response.code === "0") {
                fS.sweetAlert('warning', response.message);                                                       
            }
            if (response.code == "1") { 
                $scope.isReload = true;               
                fS.sweetAlert('success', response.message, response.titleSms, 1000);  
                let tempCuotas = JSON.parse(response.payload) || [];                
                $scope.cuotas = tempCuotas.map(item=>({
                    ...item,
                    fechaVencimiento: new Date(item.fechaVencimiento)
                }))                                                               
            }
        }).catch(error=>{
            hideLoader();
            console.log(error)
        })
    }

    $scope.askToApplyMora = async function(){
        try {
            
            let {isConfirmed} = await Swal.fire({
                html: `<small></small>`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Si!',
                cancelButtonText: 'No!'
            })

            if(isConfirmed){
                let query = {
                    idCuentaPorCobrar,                   
                    porcentaje: $scope.comprobante.porcentaje,
                    tipoConfig: $scope.comprobante.tipoConfig,
                    tipo: 4
                }
                showLoader();
                mS.getData('get', url + '?json=' + JSON.stringify(query)  , null, true).then(response=>{
                    hideLoader();
                    console.log(response)
                    if(response.code==='0'){
                        fS.sweetAlert('warning', response.message)
                    }
                    if(response.code==='1'){
                        let tempCuotas = JSON.parse(response.payload)[0]
                        console.log(tempCuotas)
                        $scope.cuotas = tempCuotas.map(cuotaMappFrom)

                    }
                })
            }
        } catch (error) {
            console.log(error)
        }
    }
    /**
     * 
     * @param {*} valid 
     * @returns 
     */
    // $scope.configFechaMora  = async function(){
    //     try {
    //         let {isConfirmed}= await  Swal.fire({
    //             icon:'warning',
    //             title: '',
    //             html: `  <span class="text-info"> Desea Calcular la Mora con la fecha Actual</span>
    //             <div class="row justify-content-center">
    //                 <div class="col-6"><input type="date" class="form-control" id="dateConfigMora">
    //                 </div>
    //             </div>`,
    //             showCancelButton: true,
    //             confirmButtonText: 'Si',
    //             cancelButtonText: 'No',
    //             didOpen: () => {
    //                 let dateConfigMora = document.getElementById('dateConfigMora');
    //                 let fechaConfig = new Date(); 
    //                 dateConfigMora.value =  fechaConfig.toISOString().split('T')[0];                                   
    //             },                
    //             preConfirm: () => {
    //                 let fechaConfig = Swal.getPopup().querySelector('#dateConfigMora').value
    //                 if (!fechaConfig) {
    //                     tS.toastr('warning', '....')
    //                     return false
    //                 }
    //             },            
    //         }) 
    //         if(isConfirmed){
    //             let query = {
    //                 idTipoDocumento,
    //                 idDocumento,
    //                 porcentaje: $scope.comprobante.porcentaje,
    //                 tipoConfig: $scope.comprobante.tipoConfig,
    //                 fecha: fS.formatDateMoment(Swal.getPopup().querySelector('#dateConfigMora').value)                    ,
    //                 tipo: 4
    //             }
    //             showLoader();
    //             mS.getData('get', url + '?json=' + JSON.stringify(query)  , null, true).then(response=>{
    //                 hideLoader();
    //                 console.log(response)
    //                 if(response.code==='0'){
    //                     fS.sweetAlert('warning', response.message)
    //                 }
    //                 if(response.code==='1'){
    //                     let tempCuotas = JSON.parse(response.payload)[0]
    //                     console.log(tempCuotas)
    //                     $scope.cuotas = tempCuotas.map(cuotaMappFrom)

    //                 }
    //             })
    //         }
    //             // for(let item of $scope.cuotas){
    //             //     let dataCuotaMora = $scope.cuotasMora.find(cuotaM=>cuotaM.idCuotaXCobrar===item.idCuotaXCobrar);
    //             //     if(dataCuotaMora){
    //             //         item.interes = dataCuotaMora.interes;
    //             //         item.mora = dataCuotaMora.mora;
    //             //         item.diasMora = dataCuotaMora.diasMora;
    //             //         item.saldo = dataCuotaMora.saldo;
    //             //     }
    //             // }
    //             // tS.toastr('success', 'Aplicada Mora Correctamente')
    //             // $scope.$apply();
    //         // }

            

    //         // if($scope.cuotasMora.length===0){
    //         //     fS.sweetAlert('warning', '.....')
    //         //     return
    //         // }
    //         // let fileCtrl = nombreModalContabilidad.COBRO.fileCtrl;
    //         // let  ctrl = nombreModalContabilidad.COBRO.controllers.MM;
    //         // let template = nombreModalContabilidad.COBRO.templates.MM;
    //         // let controller =(await import(fileCtrl)[ctrl])
    //         // let modalRef = modalSvc.openModalCustom({
    //         //     controller,
    //         //     template,
    //         //     size: 'lg',
    //         //     isRenderRazorPartial: true,
    //         //     params: {
    //         //         comprobante: Object.assign({}, $scope.comprobante),
    //         //         cuotasMora: JSON.parse(JSON.stringify($scope.cuotasMora))

    //         //     }
    //         // })
    //         // modalRef.result.then(result=>{
    //         //     if(typeof result==='object'){
    //         //         initiload();
    //         //     }
    //         // })
    //     } catch (error) {
    //         hideLoader();
    //         console.log(error)
    //     }
    // }


     //valid = 1 fin mes 
    //valid = 0 mismo fecha 
    $scope.getConfigFechaCuota = function(valid) {                                                 
        
        try {

            if (!$scope.comprobante.configFecha) {
                fS.sweetAlert('warning', 'Ingrese la Config. Fecha');              
                return
            }

            if (!fS.isValidDate($scope.comprobante.configFecha)) {
                fS.sweetAlert('warning', 'Config. Fecha inválida')                                         
                return
            }
    
            if ($scope.comprobante.configFecha.getFullYear().toString().length !== 4) {
                fS.sweetAlert('warning', 'El Formato del Año es incorrecto');                             
                return
            }
    
            if (!valid && $scope.comprobante.configFecha.getDate() >= 28) {
                fS.sweetAlert('warning','Para la opción <code>Mismo Día</code>, el día tiene que ser menor a 28 días!');               
                return
            }

            if(valid){
                getEndOfMonthDates($scope.comprobante.configFecha)
            }else{
                getSameDayOfMonth($scope.comprobante.configFecha)
            }
            
            
        } catch (error) {
            console.log(error)
        }
    }

    function getEndOfMonthDates(startDate){
        let currentDate = new Date(startDate)

        for(let item of $scope.cuotas){

            // Obtener el último día del mes actual
            const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
            
            // Establecer la fecha actual en el último día del mes actual
            currentDate.setDate(lastDayOfMonth);
            
            // Agregar la fecha vecimiento 
            item.fechaVencimiento = new Date(currentDate)
        
            // Establecer la fecha actual en el primer día del mes siguiente
            currentDate.setDate(1);
            currentDate.setMonth(currentDate.getMonth() + 1);
        }
    }


    function getSameDayOfMonth(date){
        const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
        const dayOfMonth = date.getDate() <= daysInMonth ? date.getDate() : daysInMonth;
        let index = 0;
        for (let item of $scope.cuotas) {
            const newDate = new Date(date);
            newDate.setMonth(date.getMonth() + index++);
            newDate.setDate(dayOfMonth);
            item.fechaVencimiento = newDate;               
        }
        
    }

    $scope.setValorEntrada = function(valorEntrada) {
        try {
            let subTotalCuota = 0, cuota = 0;
            let dataCredito = $scope.tiempoCreditos.find(item=>item.idTiempoCredito===$scope.comprobante.idTiempoCredito)

            $scope.totalDiferencia = 0;
            
            if (![null, undefined, "", "0"].includes(valorEntrada)) {
                if (Number(valorEntrada) >= $scope.comprobante.importeTotal) {
                    valorEntrada =$scope.comprobante.importeTotal;
                }
            } else {
                setTimeout(() => {
                    $("#valorEntrada").select();
                }, 50)
                valorEntrada = 0;
            }


            subTotalCuota = $scope.comprobante.importeTotal - Number(valorEntrada);
            subTotalCuota = fS.roundNumber(subTotalCuota, 3);
            cuota         = subTotalCuota / dataCredito.numeroCuota;
            cuota         = fS.roundNumber(cuota, 3);

            for (let val of $scope.cuotas) {
                if (val.nroCuota === "E") {
                    val.cuota = subTotalCuota == 0 ? $scope.comprobante.importeTotal : valorEntrada;
                }
                if (val.nroCuota !== "E") {
                    val.cuota = cuota;
                }
            }

            $scope.totalCuota = getTotalCuota();

        } catch (error) {
            console.log(error)
        }
    }


    
    $scope.setValorCuota = function(cuota) {
        try {
            $scope.totalDiferencia = 0;

            if ([null, undefined, "", "0", "-"].includes(cuota.cuota)) {
                cuota.cuota = 0;
                setTimeout(() => {
                    $("#setValcuota" + cuota.idCuotaXCobrar).select();
                }, 50);
            }

            let getCuotasIndexMenor = $scope.cuotas.filter((val, index, arrayCuota) => index <= arrayCuota.indexOf(cuota));
            let getCuotasIndexMayor = $scope.cuotas.filter((val, index, arrayCuota) => index > arrayCuota.indexOf(cuota));
            let rowTotalCuota = getCuotasIndexMenor.map(val => Number(val.cuota)).reduce((prev, curr) => prev + curr, 0);

            if (rowTotalCuota > $scope.comprobante.importeTotal) {
                tS.toastr('warning', 'El valor de la Cuota tiene que ser menor al Total del Comprobante');                
            }

            if (getCuotasIndexMayor.length > 0) {
                let result = $scope.comprobante.importeTotal - rowTotalCuota; //Total Cuota - total Factura  
                let numeroCuota = getCuotasIndexMayor.length;
                let valorCuota = result / numeroCuota;

                angular.forEach($scope.cuotas, (val, index, arrayCuotas) => {
                    //Si la Cuota tiene entrada 
                    if (val.nroCuota !== "E" && index > arrayCuotas.indexOf(cuota)) {
                        val.cuota = fS.roundNumber(valorCuota, 3);
                    } else if (index > arrayCuotas.indexOf(cuota)) {
                        val.cuota = fS.roundNumber(valorCuota, 3);
                    }
                });

            }

            $scope.totalCuota = getTotalCuota();
            let result = $scope.comprobante.importeTotal - $scope.totalCuota;
            $scope.totalDiferencia = fS.roundNumber(result, 3);

        } catch (error) {
            console.log(error)
        }

    }


    $scope.setFechaVencimientoCuota = function(cuota) {
        try {
            let inputFvcto = $("#fechaVencimiento" + cuota.idCuotaXCobrar);

            if (!cuota.fechaVencimiento || !fS.isValidDate(cuota.fechaVencimiento)) {
                inputFvcto.removeClass('is-valid');
                inputFvcto.addClass('is-invalid');
                return
            } else {
                inputFvcto.addClass('is-valid');
                inputFvcto.removeClass('is-invalid');
            }

            for (var i = 0; i < $scope.cuotas.length; i++) {
                if (i < $scope.cuotas.indexOf(cuota)) {
                    if (cuota.fechaVencimiento <= $scope.cuotas[i].fechaVencimiento) {
                        inputFvcto.removeClass('is-valid');
                        inputFvcto.addClass('is-invalid');
                        return;
                    } else {
                        inputFvcto.removeClass('is-invalid');
                        inputFvcto.addClass('is-valid');
                    }
                }
            }

        } catch (error) {
            console.log(error)
        }
    }

    
    const isValidValueCuota = (cuota)=> [null, undefined, "", 0, "0", ".", "-"].includes(cuota)

    $scope.onSave = async function() {            

        try {
            if ($scope.cuotas.some(val => val.nroCuota === "E" && isValidValueCuota(val.cuota))) {
                tS.toastr('warning', 'Ingrese el Valor de la Entrada');
                return
            }
    
            if ($scope.cuotas.some(val => isValidValueCuota(val.cuota) || val.cuota < 0)) {
                tS.toastr('warning', 'Verifique el valor de las Cuotas', 'Guardar Cuotas');
                return
            }

            if ($scope.cuotas.some(val => [null, undefined, ""].includes(val.fechaVencimiento) || $("#fechaVencimiento" + val.idCuotaXCobrar).hasClass('is-invalid'))) {
                tS.toastr('warning', 'Verifique las Fechas de Vcto.');
                return
            }
    
            if ($scope.totalDiferencia > 0 || $scope.totalDiferencia < 0) {
                tS.toastr('warning', 'El valor de la Diferencia tiene que ser 0');
                return
            }

            const swalWithBootstrapButtons = Swal.mixin({
                customClass: {
                  confirmButton: 'btn btn-success',
                  cancelButton: 'btn btn-danger ml-2'
                },
                buttonsStyling: false
            })
              
            let {isConfirmed} = await  swalWithBootstrapButtons.fire({                
                html: `<small>Está seguro/a de guardar las cuotas de este Comprobante N°: <b>${$scope.comprobante.serieComprobante}</b></small>`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Si, guardar!',
                cancelButtonText: 'No, cancelar!',
                reverseButtons: false
            })
            
            if(isConfirmed){
                showLoader();

                let cuotas =  $scope.cuotas.map(val => ({
                    idCuotaPorCobrar: val.idCuotaPorCobrar,
                    cuota: Number(val.cuota),
                    fechaVencimiento: fS.formatDateTimeZone(val.fechaVencimiento, "YYYY-MM-DD HH:mm:ss A"),
                    diasMora: val.diasMora,
                    mora: val.mora                    
                }))
                let query = {
                    idCuentaPorCobrar,
                    codEstado: $scope.comprobante.codEstado,
                    cuotas
                }

                mS.getData('put', 'CuentaPorCobrar/Update/Cuota', {data: query},  true).then(response => {
                    hideLoader();
                    if (response.code === "0") {
                        fS.sweetAlert('warning', response.message, response.titleSms);                                           
                    }
                    if (response.code === "1") {                        
                        fS.sweetAlert('success', response.message, response.titleSms, 1000);                                                               
                        $scope.isReload = true;
                        let tempCuotas = JSON.parse(response.payload) || [];                
                        $scope.cuotas = tempCuotas.map(item=>({
                            ...item,
                            fechaVencimiento: new Date(item.fechaVencimiento)
                        })) 
                    }
                }).catch(error=>{
                    hideLoader();
                    console.log(error)
                })
            }
            
        } catch (error) {
            hideLoader();            
            console.log(error)
        }
        
    }



    $scope.closeModal = function(){
        let isReload = $scope.isReload;
        $uibModalInstance.close({
            isReload
        });
    }
}


ModalConfigMoraCtrl.$inject = ['$scope', '$uibModalInstance','params'];

function ModalConfigMoraCtrl($scope, $uibModalInstance, params){
    let { comprobante, cuotasMora} = params;

    $scope.comprobante = comprobante;
    $scope.cuotasMora = cuotasMora;

    console.log($scope.cuotasMora)

    $scope.closeModal = function(){
        $uibModalInstance.close();
    }
}