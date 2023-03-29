(function(){
    'use strict';

    angular.module('acontPlusApp')
        .controller('chequeCtrl', chequeCtrl);

        chequeCtrl.$inject=['$scope','$http', '$filter', 'mainService', 'commonService', 'toastService', 'formulario'];

    function chequeCtrl($scope, $http, $filter, _mS, commonSvc, toast, form){     
        let accion = JSON.parse(localStorage.getItem("accion"));
        if(accion===null){
            location.href = "/Home/Index";
        }else{
            $scope.accion = accion[0];
        }

        $scope.cheques = [];

        $scope.clases=[         
            { id:1, nombre: 'Cobros'},
            { id:2, nombre:'Pagos' }
        ];       

        //Filters        
        $scope.meses = form.meses();
        $scope.mes = $scope.meses[new Date().getMonth() + 1].numero;
        $scope.proveedorFilter = {};
        $scope.dataSearch = {};

        //Pagination 
        $scope.pageIndex = 0;
        $scope.pageSize = 10;       

        $scope.getCheques = function(){            
            try {
                showLoader();
                $scope.cheques = []
                _mS.getData('get', '/Cheque/Get?json='+ JSON.stringify($scope.dataSearch)).then(response => {
                    console.log(response)
                    if (response.id == "0") {
                        hideLoader();
                        $scope.cheques = []; 
                        console.log(response)
                        return
                    }                           
                    $scope.cheques = response.data ===''? []: JSON.parse(response.data) || [];
                   console.log($scope.cheques)
                    $scope.cloneCheques = JSON.parse(JSON.stringify($scope.cheques))                                                    
                    $scope.getSumColumnaValor(); 
                    hideLoader();            
                })
            } catch (error) {
                console.log(error)
            }
        }

        $scope.initiload = ()=>{
            commonSvc.getEstabAsign().then(response=>{
                $scope.establecimientos = response;
                let codEstab = $scope.establecimientos.length>0?$scope.establecimientos[0].codEstab: 0;            
                $scope.dataSearch.codEstab = codEstab;
                $scope.getCheques();

            })           
        }
        $scope.initiload();


        $scope.getSumColumnaValor = function(){

            const total = $scope.cheques.map(item=>item.valor).reduce((previousValue, currentValue)=>previousValue + currentValue, 0)
            
            $scope.total = form.roundNumber(total, 5)
        }
        

        $scope.filterCheques = function(){
            const cloneCheques = JSON.parse(JSON.stringify($scope.cloneCheques))          
            $scope.cheques = $filter("filter")(cloneCheques, $scope.txtFilter);
            $scope.getSumColumnaValor();
        }
        
        $scope.openModalFiltro = function(){
            // $scope.getFechaInicioFinFilter(new Date().getMonth()+1);
            $("#modalFiltroCobroPosf").modal('show');            
        };

       
        $scope.onChangeGestion = function(){
            $scope.dataSearch.byPersona=null;
            $scope.selectedClientePersonalizado='';
            $scope.selectedProvPersonalizado='';            
        }

        //Search Proveedor 
        $scope.proveedorFiltro = {};
        $scope.proveedorSearch=textSearch=>commonSvc.proveedorSearch(textSearch).then(response=>response)            
        
        $scope.onKeyupProvedorAutocompleteFiltro = ()=>{
            if(form.campo($scope.proveedorFiltro.nombreFiscal)){
                $scope.dataSearch.byPersona = null;
            }
        }

        $scope.selectProveedorFiltro = (item)=>{    
               
            $scope.dataSearch.byPersona=item.proveedor.numeroIdentificacion           
        }

        //Search Cliente 
        $scope.clienteFiltro = {};
        $scope.clienteSearch= textSearch=> commonSvc.clienteSearch(textSearch).then(response=>response)                   

        $scope.onKeyupClienteSearchFiltro = ()=>{
            if(form.campo($scope.proveedorFiltro.nombreFiscal)) $scope.dataSearch.byPersona = null;            
        }

        $scope.selectedClienteSearchFiltro= (item)=>{   
            
            $scope.dataSearch.byPersona=item.numeroIdentificacion;
        }

        $scope.onChangeFechaFiltro = ()=>{
            $scope.mes = new Date().getMonth() + 1;
            $scope.getFechaInicioFinFilter($scope.mes)
        }

        
        //Fecha Inicial y Final dependiendo el Mes que seleccione el usuario en el Filtro 
        $scope.getFechaInicioFinFilter = function (mes) {
            let { fechaInicio, fechaFin } = form.getFechaInicioFinFilter(mes);
            $scope.dataSearch.fechaInicio = fechaInicio;
            $scope.dataSearch.fechaFin = fechaFin;
        };

        
        $scope.buscar=function(){
            let titulo= 'Buscar';                       
           
            if($scope.dataSearch.checkBoxFecha){
                if($scope.mes==null || $scope.mes === undefined){
                    toast.toastr('warning', 'Seleccione el Mes', titulo);
                    return
                }
                if(form.campo($scope.dataSearch.fechaInicio)){
                    toast.toastr('warning', 'Ingrese la Fecha de Inicio', titulo);
                    return
                }
                if(form.campo($scope.dataSearch.fechaFin)){
                    toast.toastr('warning', 'Ingrese la Fecha de Inicio', titulo);
                    return
                }
            }

            if($scope.dataSearch.checkBoxGestion){
                if(form.campo($scope.dataSearch.byGestion)){
                    toast.toastr('warning', 'Seleccione el Tipo de Gestión (Cobros/Pagos)')
                    return
                }
                if(form.campo($scope.dataSearch.byPersona)){
                    toast.toastr('warning', 'Seleccione el Tipo Persona (Clientes/Proveedores)')
                    return
                }
            }

            if($scope.dataSearch.checkBoxPosfechado){
                if(form.campo($scope.dataSearch.byPosfechado)){
                    toast.toastr('warning', 'Seleccione el Posfechado');
                    return
                }
            }
                        
            $scope.getCheques();
            $("#modalFiltroCobroPosf").modal('hide');                 
        };


        //Guardar Cheques Cobro/Pago
        $scope.askToSaveCheck= async(item)=>{
            let tipoCheque = item.codDoc==='CI'?'Cobro Cheque':'Pago Cheque';

            if(item.estado.toUpperCase() === "COBRADO" || item.estado.toUpperCase()==="ANULADO"){
                Swal.fire({
                    icon: 'warning',
                    //title: 'Insumos',
                    html: '<small>Este documento ya se encuentra <strong>COBRADO/ANULADO</strong>!</small>',                   
                    allowOutsideClick: false
                });
                return
            }

          
            Swal.fire({                
                icon:'warning',    
                title:`<small>Guardar ${tipoCheque}</small>`,        
                html:`<small>Está seguro/a de guardar este <b>${tipoCheque}</b> del Cliente <strong>${item.persona}</strong> ahora?</small>`,
                input:'text',
                inputPlaceholder: 'Ingrese la observación',
                showLoaderOnConfirm: true,
                preConfirm: function(text){
                    if(form.campo(text)){
                        Swal.showValidationMessage('Ingrese la Observación');
                        return
                    }
                    if(text.length<5){
                        Swal.showValidationMessage('tiene que tener al menos 15 caracteres!');
                        return
                    }
                    return text;
                },
                allowOutsideClick: () => !Swal.isLoading(),
                showConfirmButton: 'true',
                confirmButtonText: 'Si, guardar',
                showCancelButton: 'true',
                cancelButtonText: 'No, cancelar',
                allowOutsideClick:false
            }).then(result=>{
                if(result.isConfirmed){   
                    let url ;         
                    if(item.codDoc==='CI'){
                        url = `/Cobro/Put?idCobro=${item.id}&observacion=${result.value}&cobro=true`;
                    }else{
                        url = `/Pago/Put?idPago=${item.id}&observacion=${result.value}&pago=true`;
                    }
                    $scope.postCheck(url);
                }                   

            })
            
        }

        $scope.postCheck = (url)=>{                                   
            _mS.getData('post', url).then(response=>{
                console.log(response)
                if(response.id==="0"){
                    form.sweetAlert('warning', response.message, response.titleSms);                    
                    return
                }

                if(response.id==="1"){
                    form.sweetAlert('success', response.message, response.titleSms, 1000);                    
                    $scope.getCheques();                    
                }
            })
        };

        $scope.askToAnnulCheck = async(item)=>{
            let tipoCheque = item.codDoc==='CI'?'Cobro Cheque':'Pago Cheque';
            if(item.estado.toUpperCase()==="ANULADO"){
                Swal.fire({
                    icon: 'warning',
                    //title: 'Insumos',
                    html: '<small>Este documento ya se encuentra <strong>ANULADO</strong>!</small>',                   
                    allowOutsideClick: false
                });
                return
            }

            let {isConfirmed, value} = await Swal.fire({
                icon:'warning',
                title:`<small>Anular ${tipoCheque}</small>`,
                html:`<small>Está seguro/a de anular este <b>${tipoCheque}</b> del Cliente <strong>${item.persona}</strong> ahora?</small>`,
                input:'text',
                inputPlaceholder: 'Ingrese la observación',
                showLoaderOnConfirm: true,
                preConfirm: function(text){
                    if(form.campo(text)){
                        Swal.showValidationMessage('Ingrese la Observación');
                        return
                    }
                    if(text.length<8){
                        Swal.showValidationMessage('tiene que tener al menos 15 caracteres!');
                        return
                    }
                    return text;
                },
                allowOutsideClick: () => !Swal.isLoading(),
                showConfirmButton: 'true',
                confirmButtonText: 'Si, guardar',
                showCancelButton: 'true',
                cancelButtonText: 'No, cancelar',
                allowOutsideClick:false
            })
            
            if(isConfirmed){
                let url;                    
                if(item.gestion===1){
                    url = `/Cobro/Put?idCobro=${item.id}&observacion=${value}&anular=true`
                }else{
                    url = `/Pago/Put?idPago=${item.id}&observacion=${value}&anular=true`;
                }
                $scope.postCheck(url);
            }                      
        }

        $scope.getReport = async(item)=>{                       
            const formatType = 'pdf'
            
            const parameters = {
                reportParams: JSON.stringify({
                    codigo: "RCHE", 
                    format: formatType,
                    aditionalParams: []
                }),
                dataParams: JSON.stringify({
                    id:item.id,
                    idTipoDocumento: item.idTipoDocumento,
                    codEstab: item.codEstab                    
                })
            }

            commonSvc.getReport({
                url: '/Reporte/Download',
                parameters,
                formatType
            })    
        }

        
       









    }



})(window.angular)