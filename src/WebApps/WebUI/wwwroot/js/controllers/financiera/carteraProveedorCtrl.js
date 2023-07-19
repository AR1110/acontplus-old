app.controller('carteraProveedorCtrl', carteraProveedorCtrl);

carteraProveedorCtrl.$inject=['mainService', '$scope', '$filter', 'commonService', 'modalService', 'nombreModal', 'toastService','formulario'];

function carteraProveedorCtrl(_mS, $scope, $filter, commonSvc, _modalSvc, _nombreModal, toast, form){
    $scope.carteraProveedores = [];
    $scope.cloneCarteraProveedores = [];

    $scope.dataSearch = {};
    $scope.dataSearch.tipoFecha = 'FE'
    $scope.proveedorFiltro = {};

    $scope.total = 0;
    $scope.abono = 0;
    $scope.saldo = 0;


    //Filters        
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

        commonSvc.getEstadoDocByCodDoc('CPR').then(response=>{                
            $scope.estadoDocumentos = response;
        })                       
    };
    
    $scope.load();

    $scope.openModalFiltro = ()=>{
        $("#modalFiltroCarteraProveedor").modal('show');            
    }

    $("#modalFiltroCarteraProveedor").on('shown.bs.modal', e=>{
        $("input[name='provAutocompletePersonalizado']").focus();            
    })

    
    $scope.getDownload = async()=>{   
        if($scope.carteraProveedores.length===0){
            toast.toastr('warning','No hay documentos', 'Reporte');
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
                codigo: "RCPRV", 
                format: formatType,
                aditionalParams: []
            }),
            dataParams: JSON.stringify($scope.dataSearch)
        }

        commonSvc.getReport({            
            parameters,
            formatType
        });                      
    };      

    $scope.proveedorSearch = (txtSearch)=>{
        return commonSvc.proveedorSearch(txtSearch).then(response=>response)          
    };

    $scope.onKeyupProvedorAutocompleteFiltro = ()=>{
        if(form.campo($scope.proveedorFiltro.nombreFiscal)){
            $scope.proveedorFiltro = {};
            $scope.dataSearch.byProveedor = null;
        }
    }
    //Proveedor filter        
    $scope.selectProveedorFiltro = (item)=> {
        $scope.dataSearch.byProveedor = item.proveedor.idProveedor;            
    }

    $scope.onChangeFecha = ()=>{
        $scope.mes = new Date().getMonth() + 1;
        $scope.getFechaInicioFinFilter($scope.mes)                       
    }

    //Fecha Inicial y Final dependiendo el Mes que seleccione el usuario en el Filtro AVanzado
    $scope.getFechaInicioFinFilter = (mes)=> {
        let { fechaInicio, fechaFin } = form.getFechaInicioFinFilter(mes);
        $scope.dataSearch.fechaInicio = fechaInicio;
        $scope.dataSearch.fechaFin    = fechaFin;            
    }     

    $scope.filtrar = ()=>{
        try {
            if(!$scope.dataSearch.codEstab){
                toast.toastr('warning', 'Seleccione el Establecimiento','Filtrar');
                return
            };
    
            if(!$scope.dataSearch.checkBoxProveedor){
                toast.toastr('warning', 'Seleccione el Proveedor','Filtrar');
                return
            }
    
            if($scope.dataSearch.checkBoxProveedor){
                if(form.campo($scope.dataSearch.byProveedor) || $scope.dataSearch.byProveedor===0){
                    toast.toastr('warning', 'Seleccione el Proveedor','Filtrar');
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
            };
            
            showLoader();
            _mS.getData('get', '/CarteraProveedor/Get?json=' + JSON.stringify($scope.dataSearch)).then(response=>{
                if(response.id==="0"){
                    hideLoader();
                    form.sweetAlert('warning', response.message);
                    return
                }                                              
                
                $scope.carteraProveedores = JSON.parse(response.data) || []
                $scope.cloneCarteraProveedores = JSON.parse(JSON.stringify($scope.carteraProveedores));
                $scope.setTotalColumn();                    
                $("#modalFiltroCarteraProveedor").modal('hide'); 
                hideLoader();                                
            })
        } catch (error) {
            hideLoader();
            console.log(error)
        }
    };
            

    $scope.filterLocal = function(){
        $scope.carteraProveedores = $filter("filter")($scope.cloneCarteraProveedores, $scope.txtSearch);
        $scope.setTotalColumn();            
    }
    $scope.setTotalColumn = function(){            
        let total = 0, abono = 0, saldo = 0;
        for(let cartera of $scope.carteraProveedores){
            total +=cartera.total;
            abono +=cartera.abono;
            saldo +=cartera.saldo;
        }
        $scope.total = form.roundNumber(total, 5);
        $scope.abono = form.roundNumber(abono, 5);
        $scope.saldo = form.roundNumber(saldo, 5);            
    }

    $scope.openModalDocumento = async(item)=>{    
        try {            
            commonSvc.viewDetailDocument({
                id: item.idDocumento,
                codigoDocumento: item.codigo,
                size: 'xl',
                windowClass: 'uibModalFullScreen'
            }) 
        } catch (error) {
            console.log(error)
        }           
    }

}


