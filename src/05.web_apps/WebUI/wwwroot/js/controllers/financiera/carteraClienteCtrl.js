

    app.controller('carteraClienteCtrl', carteraClienteCtrl);
    
    carteraClienteCtrl.$inject=['mainService', '$scope', '$filter', 'mainService', 'commonService', 'modalService', 'nombreModal', 'toastService', 'formulario'];

    function carteraClienteCtrl(_mS, $scope, $filter, _mS, commonSvc, _modalSvc, _nombreModal, toast, form){
       
        $scope.copiaCarteraClientes = [];
        $scope.carteraClientes = [];         
        
        $scope.total = 0;
        $scope.abono = 0;
        $scope.saldo = 0;
        
        //Filters        
        $scope.dataSearch = {};
        $scope.dataSearch.checkBoxDeudores = false;
        $scope.dataSearch.tipoFecha = 'FE'
        $scope.meses = form.meses();
        $scope.mes = $scope.meses[new Date().getMonth() + 1].numero;

        $scope.load = ()=>{
            _mS.getData('get', '/EstabAsig/Get?json=' + JSON.stringify({})).then(response=>{                        
                $scope.establecimientos = JSON.parse(response.payload) || [];    
                
                if($scope.establecimientos.length>0){
                    $scope.dataSearch.codEstab = $scope.establecimientos[0].codEstab;
                }else{
                    toast.toastr('warning', 'NO TIENES ASIGNADO NINGÚN ESTABLECIMIENTO')
                }
            })
           
            commonSvc.getEstadoDocByCodDoc('CCL').then(response=>{                
                $scope.estadoDocumentos = response;
            })                               
        };
        $scope.load();

        $scope.openModalFiltro = function(){
            $("#modalFiltro").modal('show');            
        }

        $scope.onChangeDeudores = function(){
            $scope.carteraClientes = [];
            $scope.total = 0;
            $scope.abono = 0;
            $scope.saldo = 0;

            if($scope.dataSearch.checkBoxDeudores){                
                $scope.dataSearch.checkBoxCliente=false;                                
                $scope.dataSearch.checkBoxFecha = false;                
                $scope.dataSearch.checkBoxEstado = false;              
            }
        }     

        $scope.clienteSearch = (txtSearch)=>{
            return commonSvc.clienteSearch(txtSearch);
        }

       
        $scope.clienteFiltro = {};
        $scope.onKeyupClienteSearchFiltro = ()=>{
            if(form.campo($scope.clienteFiltro.nombreFiscal)){
                $scope.clienteFiltro  = {};
                $scope.dataSearch.byCliente = null;
            } 
        }
    
        $scope.selectedClienteSearchFiltro = (item) => {
            $scope.dataSearch.byCliente = item.idCliente;
        }

        $scope.onChangeFecha = ()=>{
            $scope.mes = new Date().getMonth() + 1;
            $scope.getFechaInicioFinFilter($scope.mes)                        
        }

        
        //Fecha Inicial y Final dependiendo el Mes que seleccione el usuario en el Filtro AVanzado
        $scope.getFechaInicioFinFilter = (mes)=> {
            let { fechaInicio, fechaFin } = form.getFechaInicioFinFilter(mes);
            $scope.dataSearch.fechaInicio = fechaInicio;
            $scope.dataSearch.fechaFin = fechaFin;            
        }

       

        $scope.filtrar = function(){
            if(!$scope.dataSearch.codEstab){
                toast.toastr('warning', 'Seleccione el Establecimiento','Filtrar');
                return
            };

            if(!$scope.dataSearch.checkBoxDeudores && !$scope.dataSearch.checkBoxCliente){
                toast.toastr('warning', 'Seleccione el Cliente','Filtrar');
                return                
            }

            if($scope.dataSearch.checkBoxCliente){
                if(form.campo($scope.dataSearch.byCliente) || $scope.dataSearch.byCliente===0){
                    toast.toastr('warning', 'Seleccione el Cliente','Filtrar');
                    return
                };
            }

            if($scope.dataSearch.checkBoxFecha){
                if(form.campo($scope.dataSearch.fechaInicio)){
                    toast.toastr('warning', 'Ingrese fecha de Inicio','Filtrar');
                    return
                }
                if(form.campo($scope.dataSearch.fechaFin)){
                    toast.toastr('warning', 'Ingrese fecha Fin','Filtrar');
                    return
                }
            }            

            if($scope.dataSearch.checkBoxEstado){
                if(form.campo($scope.dataSearch.byEstado) || $scope.dataSearch.byEstado ===0){
                    toast.toastr('warning', 'Seleccione el Estado','Filtrar');
                    return
                }
            }
            
            showLoader();
            _mS.getData('get','/CarteraCliente/Get?json=' + JSON.stringify($scope.dataSearch)).then(response=>{
                if(response.id==="0"){
                    hideLoader();
                    form.sweetAlert('warning', response.message);
                    return
                }
               
                $scope.carteraClientes = JSON.parse(response.data) || [];
                $scope.copiaCarteraClientes = JSON.parse(JSON.stringify($scope.carteraClientes));
                $scope.setTotalColumn();                                  
                $("#modalFiltro").modal('hide');                                                     
                hideLoader();                
            }).catch(error=>{
                hideLoader();
                const msg = error.config?error.config.url:error
                console.error(msg)
            })
        }     

        $scope.filterLocal = function(){
            $scope.carteraClientes = $filter("filter")($scope.copiaCarteraClientes, $scope.txtSearch);
            $scope.setTotalColumn();            
        }

        $scope.setTotalColumn = function(){            
            let total = 0, abono = 0, saldo = 0;
            for(let cartera of $scope.carteraClientes){
                total +=cartera.total;
                abono+=cartera.abono;
                saldo+=cartera.saldo;
            }
            $scope.total = form.roundNumber(total, 5);
            $scope.abono = form.roundNumber(abono, 5);
            $scope.saldo = form.roundNumber(saldo, 5);            
        }




        $scope.verDocumento = async(item)=>{                          
            commonSvc.viewDetailDocument({
                id: item.idDocumento,
                codigoDocumento: item.codigo,
                size: 'xl',
                windowClass: 'uibModalFullScreen'
            })                    
        }


        $scope.getDownload = async()=>{
            if($scope.carteraClientes.length===0){
                toast.toastr('warning', 'No hay documentos', 'Reporte');
                return
            }

            const { value: formatType } = await Swal.fire({
                icon:'warning',
                title: 'Tipo Formato',
                input: 'radio',
                inputOptions: {
                    pdf:'PDF',
                    excel:'EXCEL'
                },
                inputValidator: (value) => {
                    if (!value) {
                        return 'Seleccione el Tipo de Formato!'
                    }
                },
                confirmButtonText:'Descargar',
                showDenyButton:true,
                denyButtonText:'No, cancelar',
                allowOutsideClick:false,
                showLoaderOnDeny:true,    
                allowEscapeKey:false   
            })

            if(!formatType) return
            

         

            const parameters = {
                reportParams: JSON.stringify({
                    codigo: "RCCL", 
                    format: formatType,
                    aditionalParams: []
                }),
                dataParams: JSON.stringify($scope.dataSearch)
            }

            commonSvc.getReport({            
                parameters,
                formatType
            })                  
        }


       

        $scope.getCuotaDocumento = function(dataTipoDocumento, dataCliente){
            $scope.dataTipoDocumento = dataTipoDocumento;
            $scope.cliente =  dataCliente;
            showLoader();
            _mS.getData('get', `/CuotaXCobrar/GetByDocument?idComprobante=${dataTipoDocumento.idComprobante}&idTipoDoc=${dataTipoDocumento.idTipoDocumento}`).then(response => {                
                if (response.id == "0") {
                    hideLoader();
                    Swal.fire({
                        title:`<small>${response.titleSms}</small>`,
                        icon:'warning',
                        html:`<small>${response.message}</small>`
                    })                    
                }
                if (response.id === "1") {                    
                    $scope.cuotas = response.data;                                     
                    $("#modalCuotaCarteraCliente").modal('show');                                  
                    hideLoader();
                }
                hideLoader();
            })
        };

        $("#modalCuotaCarteraCliente").on('hide.bs.modal', e=>{
            $scope.cliente = {};
            $scope.dataTipoDocumento={};
            $scope.cuotas = [];
        })
}